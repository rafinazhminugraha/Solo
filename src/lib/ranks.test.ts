import { describe, it, expect } from 'vitest';
import {
  calculateConsistency,
  evaluateRank,
  getRankDefinition,
  canRankUp,
} from './ranks';

describe('Rank System Evaluation Logic', () => {
  describe('calculateConsistency', () => {
    it('returns 0 if totalDays is less than 14', () => {
      expect(calculateConsistency(7, 7)).toBe(0);
      expect(calculateConsistency(13, 13)).toBe(0);
    });

    it('returns 100 for perfect 14/14 days check-in', () => {
      expect(calculateConsistency(14, 14)).toBe(100);
    });

    it('returns 50 for 7 check-ins over 14 days', () => {
      expect(calculateConsistency(7, 14)).toBe(50);
    });

    it('caps the consistency score at 100', () => {
      expect(calculateConsistency(20, 15)).toBe(100);
    });
  });

  describe('evaluateRank', () => {
    it('returns rank E for Level 1, 0% consistency', () => {
      expect(evaluateRank(1, 0)).toBe('E');
    });

    it('returns rank D for Level 5, 30% consistency', () => {
      expect(evaluateRank(5, 30)).toBe('D');
    });

    it('returns rank C for Level 15, 50% consistency', () => {
      expect(evaluateRank(15, 50)).toBe('C');
    });

    it('returns rank A for Level 50, 78% consistency', () => {
      expect(evaluateRank(50, 78)).toBe('A');
    });

    it('returns rank SSS for Level 95, 99% consistency', () => {
      expect(evaluateRank(95, 99)).toBe('SSS');
    });

    it('returns rank SS instead of SSS if level 95 is met but consistency is only 95%', () => {
      expect(evaluateRank(95, 95)).toBe('SS');
    });

    it('returns rank E if level is high but consistency is extremely low', () => {
      expect(evaluateRank(50, 10)).toBe('E');
    });
  });

  describe('getRankDefinition', () => {
    it('returns details of ordinary human for rank E', () => {
      const def = getRankDefinition('E');
      expect(def.title).toBe('Ordinary Human');
      expect(def.auraType).toBe('none');
    });

    it('returns details of sovereign for rank S', () => {
      const def = getRankDefinition('S');
      expect(def.title).toBe('Sovereign');
      expect(def.color).toBe('#EF4444');
    });

    it('throws error for invalid rank key', () => {
      expect(() => getRankDefinition('X' as any)).toThrow();
    });
  });

  describe('canRankUp', () => {
    it('returns true if player can rank up from E to D', () => {
      expect(canRankUp('E', 5, 30)).toBe(true);
    });

    it('returns false if player is already SSS', () => {
      expect(canRankUp('SSS', 100, 100)).toBe(false);
    });

    it('returns false if player does not meet next rank requirements', () => {
      expect(canRankUp('C', 16, 45)).toBe(false); // Consistency too low for B rank (65%)
    });
  });
});
