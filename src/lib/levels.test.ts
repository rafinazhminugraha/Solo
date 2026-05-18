import { describe, it, expect } from 'vitest';
import {
  xpForLevel,
  levelFromXP,
  xpProgressInLevel,
  estimateDaysToNextLevel,
  getLevelLabel,
} from './levels';

describe('Level Curve Mathematics', () => {
  describe('xpForLevel', () => {
    it('returns 0 for level 1', () => {
      expect(xpForLevel(1)).toBe(0);
    });

    it('returns 0 for levels below 1', () => {
      expect(xpForLevel(0)).toBe(0);
      expect(xpForLevel(-5)).toBe(0);
    });

    it('returns 6310 for level 10', () => {
      expect(xpForLevel(10)).toBe(6310);
    });

    it('returns 109657 for level 50', () => {
      expect(xpForLevel(50)).toBe(109657);
    });
  });

  describe('levelFromXP', () => {
    it('returns level 1 for 0 XP', () => {
      expect(levelFromXP(0)).toBe(1);
    });

    it('returns level 9 for 6309 XP (just below level 10 requirement)', () => {
      expect(levelFromXP(6309)).toBe(9);
    });

    it('returns level 10 for exactly 6310 XP', () => {
      expect(levelFromXP(6310)).toBe(10);
    });

    it('returns level 100 for 398107 XP (transcendent milestone)', () => {
      expect(levelFromXP(398107)).toBe(100);
    });

    it('caps at level 100 for XP beyond the limit', () => {
      expect(levelFromXP(500000)).toBe(100);
    });
  });

  describe('xpProgressInLevel', () => {
    it('returns correct current and required XP progression at exactly level 10', () => {
      const progress = xpProgressInLevel(6310);
      expect(progress.current).toBe(0);
      expect(progress.required).toBe(xpForLevel(11) - xpForLevel(10));
    });

    it('returns correct progression between level 10 and 11', () => {
      const base = xpForLevel(10); // 6310
      const progress = xpProgressInLevel(base + 500);
      expect(progress.current).toBe(500);
      expect(progress.required).toBe(xpForLevel(11) - xpForLevel(10));
    });

    it('returns 0 required XP when at maximum level 100', () => {
      const maxXP = xpForLevel(100); // 398107
      const progress = xpProgressInLevel(maxXP + 1000);
      expect(progress.required).toBe(0);
    });
  });

  describe('estimateDaysToNextLevel', () => {
    it('estimates remaining days correctly based on positive daily velocity', () => {
      const base = xpForLevel(10); // 6310
      // We are 200 XP away from level 11. If we earn 100 XP per day, it should take exactly 2 days.
      const xpNeeded = xpForLevel(11) - base;
      const totalXP = base + (xpNeeded - 200);
      expect(estimateDaysToNextLevel(totalXP, 100)).toBe(2);
    });

    it('rounds up partial remaining days', () => {
      const base = xpForLevel(10);
      const xpNeeded = xpForLevel(11) - base;
      const totalXP = base + (xpNeeded - 201); // 201 XP away
      expect(estimateDaysToNextLevel(totalXP, 100)).toBe(3); // 2.01 rounded up to 3 days
    });

    it('returns null if average daily XP is 0 or negative', () => {
      expect(estimateDaysToNextLevel(5000, 0)).toBeNull();
      expect(estimateDaysToNextLevel(5000, -50)).toBeNull();
    });

    it('returns null if at level 100', () => {
      const maxXP = xpForLevel(100);
      expect(estimateDaysToNextLevel(maxXP, 150)).toBeNull();
    });
  });

  describe('getLevelLabel', () => {
    it('returns Awakened for level 1', () => {
      expect(getLevelLabel(1)).toBe('Awakened');
    });

    it('returns Initiate for level 5', () => {
      expect(getLevelLabel(5)).toBe('Initiate');
    });

    it('returns Seeker for level 10', () => {
      expect(getLevelLabel(10)).toBe('Seeker');
    });

    it('returns Initiate for level 9 (nearest lower milestone is 5)', () => {
      expect(getLevelLabel(9)).toBe('Initiate');
    });

    it('returns Transcendent for level 100', () => {
      expect(getLevelLabel(100)).toBe('Transcendent');
    });
  });
});
