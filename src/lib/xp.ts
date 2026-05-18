import { StreakState } from '../store/types';

/**
 * Calculates the multiplier for a given streak.
 * Formula: 1.0 + Math.min(streak / 100, 1.0)
 * Hard capped at 2.0x.
 */
export function calculateStreakMultiplier(streak: number): number {
  return 1.0 + Math.min(streak / 100, 1.0);
}

/**
 * Calculates total check-in XP earned.
 * Formula: Math.round(100 * streakMultiplier) + noteBonus + statBonus
 */
export function calculateCheckInXP(streak: number, hasNote: boolean, statCount: number): number {
  const base = 100;
  const multiplier = calculateStreakMultiplier(streak);
  const noteBonus = hasNote ? 10 : 0;
  const statBonus = statCount * 5;
  return Math.round(base * multiplier) + noteBonus + statBonus;
}

/**
 * Returns bonus XP for specific streak milestones.
 * Returns null if the streak day is not a milestone.
 */
export function calculateStreakMilestoneBonus(streakDays: number): number | null {
  switch (streakDays) {
    case 7:
      return 100;
    case 14:
      return 150;
    case 30:
      return 300;
    case 60:
      return 400;
    case 100:
      return 500;
    case 200:
      return 700;
    case 365:
      return 2000;
    default:
      return null;
  }
}

/**
 * Returns true if the player is currently in Comeback Mode with days remaining.
 */
export function isComebackActive(streak: StreakState): boolean {
  return streak.inComebackMode && streak.comebackDaysRemaining > 0;
}

/**
 * Applies the 20% Comeback Mode bonus to a base XP value.
 */
export function applyComebackBonus(baseXP: number): number {
  return Math.round(baseXP * 1.2);
}
