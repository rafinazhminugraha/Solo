import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useGameStore, useComputedStats } from '../../store/useGameStore';
import { getRankDefinition } from '../../lib/ranks';
import { Button } from '../ui/Button';

export function RankUpCeremony() {
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);
  const clearPendingCeremony = useGameStore((state) => state.clearPendingCeremony);
  const stats = useComputedStats();

  const [phase, setPhase] = useState<'A' | 'B' | 'C'>('A');
  const controls = useAnimation();

  // Guard against null rank up ceremony
  if (!pendingCeremony || pendingCeremony.type !== 'rank_up') {
    return null;
  }

  const prevRank = pendingCeremony.previousValue as string;
  const newRank = pendingCeremony.newValue as string;

  const prevRankDef = getRankDefinition(prevRank as any);
  const newRankDef = getRankDefinition(newRank as any);

  useEffect(() => {
    // Phase timing sequence
    const timerA = setTimeout(() => setPhase('B'), 450);
    const timerB = setTimeout(() => setPhase('C'), 1250);

    return () => {
      clearTimeout(timerA);
      clearTimeout(timerB);
    };
  }, []);

  const handleClaim = () => {
    controls.start({ opacity: 0 }).then(() => {
      clearPendingCeremony();
    });
  };

  // Convert rank hex color to RGB numbers
  const hex = newRankDef.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 255;
  const g = parseInt(hex.substring(2, 4), 16) || 255;
  const b = parseInt(hex.substring(4, 6), 16) || 255;
  const rgb = `${r}, ${g}, ${b}`;

  // 16 small particles exploding outwards
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * 2 * Math.PI) / 16;
    const distance = 140 + Math.random() * 80;
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
      style={{
        background: `radial-gradient(circle at center, rgba(${rgb}, 0.12) 0%, #0A0A0F 85%)`,
      }}
    >
      {/* 16-Dot Particle explosion burst */}
      {phase === 'B' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, scale: 0.8, opacity: 1 }}
              animate={{ x: p.x, y: p.y, scale: 0.1, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: p.id * 0.015 }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: newRankDef.color,
                boxShadow: `0 0 10px ${newRankDef.glowColor}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Ring Halo Burst */}
      {phase === 'B' && (
        <motion.div
          initial={{ scale: 0.3, opacity: 1, borderWidth: '6px' }}
          animate={{ scale: 1.8, opacity: 0, borderWidth: '1px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute w-48 h-48 rounded-full border pointer-events-none"
          style={{ borderColor: newRankDef.color }}
        />
      )}

      <div className="flex flex-col items-center max-w-sm w-full relative z-10 gap-8">
        
        {/* Large Rank Insignia Glyphs */}
        <div className="relative w-full h-40 flex items-center justify-center">
          {phase === 'A' && (
            <motion.h1
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeIn' }}
              className="absolute font-[family-name:var(--font-display)] text-9xl font-black select-none tracking-tighter"
              style={{
                color: prevRankDef.color,
                textShadow: `0 0 20px ${prevRankDef.glowColor}`,
              }}
            >
              {prevRank}
            </motion.h1>
          )}

          {(phase === 'B' || phase === 'C') && (
            <motion.h1
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.15, opacity: [0, 1, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute font-[family-name:var(--font-display)] text-9xl font-black select-none tracking-tighter"
              style={{
                color: newRankDef.color,
                textShadow: `0 0 25px rgba(${rgb}, 0.75)`,
              }}
            >
              {newRank}
            </motion.h1>
          )}
        </div>

        {/* Phase C Details Text & Action */}
        <div className="flex flex-col items-center gap-6 min-h-[140px] justify-between w-full">
          {phase === 'C' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-2"
            >
              {/* Old rank title -> New rank title */}
              <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--text-secondary)] uppercase">
                {prevRankDef.title} &rarr; {newRankDef.title}
              </span>

              {/* Huge New Rank Title */}
              <h2
                className="font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-widest uppercase mb-1"
                style={{ color: newRankDef.color, textShadow: `0 0 10px rgba(${rgb}, 0.3)` }}
              >
                {newRankDef.title}
              </h2>

              {/* Sub-text stats */}
              <p className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] leading-relaxed max-w-[280px]">
                You have checked in {stats.totalCheckIns} {stats.totalCheckIns === 1 ? 'time' : 'times'}. Your consistency is{' '}
                <strong className="text-[var(--text-primary)]">{stats.consistency}%</strong>.
              </p>
            </motion.div>
          )}
        </div>

        {/* Claim button */}
        <div className="w-full h-12 flex justify-center mt-2">
          {phase === 'C' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full"
            >
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleClaim}
                style={{
                  backgroundColor: newRankDef.color,
                  boxShadow: `0 0 12px ${newRankDef.glowColor}`,
                  color: newRank === 'SSS' ? '#0A0A0F' : '#FFFFFF',
                }}
              >
                Claim Your Rank
              </Button>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
