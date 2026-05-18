import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENT_DEFINITIONS } from '../../constants/achievements';
import type { EarnedAchievement } from '../../store/types';

interface AchievementsRowProps {
  earnedAchievements: EarnedAchievement[];
}

const ACHIEVEMENT_EMOJIS: Record<string, string> = {
  'A-01': '🩸',
  'A-02': '🛡️',
  'A-03': '🗓️',
  'A-04': '🚀',
  'A-05': '💯',
  'A-06': '✍️',
  'A-07': '🧠',
  'A-08': '🎖️',
  'A-09': '🏆',
  'A-10': '👑',
  'A-11': '♾️',
  'A-12': '☄️',
  'A-13': '🏔️',
  'A-14': '⚡',
  'A-15': '⚖️',
  'A-16': '🌟',
  'A-17': '❄️',
  'A-18': '🏦',
  'A-19': '🎯',
  'A-20': '🌌',
  'H-01': '👻',
  'H-02': '⚙️',
  'H-03': '🧱',
  'H-04': '🦅',
  'H-05': '🪐',
};

export function AchievementsRow({ earnedAchievements }: AchievementsRowProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const earnedMap = new Map(earnedAchievements.map((ea) => [ea.achievementId, ea.earnedAt]));

  const getAchievementStatus = (id: string) => {
    return {
      isEarned: earnedMap.has(id),
      earnedAt: earnedMap.get(id),
    };
  };

  const selectedDef = ACHIEVEMENT_DEFINITIONS.find((def) => def.id === selectedId);
  const selectedStatus = selectedId ? getAchievementStatus(selectedId) : null;

  return (
    <div className="flex flex-col gap-3 w-full bg-[#12121A] border border-white/5 p-5 rounded-xl font-[family-name:var(--font-body)]">
      {/* Title */}
      <div className="font-[family-name:var(--font-display)] text-xs tracking-widest text-[var(--text-secondary)] font-bold uppercase mb-2">
        ACHIEVEMENTS ({earnedAchievements.length} / {ACHIEVEMENT_DEFINITIONS.length})
      </div>

      {/* Horizontal badges container */}
      <div className="flex items-center gap-4 overflow-x-auto py-2 px-1 scrollbar-hide overscroll-contain snap-x">
        {ACHIEVEMENT_DEFINITIONS.map((def) => {
          const { isEarned } = getAchievementStatus(def.id);
          const isSelected = selectedId === def.id;

          // If the achievement is hidden and locked, render a general locked slot.
          // Otherwise render the icon.
          const showAsHidden = def.hidden && !isEarned;
          const emoji = ACHIEVEMENT_EMOJIS[def.id] || '🏆';

          return (
            <motion.button
              key={def.id}
              onClick={() => setSelectedId(isSelected ? null : def.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={[
                'shrink-0 w-14 h-14 rounded-full flex items-center justify-center snap-center relative outline-none cursor-pointer border select-none transition-all duration-300',
                isEarned
                  ? 'bg-amber-500/10 border-amber-400/30 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-white/5 border-white/5 text-white/20 hover:border-white/10',
                isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#0A0A0F]' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {showAsHidden ? (
                <span className="text-sm font-semibold select-none">🔒</span>
              ) : isEarned ? (
                <span className="text-2xl select-none">{emoji}</span>
              ) : (
                <span className="text-xl font-semibold select-none">?</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tapped Badge Details Container */}
      <AnimatePresence>
        {selectedDef && selectedStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/5 pt-4 mt-2 flex flex-col gap-1.5 text-xs text-left"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)] tracking-wider">
                {selectedDef.hidden && !selectedStatus.isEarned ? 'HIDDEN ACHIEVEMENT' : selectedDef.name.toUpperCase()}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[var(--accent-primary)] font-bold">
                +{selectedDef.xpReward} XP
              </span>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-body)]">
              {selectedDef.hidden && !selectedStatus.isEarned
                ? 'Continue training and checking in to unlock this secret achievement.'
                : selectedDef.description}
            </p>

            {selectedStatus.isEarned && selectedStatus.earnedAt && (
              <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)] uppercase mt-1">
                UNLOCKED: {new Date(selectedStatus.earnedAt).toLocaleDateString()}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
