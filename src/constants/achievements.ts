import type { AchievementDefinition, GameState, StatKey } from '../store/types';

// Helper functions for self-contained checkCondition calculations

function getLevel(totalXP: number): number {
  let level = 1;
  while (true) {
    const required = Math.round(100 * Math.pow(level + 1, 1.8));
    if (totalXP >= required) {
      level++;
      if (level >= 100) return 100;
    } else {
      break;
    }
  }
  return level;
}

function getStatPoints(state: GameState): Record<StatKey, number> {
  const stats: Record<StatKey, number> = {
    focus: 0,
    discipline: 0,
    endurance: 0,
    wisdom: 0,
    vitality: 0,
  };
  for (const c of state.checkIns) {
    for (const tag of c.statsTagged) {
      if (tag in stats) {
        stats[tag]++;
      }
    }
  }
  return stats;
}

function getConsistency(state: GameState): number {
  if (state.checkIns.length === 0 || !state.quest) return 0;
  const start = new Date(state.quest.createdAt);
  const today = new Date();
  
  const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = todayDateOnly.getTime() - startDateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  
  if (diffDays < 14) return 0;
  return Math.min(100, Math.round((state.checkIns.length / diffDays) * 100));
}

function evaluateRank(state: GameState): string {
  if (state.checkIns.length === 0 || !state.quest) return 'E';
  const level = getLevel(state.checkIns.reduce((acc, c) => acc + c.xpEarned, 0));
  const consistency = getConsistency(state);
  
  if (level >= 95 && consistency >= 99) return 'SSS';
  if (level >= 85 && consistency >= 95) return 'SS';
  if (level >= 70 && consistency >= 88) return 'S';
  if (level >= 50 && consistency >= 78) return 'A';
  if (level >= 30 && consistency >= 65) return 'B';
  if (level >= 15 && consistency >= 50) return 'C';
  if (level >= 5 && consistency >= 30) return 'D';
  return 'E';
}

function checkComebackKing(state: GameState): boolean {
  const sorted = [...state.checkIns].sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < sorted.length - 2; i++) {
    const c0 = sorted[i - 1];
    const c1 = sorted[i];
    const c2 = sorted[i + 1];
    const c3 = sorted[i + 2];
    
    if (
      c0 && c1 && c2 && c3 &&
      c1.streakDay === 1 &&
      c2.streakDay === 2 &&
      c3.streakDay === 3
    ) {
      return true;
    }
  }
  return false;
}

function checkTheGrind(state: GameState): boolean {
  const sorted = [...state.checkIns].sort((a, b) => a.date.localeCompare(b.date));
  let consecutiveNotesCount = 0;
  for (const c of sorted) {
    if (c.note !== null && c.note.trim() !== '') {
      consecutiveNotesCount++;
      if (consecutiveNotesCount >= 30) return true;
    } else {
      consecutiveNotesCount = 0;
    }
  }
  return false;
}

function checkPhoenix(state: GameState): boolean {
  const sorted = [...state.checkIns].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length === 0) return false;
  
  let previousLongestBeforeReset = 0;
  let currentLongestAfterReset = 0;
  let hasHadReset = false;
  let runningStreak = 0;
  
  for (let i = 0; i < sorted.length; i++) {
    const c = sorted[i];
    if (!c) continue;
    
    if (c.streakDay === 1 && runningStreak > 0) {
      hasHadReset = true;
      if (runningStreak > previousLongestBeforeReset) {
        previousLongestBeforeReset = runningStreak;
      }
    }
    runningStreak = c.streakDay;
    if (hasHadReset) {
      if (runningStreak > currentLongestAfterReset) {
        currentLongestAfterReset = runningStreak;
      }
    }
  }
  
  return hasHadReset && currentLongestAfterReset > previousLongestBeforeReset;
}

