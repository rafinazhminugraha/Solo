import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { addDays, parseISO, format } from 'date-fns';

import type {
  GameState,
  Quest,
  CheckIn,
  PendingCeremony,
  UserSettings,
  StatKey,
  BonusEvent,
  PlayerStats,
} from './types';

import {
  calculateCheckInXP,
  calculateStreakMilestoneBonus,
  isComebackActive,
  applyComebackBonus,
} from '../lib/xp';

import {
  levelFromXP,
  xpProgressInLevel,
} from '../lib/levels';

import {
  calculateConsistency,
  evaluateRank,
  RANK_ORDER,
} from '../lib/ranks';

import {
  calculateNewStreakState,
  checkFreezeEligibility,
  applyFreeze,
  awardFreezeIfEligible,
} from '../lib/streaks';

import {
  computeStatPoints,
  checkAchievements,
  buildEarnedAchievement,
} from '../lib/achievements';

import {
  getTodayDateString,
  getDaysDifference,
} from '../lib/dates';

export interface GameStore extends GameState {
  completeOnboarding: (quest: Omit<Quest, 'id' | 'createdAt'>) => void;
  performCheckIn: (note: string | null, statsTagged: StatKey[]) => void;
  activateFreeze: () => void;
  clearPendingCeremony: () => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetStreak: () => void;
  fullReset: () => void;
}

const INITIAL_STATE: GameState = {
  version: 1,
  quest: null,
  checkIns: [],
  streak: {
    current: 0,
    longest: 0,
    lastCheckInDate: null,
    freezesAvailable: 0,
    freezesUsed: 0,
    freezeActivatedForDate: null,
    inComebackMode: false,
    comebackDaysRemaining: 0,
  },
  earnedAchievements: [],
  hasCompletedOnboarding: false,
  pendingCeremony: null,
  settings: {
    theme: 'dark',
    reminderTime: null,
    reminderEnabled: false,
  },
  bonusXPEvents: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      completeOnboarding: (questInput) => {
        const newQuest: Quest = {
          ...questInput,
          id: nanoid(),
          createdAt: new Date().toISOString(),
        };

        const initialBonusXPEvents: BonusEvent[] = [];
        if (newQuest.why && newQuest.why.trim().length > 0) {
          initialBonusXPEvents.push({
            type: 'first_checkin',
            label: 'Set your why',
            xp: 25,
          });
        }

        set((state) => {
          const tempState: GameState = {
            ...state,
            quest: newQuest,
            hasCompletedOnboarding: true,
            bonusXPEvents: initialBonusXPEvents,
          };

          const statPoints = computeStatPoints(tempState.checkIns);
          const totalXP = tempState.bonusXPEvents.reduce((acc, e) => acc + e.xp, 0);
          const level = levelFromXP(totalXP);
          const consistency = calculateConsistency(tempState.checkIns.length, 1);
          const rank = evaluateRank(level, consistency);

          const newlyEarned = checkAchievements(tempState, statPoints, level, rank);
          const earnedAchievements = [...state.earnedAchievements];
          const bonusXPEvents = [...initialBonusXPEvents];

          for (const def of newlyEarned) {
            earnedAchievements.push(buildEarnedAchievement(def));
            bonusXPEvents.push({
              type: 'achievement',
              label: `Unlocked: ${def.name}`,
              xp: def.xpReward,
            });
          }

          return {
            quest: newQuest,
            hasCompletedOnboarding: true,
            bonusXPEvents,
            earnedAchievements,
          };
        });
      },

      performCheckIn: (note, statsTagged) => {
        const state = get();
        const today = getTodayDateString();

        // Idempotency check: Already checked in today
        const alreadyCheckedIn = state.checkIns.some((c) => c.date === today);
        if (alreadyCheckedIn) {
          return;
        }

        // Calculate streak state transitions
        let newStreak = calculateNewStreakState(state.streak, today, true);
        newStreak = awardFreezeIfEligible(newStreak);

        // Compute XP metrics
        const baseXP = calculateCheckInXP(newStreak.current, !!note, statsTagged.length);
        const checkInXP = isComebackActive(state.streak) ? applyComebackBonus(baseXP) : baseXP;
        const milestoneBonusXP = calculateStreakMilestoneBonus(newStreak.current) ?? 0;
        const xpEarned = checkInXP + milestoneBonusXP;

        // Build CheckIn Bonus XP log events
        const checkInBonusEvents: BonusEvent[] = [];
        if (note) {
          checkInBonusEvents.push({ type: 'note', label: 'Reflection note bonus', xp: 10 });
        }
        if (isComebackActive(state.streak)) {
          checkInBonusEvents.push({
            type: 'comeback',
            label: 'Comeback Mode bonus (+20%)',
            xp: checkInXP - baseXP,
          });
        }
        if (milestoneBonusXP > 0) {
          checkInBonusEvents.push({
            type: 'streak_milestone',
            label: `${newStreak.current}-day streak milestone`,
            xp: milestoneBonusXP,
          });
        }

        // Calculate levels and ranks before check-in (for ceremony check)
        const oldTotalXP =
          state.checkIns.reduce((acc, c) => acc + c.xpEarned, 0) +
          state.bonusXPEvents.reduce((acc, e) => acc + e.xp, 0);
        const oldLevel = levelFromXP(oldTotalXP);

        const totalDaysBefore = state.quest
          ? getDaysDifference(today, state.quest.createdAt) + 1
          : 1;
        const oldConsistency = calculateConsistency(state.checkIns.length, totalDaysBefore);
        const oldRank = evaluateRank(oldLevel, oldConsistency);

        // Build new check-in block
        const newCheckIn: CheckIn = {
          id: nanoid(),
          date: today,
          xpEarned,
          streakDay: newStreak.current,
          note,
          statsTagged,
          bonusEvents: checkInBonusEvents,
          timestamp: new Date().toISOString(),
        };

        const newTotalXP = oldTotalXP + xpEarned;
        const newLevel = levelFromXP(newTotalXP);
        const newConsistency = calculateConsistency(state.checkIns.length + 1, totalDaysBefore);
        const newRank = evaluateRank(newLevel, newConsistency);

        // Verify ceremonies to display
        let pendingCeremony: PendingCeremony | null = null;
        if (newLevel > oldLevel) {
          pendingCeremony = {
            type: 'level_up',
            previousValue: oldLevel,
            newValue: newLevel,
            xpGained: xpEarned,
          };
        } else if (RANK_ORDER.indexOf(newRank) > RANK_ORDER.indexOf(oldRank)) {
          pendingCeremony = {
            type: 'rank_up',
            previousValue: oldRank,
            newValue: newRank,
          };
        }

        set((currentState) => {
          // Prepare temporary state for achievement evaluation
          const tempState: GameState = {
            ...currentState,
            checkIns: [...currentState.checkIns, newCheckIn],
            streak: newStreak,
          };

          const currentStats = computeStatPoints(tempState.checkIns);
          const newlyEarned = checkAchievements(tempState, currentStats, newLevel, newRank);
          
          const earnedAchievements = [...currentState.earnedAchievements];
          const bonusXPEvents = [...currentState.bonusXPEvents];

          for (const def of newlyEarned) {
            earnedAchievements.push(buildEarnedAchievement(def));
            bonusXPEvents.push({
              type: 'achievement',
              label: `Unlocked: ${def.name}`,
              xp: def.xpReward,
            });
          }

          return {
            checkIns: [...currentState.checkIns, newCheckIn],
            streak: newStreak,
            earnedAchievements,
            bonusXPEvents,
            pendingCeremony,
          };
        });
      },

      activateFreeze: () => {
        const state = get();
        const today = getTodayDateString();

        if (!checkFreezeEligibility(state.streak, today)) {
          return;
        }

        const protectDate = format(addDays(parseISO(state.streak.lastCheckInDate!), 1), 'yyyy-MM-dd');
        const updatedStreak = applyFreeze(state.streak, protectDate);

        set({ streak: updatedStreak });
      },

      clearPendingCeremony: () => {
        set((state) => {
          const prevCeremony = state.pendingCeremony;
          
          // Sequential ceremony check: If leveling up also triggered a rank up, queue it next
          if (prevCeremony && prevCeremony.type === 'level_up' && state.checkIns.length > 0) {
            const lastCheckIn = state.checkIns[state.checkIns.length - 1]!;
            const totalXPAfter =
              state.checkIns.reduce((acc, c) => acc + c.xpEarned, 0) +
              state.bonusXPEvents.reduce((acc, e) => acc + e.xp, 0);
            const totalXPBefore = totalXPAfter - lastCheckIn.xpEarned;

            const levelBefore = levelFromXP(totalXPBefore);
            const levelAfter = levelFromXP(totalXPAfter);

            const totalDays = state.quest
              ? getDaysDifference(lastCheckIn.date, state.quest.createdAt) + 1
              : 1;
            
            const consistencyBefore = calculateConsistency(state.checkIns.length - 1, totalDays);
            const consistencyAfter = calculateConsistency(state.checkIns.length, totalDays);

            const rankBefore = evaluateRank(levelBefore, consistencyBefore);
            const rankAfter = evaluateRank(levelAfter, consistencyAfter);

            if (RANK_ORDER.indexOf(rankAfter) > RANK_ORDER.indexOf(rankBefore)) {
              return {
                pendingCeremony: {
                  type: 'rank_up',
                  previousValue: rankBefore,
                  newValue: rankAfter,
                },
              };
            }
          }

          return { pendingCeremony: null };
        });
      },

      updateSettings: (partial) => {
        set((state) => ({
          settings: {
            ...state.settings,
            ...partial,
          },
        }));
      },

      resetStreak: () => {
        set((state) => ({
          streak: {
            ...state.streak,
            current: 0,
          },
        }));
      },

      fullReset: () => {
        set(() => INITIAL_STATE);
      },
    }),
    {
      name: 'solo-quest-v1',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 1) {
          // Future migrations placeholder
        }
        return persistedState as GameStore;
      },
    }
  )
);

