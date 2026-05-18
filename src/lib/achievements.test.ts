import { describe, it, expect } from 'vitest';
import { GameState, CheckIn, Quest } from '../store/types';
import {
  computeStatPoints,
  checkAchievements,
  buildEarnedAchievement,
} from './achievements';

describe('Achievements Evaluation Engine', () => {
  const defaultQuest: Quest = {
    id: 'quest-1',
    name: 'Push ups',
    category: 'body',
    why: null,
    createdAt: '2026-05-18T00:00:00Z',
  };

  const defaultState: GameState = {
    version: 1,
    quest: defaultQuest,
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
    hasCompletedOnboarding: true,
    pendingCeremony: null,
    settings: {
      theme: 'dark',
      reminderTime: null,
      reminderEnabled: false,
    },
  };

  describe('computeStatPoints', () => {
    it('correctly aggregates multi-stat check-ins', () => {
      const checkIns: CheckIn[] = [
        {
          id: '1',
          date: '2026-05-16',
          xpEarned: 100,
          streakDay: 1,
          note: null,
          statsTagged: ['focus', 'discipline'],
          bonusEvents: [],
          timestamp: '2026-05-16T10:00:00Z',
        },
        {
          id: '2',
          date: '2026-05-17',
          xpEarned: 100,
          streakDay: 2,
          note: null,
          statsTagged: ['discipline', 'endurance'],
          bonusEvents: [],
          timestamp: '2026-05-17T10:00:00Z',
        },
      ];

      const stats = computeStatPoints(checkIns);
      expect(stats.focus).toBe(1);
      expect(stats.discipline).toBe(2);
      expect(stats.endurance).toBe(1);
      expect(stats.wisdom).toBe(0);
      expect(stats.vitality).toBe(0);
    });
  });

  describe('checkAchievements', () => {
    it('triggers A-01 (First Blood) when checkIns.length === 1', () => {
      const state: GameState = {
        ...defaultState,
        checkIns: [
          {
            id: '1',
            date: '2026-05-18',
            xpEarned: 100,
            streakDay: 1,
            note: null,
            statsTagged: [],
            bonusEvents: [],
            timestamp: '2026-05-18T10:00:00Z',
          },
        ],
      };

      const earned = checkAchievements(state, { focus: 0, discipline: 0, endurance: 0, wisdom: 0, vitality: 0 }, 1, 'E');
      const earnedIds = earned.map((a) => a.id);
      expect(earnedIds).toContain('A-01');
    });

    it('does NOT trigger A-01 if it is already in earnedAchievements', () => {
      const state: GameState = {
        ...defaultState,
        checkIns: [
          {
            id: '1',
            date: '2026-05-18',
            xpEarned: 100,
            streakDay: 1,
            note: null,
            statsTagged: [],
            bonusEvents: [],
            timestamp: '2026-05-18T10:00:00Z',
          },
        ],
        earnedAchievements: [
          {
            achievementId: 'A-01',
            earnedAt: '2026-05-18T10:00:00Z',
          },
        ],
      };

      const earned = checkAchievements(state, { focus: 0, discipline: 0, endurance: 0, wisdom: 0, vitality: 0 }, 1, 'E');
      const earnedIds = earned.map((a) => a.id);
      expect(earnedIds).not.toContain('A-01');
    });

    it('triggers A-19 (The Why) when quest.why is a non-empty string', () => {
      const state: GameState = {
        ...defaultState,
        quest: {
          ...defaultQuest,
          why: 'To build muscle and stay strong.',
        },
      };

      const earned = checkAchievements(state, { focus: 0, discipline: 0, endurance: 0, wisdom: 0, vitality: 0 }, 1, 'E');
      const earnedIds = earned.map((a) => a.id);
      expect(earnedIds).toContain('A-19');
    });

    it('triggers A-06 (Reflective) when 10+ check-ins have non-null and non-empty notes', () => {
      const checkIns: CheckIn[] = Array.from({ length: 10 }, (_, i) => ({
        id: `c-${i}`,
        date: `2026-05-${10 + i}`,
        xpEarned: 100,
        streakDay: i + 1,
        note: 'Feeling good today!',
        statsTagged: [],
        bonusEvents: [],
        timestamp: `2026-05-${10 + i}T10:00:00Z`,
      }));

      const state: GameState = {
        ...defaultState,
        checkIns,
      };

      const earned = checkAchievements(state, { focus: 0, discipline: 0, endurance: 0, wisdom: 0, vitality: 0 }, 1, 'E');
      const earnedIds = earned.map((a) => a.id);
      expect(earnedIds).toContain('A-06');
    });
  });

  describe('buildEarnedAchievement', () => {
    it('constructs a valid EarnedAchievement block', () => {
      const mockDef = {
        id: 'A-01',
        name: 'First Blood',
        description: 'Mock',
        hidden: false,
        xpReward: 200,
        checkCondition: () => true,
      };
      
      const earned = buildEarnedAchievement(mockDef);
      expect(earned.achievementId).toBe('A-01');
      expect(earned.earnedAt).toBeDefined();
      expect(new Date(earned.earnedAt).getTime()).toBeGreaterThan(0);
    });
  });
});
