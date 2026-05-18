import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { Modal } from '../ui/Modal';
import type { AchievementDefinition } from '../../store/types';

interface RewardScreenProps {
  xpEarned: number;
  newStreak: number;
  prevStreak: number;
  newAchievements: AchievementDefinition[];
  milestoneBonus: number | null;
  onDismiss: () => void;
}

// 1. Slot machine digit rolling column subcomponent
function DigitColumn({ digit }: { digit: number }) {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const digitHeight = 40; // 40px height matching text size

  return (
    <div className="h-10 overflow-hidden relative w-6 flex justify-center">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -digit * digitHeight }}
        transition={{ type: 'spring', stiffness: 90, damping: 14, mass: 0.8 }}
        className="flex flex-col text-4xl font-extrabold text-[var(--text-primary)] font-[family-name:var(--font-mono)]"
      >
        {digits.map((d) => (
          <span key={d} className="h-10 flex items-center justify-center select-none">
            {d}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function SlotMachineStreak({ value }: { value: number }) {
  const digitsArray = String(value).split('').map(Number);
  return (
    <div className="flex items-center gap-0.5 justify-center">
      {digitsArray.map((d, index) => (
        <DigitColumn key={index} digit={d} />
      ))}
    </div>
  );
}

export function RewardScreen({
  xpEarned,
  newStreak,
  prevStreak,
  newAchievements,
  milestoneBonus,
  onDismiss,
}: RewardScreenProps) {
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);
  
  // Set different countdown limit depending on if a level-up ceremony is queued
  const isLevelUpQueued = pendingCeremony?.type === 'level_up';
  const duration = isLevelUpQueued ? 1000 : 3000;
  const [timeLeft, setTimeLeft] = useState(duration);

  // 2. Main Countdown loop
  useEffect(() => {
    const intervalTime = 50;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= intervalTime) {
          clearInterval(interval);
          onDismiss();
          return 0;
        }
        return prev - intervalTime;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onDismiss, duration]);

  // Map achievement icon emoji based on id
  const getAchievementEmoji = (id: string) => {
    const emojis: Record<string, string> = {
      'A-01': '🩸', 'A-02': '🛡️', 'A-03': '🗓️', 'A-04': '🚀', 'A-05': '💯',
      'A-06': '✍️', 'A-07': '🧠', 'A-08': '🎖️', 'A-09': '🏆', 'A-10': '👑',
      'A-11': '♾️', 'A-12': '☄️', 'A-13': '🏔️', 'A-14': '⚡', 'A-15': '⚖️',
      'A-16': '🌟', 'A-17': '❄️', 'A-18': '🏦', 'A-19': '🎯', 'A-20': '🌌',
      'H-01': '👻', 'H-02': '⚙️', 'H-03': '🧱', 'H-04': '🦅', 'H-05': '🪐',
    };
    return emojis[id] || '🏆';
  };

  return (
    <Modal isOpen fullScreen onClose={onDismiss}>
      <div
        onClick={onDismiss}
        className="w-full h-full min-h-screen bg-[#0A0A0F]/98 flex flex-col items-center justify-center p-6 text-center select-none cursor-pointer relative overflow-hidden font-[family-name:var(--font-body)]"
      >
        {/* Decorative Radial Background */}
        <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none">
          <div className="absolute w-[320px] h-[320px] rounded-full bg-[var(--accent-primary)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="z-10 flex flex-col items-center max-w-sm w-full gap-8">
          
          {/* XP Burst Display */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.35, 1.0], opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-[family-name:var(--font-display)] text-xs tracking-widest text-[var(--text-secondary)] font-semibold uppercase">
              REWARD SECURED
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-black text-[var(--accent-primary)] drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] select-none">
              +{xpEarned} XP
            </h1>
          </motion.div>

          {/* Flame & Slot Machine Streak digits indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex flex-col items-center bg-white/5 border border-white/5 px-6 py-4 rounded-2xl w-full"
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl select-none">🔥</span>
              <SlotMachineStreak value={newStreak} />
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--text-secondary)] tracking-wider ml-1">
                DAY STREAK
              </span>
            </div>
            {newStreak > prevStreak && (
              <span className="text-[10px] text-[var(--accent-primary)] font-[family-name:var(--font-mono)] font-bold mt-1.5 uppercase select-none tracking-widest animate-pulse">
                STREAK INCREMENTED!
              </span>
            )}
          </motion.div>

          {/* Streak Milestone Bonus Card */}
          {milestoneBonus !== null && milestoneBonus > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 150 }}
              className="w-full bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col gap-1 items-center justify-center select-none"
            >
              <span className="text-xl">🌟</span>
              <span className="font-[family-name:var(--font-display)] text-xs font-bold text-amber-300 tracking-wider">
                🔥 {newStreak} DAY STREAK MILESTONE!
              </span>
              <span className="font-[family-name:var(--font-mono)] text-sm font-black text-amber-400">
                +{milestoneBonus} BONUS XP AWARDED
              </span>
            </motion.div>
          )}

          {/* Slide-in newly unlocked achievements */}
          {newAchievements.length > 0 && (
            <div className="flex flex-col gap-2 w-full mt-2">
              {newAchievements.map((ach, i) => (
                <motion.div
                  key={ach.id}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.3 + i * 0.1 }}
                  className="w-full bg-amber-500/10 border border-amber-400/25 p-3 rounded-xl flex items-center gap-3 text-left"
                >
                  <span className="text-2xl shrink-0 select-none">
                    {getAchievementEmoji(ach.id)}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-amber-400 font-bold font-[family-name:var(--font-display)] tracking-wider">
                      ACHIEVEMENT UNLOCKED!
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate font-[family-name:var(--font-body)]">
                      {ach.name} (+{ach.xpReward} XP)
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Dismiss Instruction label */}
        <span className="absolute bottom-10 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest select-none z-10">
          {isLevelUpQueued ? 'PREPARING LEVEL UP...' : 'TAP ANYWHERE TO CONTINUE'}
        </span>

        {/* Progress Countdown indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-10 pointer-events-none">
          <motion.div
            className="h-full bg-[var(--accent-primary)]"
            style={{ width: `${(timeLeft / duration) * 100}%` }}
          />
        </div>
      </div>
    </Modal>
  );
}