/**
 * Derived selectors hook that extracts and calculates reactive runtime PlayerStats
 * from the game store, ensuring no state mutations or redundancy.
 */
export function useComputedStats(): PlayerStats {
  const checkIns = useGameStore((state) => state.checkIns);
  const bonusXPEvents = useGameStore((state) => state.bonusXPEvents);
  const quest = useGameStore((state) => state.quest);

  const totalXP =
    checkIns.reduce((acc, c) => acc + c.xpEarned, 0) +
    bonusXPEvents.reduce((acc, e) => acc + e.xp, 0);

  const level = levelFromXP(totalXP);
  const { current: xpInCurrentLevel, required: xpToNextLevel } = xpProgressInLevel(totalXP);

  const totalCheckIns = checkIns.length;
  let totalDaysSinceStart = 0;

  if (quest) {
    totalDaysSinceStart = getDaysDifference(getTodayDateString(), quest.createdAt) + 1;
  }

  const consistencyScore = calculateConsistency(totalCheckIns, totalDaysSinceStart);
  const rank = evaluateRank(level, consistencyScore);
  const statPoints = computeStatPoints(checkIns);

  return {
    totalXP,
    level,
    xpInCurrentLevel,
    xpToNextLevel,
    rank,
    consistencyScore,
    totalCheckIns,
    totalDaysSinceStart,
    statPoints,
  };
}
