import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { ACHIEVEMENT_DEFINITIONS } from '../../constants/achievements';
import { Modal } from '../ui/Modal';

interface RewardScreenProps {
  xpEarned: number;
  prevStreak: number;
  newStreak: number;
  onDismiss: () => void;
}

export function RewardScreen({ xpEarned, prevStreak, newStreak, onDismiss }: RewardScreenProps) {
  const checkIns = useGameStore((state) => state.checkIns);
  const earnedAchievements = useGameStore((state) => state.earnedAchievements);
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);

  const [counterValue, setCounterValue] = useState(prevStreak);
  const [timeLeft, setTimeLeft] = useState(3000); // 3 seconds countdown

  // 1. Slot machine count animation for streak
  useEffect(() => {
    const timer = setTimeout(() => {
      setCounterValue(newStreak);
    }, 600);
    return () => clearTimeout(timer);
  }, [newStreak]);

  // 2. Countdown progress countdown
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
  }, [onDismiss]);

  // 3. Find newly earned achievements (earned in the last 4 seconds)
  const now = Date.now();
  const newlyEarned = earnedAchievements
    .filter((ea) => now - ea.earnedAt < 4000)
    .map((ea) => ACHIEVEMENT_DEFINITIONS.find((def) => def.id === ea.achievementId))
    .filter((def): def is NonNullable<typeof def> => !!def);

  // 4. Find if a milestone bonus occurred on the latest check-in
  const latestCheckIn = checkIns[checkIns.length - 1];
  const milestoneBonus =
    latestCheckIn?.bonusEvents.find((e) => e.type === 'streak_milestone')?.xp || null;

  // Render a lovely emoji for achievement slide-ins
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
        {/* Particle Glow background */}
        <div className="absolute inset-0 blur-3xl opacity-20 pointer-events-none">
          <div className="absolute w-[300px] h-[300px] rounded-full bg-[var(--accent-primary)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="z-10 flex flex-col items-center max-w-sm w-full gap-8">
          
          {/* XP Burst Indicator */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.35, 1.0], opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-1"
          >
            <span className="font-[family-name:var(--font-display)] text-xs tracking-widest text-[var(--text-secondary)] font-semibold uppercase">
              DAILY REWARD SECURED
            </span>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-black text-[var(--accent-primary)] drop-shadow-[0_0_15px_var(--accent-glow)] select-none">
              +{xpEarned} XP
            </h1>
          </motion.div>

          {/* Flame Streak Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex flex-col items-center bg-white/5 border border-white/5 px-6 py-4 rounded-2xl w-full"
          >
            <div className="flex items-center gap-2">
              <span className="text-3xl select-none">🔥</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={counterValue}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="font-[family-name:var(--font-mono)] text-4xl font-extrabold text-[var(--text-primary)]"
                >
                  {counterValue}
                </motion.span>
              </AnimatePresence>
              <span className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--text-secondary)] tracking-wider">
                DAY STREAK
              </span>
            </div>
            {newStreak > prevStreak && (
              <span className="text-[10px] text-[var(--accent-primary)] font-[family-name:var(--font-mono)] font-bold mt-1.5 uppercase select-none tracking-widest animate-pulse">
                STREAK INCREMENTED!
              </span>
            )}
          </motion.div>

          {/* Milestone Bonus Award Announcement */}
          {milestoneBonus !== null && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="w-full bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col gap-1 items-center justify-center select-none"
            >
              <span className="text-xl">🌟</span>
              <span className="font-[family-name:var(--font-display)] text-xs font-bold text-amber-300 tracking-wider">
                STREAK MILESTONE REACHED!
              </span>
              <span className="font-[family-name:var(--font-mono)] text-sm font-black text-amber-400">
                +{milestoneBonus} BONUS XP AWARDED
              </span>
            </motion.div>
          )}

          {/* Achievement unlocked notification slide-in */}
          {newlyEarned.length > 0 && (
            <div className="flex flex-col gap-2 w-full mt-2">
              {newlyEarned.map((ach) => (
                <motion.div
                  key={ach.id}
                  initial={{ x: 300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
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

        {/* Footer info & Tap instructions */}
        <span className="absolute bottom-10 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest select-none z-10">
          TAP ANYWHERE TO CONTINUE
        </span>

        {/* 3s Visual Progress Bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-10 pointer-events-none">
          <motion.div
            className="h-full bg-[var(--accent-primary)]"
            style={{ width: `${(timeLeft / 3000) * 100}%` }}
          />
        </div>
      </div>
    </Modal>
  );
}
