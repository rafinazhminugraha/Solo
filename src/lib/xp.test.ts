import { describe, it, expect } from 'vitest';
import {
  calculateStreakMultiplier,
  calculateCheckInXP,
  calculateStreakMilestoneBonus,
  isComebackActive,
  applyComebackBonus,
} from './xp';
import type { StreakState } from '../store/types';

describe('XP Calculation Rules', () => {
  describe('calculateStreakMultiplier', () => {
    it('returns 1.0 for a streak of 0', () => {
      expect(calculateStreakMultiplier(0)).toBe(1.0);
    });

    it('returns 1.5 for a streak of 50', () => {
      expect(calculateStreakMultiplier(50)).toBe(1.5);
    });

    it('returns 2.0 for a streak of 100', () => {
      expect(calculateStreakMultiplier(100)).toBe(2.0);
    });

    it('caps the streak multiplier at 2.0 for streaks above 100', () => {
      expect(calculateStreakMultiplier(200)).toBe(2.0);
    });
  });

  describe('calculateCheckInXP', () => {
    it('calculates baseline XP with zero streak, notes, or tags', () => {
      expect(calculateCheckInXP(0, false, 0)).toBe(100);
    });

    it('calculates maximum possible check-in XP for 100+ day streak with note and 5 tags', () => {
      expect(calculateCheckInXP(100, true, 5)).toBe(235);
    });

    it('calculates mid-streak XP with zero tags or notes', () => {
      expect(calculateCheckInXP(10, false, 0)).toBe(110);
    });
  });

  describe('calculateStreakMilestoneBonus', () => {
    it('returns 100 for a 7-day streak milestone', () => {
      expect(calculateStreakMilestoneBonus(7)).toBe(100);
    });

    it('returns null for non-milestone days', () => {
      expect(calculateStreakMilestoneBonus(8)).toBeNull();
    });

    it('returns 2000 for a 365-day streak milestone', () => {
      expect(calculateStreakMilestoneBonus(365)).toBe(2000);
    });
  });

  describe('isComebackActive & applyComebackBonus', () => {
    it('returns true when inComebackMode is true and days remaining is greater than 0', () => {
      const mockStreak: StreakState = {
        current: 1,
        longest: 5,
        lastCheckInDate: '2026-05-18',
        freezesAvailable: 1,
        freezesUsed: 0,
        freezeActivatedForDate: null,
        inComebackMode: true,
        comebackDaysRemaining: 2,
      };
      expect(isComebackActive(mockStreak)).toBe(true);
    });

    it('returns false when comebackDaysRemaining is 0', () => {
      const mockStreak: StreakState = {
        current: 3,
        longest: 5,
        lastCheckInDate: '2026-05-18',
        freezesAvailable: 1,
        freezesUsed: 0,
        freezeActivatedForDate: null,
        inComebackMode: true,
        comebackDaysRemaining: 0,
      };
      expect(isComebackActive(mockStreak)).toBe(false);
    });

    it('applies a 20% multiplier bonus to base XP and rounds it', () => {
      expect(applyComebackBonus(100)).toBe(120);
      expect(applyComebackBonus(115)).toBe(138); // 115 * 1.2 = 138
    });
  });
});
