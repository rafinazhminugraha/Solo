import { RANK_DEFINITIONS } from '../constants/ranks';
import type { RankKey, RankDefinition } from '../store/types';

/**
 * Ordered sequence of player ranks from lowest to highest.
 */
export const RANK_ORDER: readonly RankKey[] = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];

/**
 * Computes the user's habit consistency score as a percentage.
 * Returns 0 if totalDays is less than 14 (onboarding/grace period).
 */
export function calculateConsistency(totalCheckIns: number, totalDays: number): number {
  if (totalDays < 14) return 0;
  return Math.min(100, Math.round((totalCheckIns / totalDays) * 100));
}

/**
 * Evaluates the appropriate player rank based on current level and consistency score.
 * Filters eligible rank definitions, sorts by minConsistency descending, and returns the highest eligible rank.
 */
export function evaluateRank(level: number, consistency: number): RankKey {
  const eligible = [...RANK_DEFINITIONS]
    .filter((r) => level >= r.minLevel && consistency >= r.minConsistency)
    .sort((a, b) => b.minConsistency - a.minConsistency);
  return eligible[0]?.key ?? 'E';
}

/**
 * Retrieves the comprehensive definition block associated with a given RankKey.
 */
export function getRankDefinition(rank: RankKey): RankDefinition {
  const definition = RANK_DEFINITIONS.find((r) => r.key === rank);
  if (!definition) {
    throw new Error(`Rank definition not found for key: ${rank}`);
  }
  return definition;
}

/**
 * Evaluates if a combination of level and consistency qualifies the user to rank up.
 */
export function canRankUp(currentRank: RankKey, level: number, consistency: number): boolean {
  const evaluatedRank = evaluateRank(level, consistency);
  const currentIdx = RANK_ORDER.indexOf(currentRank);
  const evaluatedIdx = RANK_ORDER.indexOf(evaluatedRank);
  return evaluatedIdx > currentIdx;
}
