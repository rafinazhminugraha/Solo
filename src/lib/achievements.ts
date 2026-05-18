import { ACHIEVEMENT_DEFINITIONS } from '../constants/achievements';
import type { GameState, CheckIn, StatKey, RankKey, EarnedAchievement, AchievementDefinition } from '../store/types';

/**
 * Aggregates all statsTagged across all logged check-ins to compute lifetime stat points.
 */
export function computeStatPoints(checkIns: CheckIn[]): Record<StatKey, number> {
  const points: Record<StatKey, number> = {
    focus: 0,
    discipline: 0,
    endurance: 0,
    wisdom: 0,
    vitality: 0,
  };

  for (const checkIn of checkIns) {
    for (const tag of checkIn.statsTagged) {
      if (tag in points) {
        points[tag]++;
      }
    }
  }

  return points;
}

/**
 * Checks all unearned achievements against the current game state.
 * Returns an array of newly unlocked AchievementDefinition objects.
 */
export function checkAchievements(
  state: GameState,
  _computedStats: Record<StatKey, number>,
  _currentLevel: number,
  _currentRank: RankKey
): AchievementDefinition[] {
  const earnedIds = new Set(state.earnedAchievements.map((ea) => ea.achievementId));

  return ACHIEVEMENT_DEFINITIONS.filter((def) => {
    if (earnedIds.has(def.id)) {
      return false;
    }
    return def.checkCondition(state);
  });
}

/**
 * Factory helper that constructs an EarnedAchievement instance for a newly unlocked badge.
 */
export function buildEarnedAchievement(def: AchievementDefinition): EarnedAchievement {
  return {
    achievementId: def.id,
    earnedAt: new Date().toISOString(),
  };
}
