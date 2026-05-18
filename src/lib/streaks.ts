import { addDays, parseISO, format } from 'date-fns';
import { StreakState } from '../store/types';
import { isConsecutiveDay, getDaysDifference } from './dates';

/**
 * Derives a new StreakState based on check-in activities or daily midnight checks.
 * Integrates freeze protections, comeback multipliers, and longest streak caps.
 */
export function calculateNewStreakState(
  currentStreak: StreakState,
  today: string,
  isCheckIn: boolean
): StreakState {
  let current = currentStreak.current;
  let longest = currentStreak.longest;
  let lastCheckInDate = currentStreak.lastCheckInDate;
  let freezesAvailable = currentStreak.freezesAvailable;
  let freezesUsed = currentStreak.freezesUsed;
  let freezeActivatedForDate = currentStreak.freezeActivatedForDate;
  let inComebackMode = currentStreak.inComebackMode;
  let comebackDaysRemaining = currentStreak.comebackDaysRemaining;

  if (isCheckIn) {
    if (lastCheckInDate === null) {
      current = 1;
    } else if (lastCheckInDate === today) {
      // Idempotent check-in
      return currentStreak;
    } else {
      const isConsecutive = isConsecutiveDay(lastCheckInDate, today);
      
      // Determine if the single missed day gap was protected by an active freeze
      let isProtectedByFreeze = false;
      if (freezeActivatedForDate && getDaysDifference(today, lastCheckInDate) === 2) {
        const missedDate = format(addDays(parseISO(lastCheckInDate), 1), 'yyyy-MM-dd');
        isProtectedByFreeze = freezeActivatedForDate === missedDate;
      }

      if (isConsecutive || isProtectedByFreeze) {
        current += 1;
      } else {
        current = 1;
      }
    }

    if (current > longest) {
      longest = current;
    }

    if (inComebackMode && comebackDaysRemaining > 0) {
      comebackDaysRemaining -= 1;
      if (comebackDaysRemaining === 0) {
        inComebackMode = false;
      }
    }

    lastCheckInDate = today;
    // Clear freeze since a fresh check-in is logged
    freezeActivatedForDate = null;
  } else {
    // Periodic missed day detection (e.g. app open)
    if (lastCheckInDate !== null) {
      const diff = getDaysDifference(today, lastCheckInDate);
      
      let isProtectedByFreeze = false;
      if (freezeActivatedForDate && diff === 2) {
        const missedDate = format(addDays(parseISO(lastCheckInDate), 1), 'yyyy-MM-dd');
        isProtectedByFreeze = freezeActivatedForDate === missedDate;
      }

      // If gap is more than 1 day and unprotected, streak breaks
      if (diff > 1 && !isProtectedByFreeze) {
        current = 0;
        inComebackMode = true;
        comebackDaysRemaining = 3;
      }
    }
  }

  return {
    current,
    longest,
    lastCheckInDate,
    freezesAvailable,
    freezesUsed,
    freezeActivatedForDate,
    inComebackMode,
    comebackDaysRemaining,
  };
}

/**
 * Checks if the user qualifies to use a Streak Freeze.
 * Requires having at least 1 freeze available, and last check-in date is 1 or 2 days ago (48h grace window).
 */
export function checkFreezeEligibility(streak: StreakState, today: string): boolean {
  if (streak.freezesAvailable <= 0 || streak.lastCheckInDate === null) {
    return false;
  }
  const diff = getDaysDifference(today, streak.lastCheckInDate);
  return diff === 1 || diff === 2;
}

/**
 * Deducts an available freeze to protect the specified missed date, preserving the current streak.
 */
export function applyFreeze(streak: StreakState, forDate: string): StreakState {
  return {
    ...streak,
    freezesAvailable: Math.max(0, streak.freezesAvailable - 1),
    freezesUsed: streak.freezesUsed + 1,
    freezeActivatedForDate: forDate,
  };
}

/**
 * Awards a new Streak Freeze at every 7-day milestone (7, 14, 21...), capped at a maximum of 3.
 */
export function awardFreezeIfEligible(streak: StreakState): StreakState {
  if (streak.current % 7 === 0 && streak.current > 0 && streak.freezesAvailable < 3) {
    return {
      ...streak,
      freezesAvailable: streak.freezesAvailable + 1,
    };
  }
  return streak;
}
