export type QuestCategory = 'mind' | 'body' | 'skill' | 'create' | 'health' | 'custom';

export interface Quest {
  id: string;                        // nanoid()
  name: string;                      // e.g., "Meditate 20 minutes"
  category: QuestCategory;           // 'mind' | 'body' | 'skill' | 'create' | 'health' | 'custom'
  why: string | null;                // User's personal why
  createdAt: string;                 // ISO 8601 date string
  customCategoryLabel?: string;      // Only if category === 'custom'
}

export type StatKey = 'focus' | 'discipline' | 'endurance' | 'wisdom' | 'vitality';

export interface BonusEvent {
  type: 'note' | 'streak_milestone' | 'achievement' | 'comeback' | 'first_checkin';
  xp: number;
  label: string;
}

export interface CheckIn {
  id: string;                        // nanoid()
  date: string;                      // 'YYYY-MM-DD' format (local date)
  xpEarned: number;                  // Total XP including bonuses
  streakDay: number;                 // Streak length at time of check-in
  note: string | null;               // Optional reflection note
  statsTagged: StatKey[];            // ['focus', 'discipline', ...] (0–5 items)
  bonusEvents: BonusEvent[];         // Log of bonus XP sources
  timestamp: string;                 // ISO 8601 full datetime
}

export interface StreakState {
  current: number;
  longest: number;
  lastCheckInDate: string | null;    // 'YYYY-MM-DD'
  freezesAvailable: number;          // 0–3
  freezesUsed: number;               // Lifetime count
  freezeActivatedForDate: string | null; // Date freeze is protecting
  inComebackMode: boolean;
  comebackDaysRemaining: number;     // 0–3
}

export type RankKey = 'E' | 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS';

export interface PlayerStats {
  totalXP: number;
  level: number;
  xpInCurrentLevel: number;         // XP earned within current level
  xpToNextLevel: number;            // XP needed to reach next level
  rank: RankKey;
  consistencyScore: number;         // 0–100
  totalCheckIns: number;
  totalDaysSinceStart: number;
  statPoints: Record<StatKey, number>; // e.g., { focus: 23, discipline: 41, ... }
}

export interface RankDefinition {
  key: RankKey;
  title: string;                    // "Ordinary Human", "Hunter Initiate", etc.
  minConsistency: number;           // 0–100
  minLevel: number;
  color: string;                    // Hex
  glowColor: string;                // For CSS box-shadow
  auraType: 'none' | 'pulse' | 'glow' | 'ring' | 'flare' | 'shockwave' | 'flame' | 'prismatic';
}

export interface AchievementDefinition {
  id: string;                       // e.g., 'A-01'
  name: string;
  description: string;
  hidden: boolean;                  // True = not visible until unlocked
  xpReward: number;
  checkCondition: (state: GameState) => boolean;
}

export interface EarnedAchievement {
  achievementId: string;
  earnedAt: string;                 // ISO 8601
}

export interface PendingCeremony {
  type: 'level_up' | 'rank_up' | 'streak_milestone';
  previousValue: string | number;
  newValue: string | number;
  xpGained?: number;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  reminderTime: string | null;      // '21:00' format
  reminderEnabled: boolean;
}

export interface GameState {
  version: number;                  // Schema version for migration
  quest: Quest | null;
  checkIns: CheckIn[];
  streak: StreakState;
  earnedAchievements: EarnedAchievement[];
  hasCompletedOnboarding: boolean;
  pendingCeremony: PendingCeremony | null;  // Level-up or rank-up awaiting display
  settings: UserSettings;
}

// Derived runtime game stats
export interface ComputedStats {
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  consistencyScore: number;
  rank: RankKey;
  totalCheckIns: number;
  totalDaysSinceStart: number;
  statPoints: Record<StatKey, number>;
}

// Core client navigation state
export type AppView = 'dashboard' | 'journal' | 'stats' | 'settings';