export const ACHIEVEMENT_DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: 'A-01',
    name: 'First Blood',
    description: 'Log your very first check-in.',
    hidden: false,
    xpReward: 200,
    checkCondition: (state) => state.checkIns.length >= 1,
  },
  {
    id: 'A-02',
    name: 'Initiated',
    description: 'Reach Level 5.',
    hidden: false,
    xpReward: 50,
    checkCondition: (state) => {
      const totalXP = state.checkIns.reduce((acc, c) => acc + c.xpEarned, 0);
      return getLevel(totalXP) >= 5;
    },
  },
  {
    id: 'A-03',
    name: 'Week One',
    description: 'Maintain a 7-day streak.',
    hidden: false,
    xpReward: 100,
    checkCondition: (state) => state.streak.current >= 7 || state.streak.longest >= 7,
  },
  {
    id: 'A-04',
    name: 'The Long Road',
    description: 'Maintain a 30-day streak.',
    hidden: false,
    xpReward: 300,
    checkCondition: (state) => state.streak.current >= 30 || state.streak.longest >= 30,
  },
  {
    id: 'A-05',
    name: 'Century Mark',
    description: 'Maintain a 100-day streak.',
    hidden: false,
    xpReward: 500,
    checkCondition: (state) => state.streak.longest >= 100,
  },
  {
    id: 'A-06',
    name: 'Reflective',
    description: 'Add 10 total notes to your check-ins.',
    hidden: false,
    xpReward: 75,
    checkCondition: (state) => state.checkIns.filter((c) => c.note !== null && c.note.trim() !== '').length >= 10,
  },
  {
    id: 'A-07',
    name: 'Deep Thinker',
    description: 'Add 50 total notes to your check-ins.',
    hidden: false,
    xpReward: 150,
    checkCondition: (state) => state.checkIns.filter((c) => c.note !== null && c.note.trim() !== '').length >= 50,
  },
  {
    id: 'A-08',
    name: 'D-Rank Hunter',
    description: 'Reach D Rank.',
    hidden: false,
    xpReward: 100,
    checkCondition: (state) => evaluateRank(state) !== 'E',
  },
  {
    id: 'A-09',
    name: 'Elite Hunter',
    description: 'Reach A Rank.',
    hidden: false,
    xpReward: 300,
    checkCondition: (state) => {
      const rank = evaluateRank(state);
      return rank === 'A' || rank === 'S' || rank === 'SS' || rank === 'SSS';
    },
  },
  {
    id: 'A-10',
    name: 'Sovereign',
    description: 'Reach S Rank.',
    hidden: false,
    xpReward: 500,
    checkCondition: (state) => {
      const rank = evaluateRank(state);
      return rank === 'S' || rank === 'SS' || rank === 'SSS';
    },
  },
  {
    id: 'A-11',
    name: 'Immortal',
    description: 'Reach SSS Rank.',
    hidden: false,
    xpReward: 2000,
    checkCondition: (state) => evaluateRank(state) === 'SSS',
  },
  {
    id: 'A-12',
    name: 'Comeback King',
    description: 'Complete 3 check-ins consecutively after a streak break.',
    hidden: false,
    xpReward: 100,
    checkCondition: (state) => checkComebackKing(state),
  },
  {
    id: 'A-13',
    name: 'Iron Will',
    description: 'Maintain a 200-day streak.',
    hidden: false,
    xpReward: 700,
    checkCondition: (state) => state.streak.current >= 200 || state.streak.longest >= 200,
  },
  {
    id: 'A-14',
    name: 'Stat Master',
    description: 'Any single stat reaches 50 points.',
    hidden: false,
    xpReward: 200,
    checkCondition: (state) => {
      const stats = getStatPoints(state);
      return Object.values(stats).some((val) => val >= 50);
    },
  },
  {
    id: 'A-15',
    name: 'Balanced Hunter',
    description: 'All 5 stats reach above 10 points.',
    hidden: false,
    xpReward: 250,
    checkCondition: (state) => {
      const stats = getStatPoints(state);
      return Object.values(stats).every((val) => val > 10);
    },
  },
  {
    id: 'A-16',
    name: 'Year One',
    description: 'Complete 365 total check-ins.',
    hidden: false,
    xpReward: 2000,
    checkCondition: (state) => state.checkIns.length >= 365,
  },
  {
    id: 'A-17',
    name: 'Frozen in Time',
    description: 'Use your first streak freeze.',
    hidden: false,
    xpReward: 50,
    checkCondition: (state) => state.streak.freezesUsed >= 1,
  },
  {
    id: 'A-18',
    name: 'Ice Vault',
    description: 'Hold 3 freezes simultaneously.',
    hidden: false,
    xpReward: 75,
    checkCondition: (state) => state.streak.freezesAvailable >= 3,
  },
  {
    id: 'A-19',
    name: 'The Why',
    description: 'Complete the onboarding why field.',
    hidden: false,
    xpReward: 25,
    checkCondition: (state) => state.quest !== null && typeof state.quest.why === 'string' && state.quest.why.trim() !== '',
  },
  {
    id: 'A-20',
    name: 'Midnight Hunter',
    description: 'Check in between 11 PM and midnight local time.',
    hidden: false,
    xpReward: 30,
    checkCondition: (state) => {
      return state.checkIns.some((c) => {
        const hour = new Date(c.timestamp).getHours();
        return hour === 23;
      });
    },
  },
  {
    id: 'H-01',
    name: 'Ghost Protocol',
    description: 'Check in exactly at midnight (00:00).',
    hidden: true,
    xpReward: 50,
    checkCondition: (state) => {
      return state.checkIns.some((c) => {
        const date = new Date(c.timestamp);
        return date.getHours() === 0 && date.getMinutes() === 0;
      });
    },
  },
  {
    id: 'H-02',
    name: 'The Grind',
    description: 'Maintain a sequence of 30 check-ins with notes.',
    hidden: true,
    xpReward: 150,
    checkCondition: (state) => checkTheGrind(state),
  },
  {
    id: 'H-03',
    name: 'Unmovable',
    description: 'Reach a 50-day streak without using a single freeze.',
    hidden: true,
    xpReward: 200,
    checkCondition: (state) => {
      return (state.streak.current >= 50 || state.streak.longest >= 50) && state.streak.freezesUsed === 0;
    },
  },
  {
    id: 'H-04',
    name: 'Phoenix',
    description: 'Rebuild a longest streak exceeding your pre-reset record.',
    hidden: true,
    xpReward: 300,
    checkCondition: (state) => checkPhoenix(state),
  },
  {
    id: 'H-05',
    name: 'Beyond Limits',
    description: 'Reach Level 75.',
    hidden: true,
    xpReward: 500,
    checkCondition: (state) => {
      const totalXP = state.checkIns.reduce((acc, c) => acc + c.xpEarned, 0);
      return getLevel(totalXP) >= 75;
    },
  },
];
