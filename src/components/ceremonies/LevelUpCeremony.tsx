import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore, useComputedStats } from '../../store/useGameStore';
import { getLevelLabel } from '../../lib/levels';
import { ProgressBar } from '../ui/ProgressBar';

export function LevelUpCeremony() {
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);
  const quest = useGameStore((state) => state.quest);
  const clearPendingCeremony = useGameStore((state) => state.clearPendingCeremony);
  const stats = useComputedStats();

  const [phase, setPhase] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const controls = useAnimation();

  // Guard against null ceremony
  if (!pendingCeremony || pendingCeremony.type !== 'level_up') {
    return null;
  }

  const prevLevel = pendingCeremony.previousValue as number;
  const newLevel = pendingCeremony.newValue as number;
  const levelLabel = getLevelLabel(newLevel);

  useEffect(() => {
    // 1. Sequence phase transitions
    const timerA = setTimeout(() => setPhase('B'), 650);
    const timerB = setTimeout(() => setPhase('C'), 1250);
    const timerC = setTimeout(() => {
      setPhase('D');
      // Trigger final dismiss animation
      controls.start({ opacity: 0 }).then(() => {
        clearPendingCeremony();
      });
    }, 2850); // Total timing around 2.85s to let the XP bar draw cleanly

    return () => {
      clearTimeout(timerA);
      clearTimeout(timerB);
      clearTimeout(timerC);
    };
  }, [controls, clearPendingCeremony]);

  // Particle explosion dots
  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 12;
    const distance = 160 + Math.random() * 60;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });

  return (
    <motion.div
      animate={controls}
      className="fixed inset-0 z-50 bg-[#0A0A0F] flex flex-col items-center justify-center p-6 text-center select-none font-[family-name:var(--font-body)] overflow-hidden"
    >
      {/* Particle Shockwave explosions */}
      {phase === 'B' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0.5, opacity: 1 }}
              animate={{ x: p.x, y: p.y, scale: 0.1, opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-glow)]"
            />
          ))}
        </div>
      )}

      {/* Light Burst Ring behind center */}
      {phase === 'B' && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute w-40 h-40 rounded-full bg-gradient-radial from-white via-[var(--accent-primary)] to-transparent blur-sm pointer-events-none"
        />
      )}

      <div className="flex flex-col items-center max-w-sm w-full relative z-10 gap-6">
        
        {/* Level Counter numbers area */}
        <div className="relative w-full h-44 flex items-center justify-center">
          {/* Phase A: Shattering / Fading out old level */}
          {phase === 'A' && (
            <motion.h1
              initial={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              animate={{ scale: 1.35, opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute font-[family-name:var(--font-display)] text-[10rem] font-black text-[var(--text-secondary)] leading-none"
            >
              {prevLevel}
            </motion.h1>
          )}

          {/* Phase B & C: New level materializes */}
          {(phase === 'B' || phase === 'C' || phase === 'D') && (
            <motion.h1
              initial={{ scale: 0.4, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute font-[family-name:var(--font-display)] text-[10rem] font-black text-[var(--accent-primary)] drop-shadow-[0_0_20px_var(--accent-glow)] leading-none"
            >
              {newLevel}
            </motion.h1>
          )}
        </div>

        {/* Level Up Announcement Label details */}
        <div className="flex flex-col items-center gap-1.5 h-16 justify-center">
          {phase !== 'A' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-1"
            >
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold tracking-[0.25em] text-[var(--text-primary)]">
                LEVEL UP ACHIEVED
              </h2>
              <span className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] italic">
                "{quest?.name || 'Hunter'}" grows stronger.
              </span>
            </motion.div>
          )}
        </div>

        {/* Phase C: XP Bar Redraw */}
        <div className="w-full h-16 flex flex-col justify-end">
          {phase === 'C' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-2 w-full"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] font-[family-name:var(--font-mono)] uppercase tracking-wider">
                <span>{levelLabel}</span>
                <span>{stats.xpInCurrentLevel} / {stats.xpToNextLevel} XP</span>
              </div>
              
              <ProgressBar
                current={stats.xpInCurrentLevel}
                max={stats.xpToNextLevel}
                height={6}
                animated
              />
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
