import { describe, it, expect } from 'vitest';
import type { StreakState } from '../store/types';
import {
  calculateNewStreakState,
  checkFreezeEligibility,
  applyFreeze,
  awardFreezeIfEligible,
} from './streaks';

describe('Streak State Machine', () => {
  const initialStreak: StreakState = {
    current: 0,
    longest: 0,
    lastCheckInDate: null,
    freezesAvailable: 0,
    freezesUsed: 0,
    freezeActivatedForDate: null,
    inComebackMode: false,
    comebackDaysRemaining: 0,
  };

  describe('calculateNewStreakState - Check-ins', () => {
    it('sets streak to 1 on the first check-in ever', () => {
      const result = calculateNewStreakState(initialStreak, '2026-05-18', true);
      expect(result.current).toBe(1);
      expect(result.longest).toBe(1);
      expect(result.lastCheckInDate).toBe('2026-05-18');
    });

    it('increments streak on consecutive days', () => {
      const state1 = calculateNewStreakState(initialStreak, '2026-05-17', true);
      const state2 = calculateNewStreakState(state1, '2026-05-18', true);
      expect(state2.current).toBe(2);
      expect(state2.longest).toBe(2);
      expect(state2.lastCheckInDate).toBe('2026-05-18');
    });

    it('remains idempotent for same-day check-ins', () => {
      const state1 = calculateNewStreakState(initialStreak, '2026-05-18', true);
      const state2 = calculateNewStreakState(state1, '2026-05-18', true);
      expect(state2.current).toBe(1);
      expect(state2.lastCheckInDate).toBe('2026-05-18');
    });

    it('resets current streak to 1 on checking in after an unprotected gap > 1 day', () => {
      const state1 = calculateNewStreakState(initialStreak, '2026-05-15', true);
      const state2 = calculateNewStreakState(state1, '2026-05-18', true); // 3-day gap
      expect(state2.current).toBe(1);
      expect(state2.longest).toBe(1); // Longest is preserved
    });

    it('decrements comebackDaysRemaining on consecutive check-ins', () => {
      const fallenState: StreakState = {
        ...initialStreak,
        current: 0,
        longest: 5,
        lastCheckInDate: '2026-05-15',
        inComebackMode: true,
        comebackDaysRemaining: 3,
      };

      const checkIn1 = calculateNewStreakState(fallenState, '2026-05-18', true);
      expect(checkIn1.current).toBe(1);
      expect(checkIn1.inComebackMode).toBe(true);
      expect(checkIn1.comebackDaysRemaining).toBe(2);

      const checkIn2 = calculateNewStreakState(checkIn1, '2026-05-19', true);
      expect(checkIn2.current).toBe(2);
      expect(checkIn2.inComebackMode).toBe(true);
      expect(checkIn2.comebackDaysRemaining).toBe(1);

      const checkIn3 = calculateNewStreakState(checkIn2, '2026-05-20', true);
      expect(checkIn3.current).toBe(3);
      expect(checkIn3.inComebackMode).toBe(false);
      expect(checkIn3.comebackDaysRemaining).toBe(0);
    });
  });

  describe('calculateNewStreakState - Missed Days (App Open)', () => {
    it('activates Comeback Mode and resets current streak to 0 on detecting unprotected gap > 1 day', () => {
      const activeState: StreakState = {
        ...initialStreak,
        current: 4,
        longest: 4,
        lastCheckInDate: '2026-05-16',
      };
      
      const result = calculateNewStreakState(activeState, '2026-05-18', false); // 2 days since check-in, missed 17th
      expect(result.current).toBe(0);
      expect(result.longest).toBe(4);
      expect(result.inComebackMode).toBe(true);
      expect(result.comebackDaysRemaining).toBe(3);
    });

    it('preserves current streak when gap is protected by an active freeze', () => {
      const activeState: StreakState = {
        ...initialStreak,
        current: 5,
        longest: 5,
        lastCheckInDate: '2026-05-16',
        freezesAvailable: 1,
        freezeActivatedForDate: '2026-05-17', // Tuesday frozen
      };

      // Missed day checks on Wednesday open
      const result = calculateNewStreakState(activeState, '2026-05-18', false);
      expect(result.current).toBe(5); // Preserved!
      expect(result.inComebackMode).toBe(false);
    });

    it('continues the streak when checking in after a protected gap', () => {
      const activeState: StreakState = {
        ...initialStreak,
        current: 5,
        longest: 5,
        lastCheckInDate: '2026-05-16',
        freezesAvailable: 1,
        freezeActivatedForDate: '2026-05-17', // Missed 17th frozen
      };

      const checkedInState = calculateNewStreakState(activeState, '2026-05-18', true); // Checked in Wednesday
      expect(checkedInState.current).toBe(6); // Incremented from 5!
      expect(checkedInState.freezeActivatedForDate).toBeNull(); // Cleared
    });
  });

  describe('Streak Freeze Mechanics', () => {
    it('is eligible for freeze if 1 day ago', () => {
      const streak: StreakState = {
        ...initialStreak,
        freezesAvailable: 2,
        lastCheckInDate: '2026-05-17',
      };
      expect(checkFreezeEligibility(streak, '2026-05-18')).toBe(true);
    });

    it('is eligible for freeze if 2 days ago (within 48h grace window)', () => {
      const streak: StreakState = {
        ...initialStreak,
        freezesAvailable: 2,
        lastCheckInDate: '2026-05-16',
      };
      expect(checkFreezeEligibility(streak, '2026-05-18')).toBe(true); // Monday check-in, missed Tuesday, checking Wednesday
    });

    it('is not eligible for freeze if gap is greater than 2 days (past grace window)', () => {
      const streak: StreakState = {
        ...initialStreak,
        freezesAvailable: 2,
        lastCheckInDate: '2026-05-15',
      };
      expect(checkFreezeEligibility(streak, '2026-05-18')).toBe(false);
    });

    it('is not eligible if freezesAvailable is 0', () => {
      const streak: StreakState = {
        ...initialStreak,
        freezesAvailable: 0,
        lastCheckInDate: '2026-05-17',
      };
      expect(checkFreezeEligibility(streak, '2026-05-18')).toBe(false);
    });

    it('applies freeze by deducting one freeze and tracking usage', () => {
      const streak: StreakState = {
        ...initialStreak,
        current: 12,
        freezesAvailable: 2,
        freezesUsed: 1,
      };
      const result = applyFreeze(streak, '2026-05-17');
      expect(result.freezesAvailable).toBe(1);
      expect(result.freezesUsed).toBe(2);
      expect(result.freezeActivatedForDate).toBe('2026-05-17');
      expect(result.current).toBe(12); // Streak preserved
    });
  });

  describe('awardFreezeIfEligible', () => {
    it('awards a freeze at day 7, 14, 21 milestones', () => {
      const streak7: StreakState = { ...initialStreak, current: 7, freezesAvailable: 1 };
      const streak14: StreakState = { ...initialStreak, current: 14, freezesAvailable: 1 };
      const streak21: StreakState = { ...initialStreak, current: 21, freezesAvailable: 2 };
      
      expect(awardFreezeIfEligible(streak7).freezesAvailable).toBe(2);
      expect(awardFreezeIfEligible(streak14).freezesAvailable).toBe(2);
      expect(awardFreezeIfEligible(streak21).freezesAvailable).toBe(3);
    });

    it('caps maximum freezes available at 3', () => {
      const streak: StreakState = { ...initialStreak, current: 7, freezesAvailable: 3 };
      expect(awardFreezeIfEligible(streak).freezesAvailable).toBe(3);
    });

    it('does not award freezes on non-milestone days', () => {
      const streak8: StreakState = { ...initialStreak, current: 8, freezesAvailable: 1 };
      expect(awardFreezeIfEligible(streak8).freezesAvailable).toBe(1);
    });
  });
});
