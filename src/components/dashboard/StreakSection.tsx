import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { checkFreezeEligibility } from '../../lib/streaks';
import { getTodayDateString } from '../../lib/dates';

export function StreakSection() {
  const streak = useGameStore((state) => state.streak);
  const activateFreeze = useGameStore((state) => state.activateFreeze);

  const [pressSlot, setPressSlot] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [successActive, setSuccessActive] = useState(false);

  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const today = getTodayDateString();
  const isEligibleForFreeze = checkFreezeEligibility(streak, today);

  const handlePointerDown = (slotIndex: number) => {
    // Only allow pressing on available freeze slots if eligible
    if (slotIndex >= streak.freezesAvailable || !isEligibleForFreeze) {
      return;
    }

    setPressSlot(slotIndex);
    setProgress(0);
    setSuccessActive(false);

    const duration = 800; // 800ms long-press
    const intervalTime = 16; // ~60fps
    let elapsed = 0;

    // Timer to trigger the actual state action after 800ms
    timerRef.current = window.setTimeout(() => {
      activateFreeze();
      setSuccessActive(true);
      handlePointerUp();
    }, duration);

    // Interval to drive the circular visual progress animation
    progressIntervalRef.current = window.setInterval(() => {
      elapsed += intervalTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);
    }, intervalTime);
  };

  const handlePointerUp = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setPressSlot(null);
    setProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
    };
  }, []);

  const totalSlots = 3;
  // We want to show available freezes and used freezes.
  // E.g. if freezesAvailable = 2, freezesUsed = 1.
  // Slots 0 and 1 are active (colored ❄️).
  // Slot 2 is dimmed (used ❄️).
  const renderFreezeSlot = (index: number) => {
    const isAvailable = index < streak.freezesAvailable;
    const isUsed = index >= streak.freezesAvailable && index < (streak.freezesAvailable + streak.freezesUsed);
    const isPressing = pressSlot === index;

    // SVG parameters for circle outline
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div
        key={index}
        role="button"
        tabIndex={0}
        aria-label={`Streak Freeze Slot ${index + 1}`}
        onPointerDown={() => handlePointerDown(index)}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={[
          'relative w-12 h-12 flex items-center justify-center rounded-full select-none outline-none transition-all duration-300',
          isAvailable 
            ? 'bg-sky-500/10 border border-sky-400/20 text-sky-400 cursor-pointer active:scale-95' 
            : 'bg-white/5 border border-white/5 text-white/20 cursor-not-allowed',
          isUsed ? 'opacity-30' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Long-press radial progress ring */}
        {isPressing && (
          <svg className="absolute -inset-1 w-14 h-14 -rotate-90 pointer-events-none z-20">
            <circle
              cx="28"
              cy="28"
              r={radius}
              fill="transparent"
              stroke="#38BDF8"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all"
            />
          </svg>
        )}

        {/* Ice crystal icon */}
        <span className="text-xl relative z-10 select-none">❄️</span>

        {/* Action instructions shown over the active slot on hover */}
        {isAvailable && isEligibleForFreeze && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-[9px] text-sky-300 font-semibold px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            HOLD TO FREEZE
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-[#12121A] border border-white/5 p-5 rounded-xl">
      {/* Top row: Streak Details */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-mono)] text-3xl font-extrabold text-[var(--text-primary)]">
              🔥 {streak.current}
            </span>
            <span className="font-[family-name:var(--font-body)] text-xs text-[var(--text-secondary)] font-medium">
              DAY STREAK
            </span>
          </div>
          <div className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] mt-1">
            🏆 Longest: {streak.longest}
          </div>
        </div>

        {/* Streak Freeze Slots */}
        <div className="flex items-center gap-2.5">
          {Array.from({ length: totalSlots }).map((_, i) => renderFreezeSlot(i))}
        </div>
      </div>

      {/* Success alert message for Freeze Activation */}
      <AnimatePresence>
        {successActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-sky-500/10 border border-sky-400/20 text-sky-300 rounded-lg p-3 text-xs font-[family-name:var(--font-body)] text-center leading-relaxed"
          >
            ❄️ <strong>Streak Freeze Activated!</strong> Your current {streak.current}-day streak is protected for today.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comeback Mode Active Banner */}
      {streak.inComebackMode && (
        <div className="bg-amber-500/10 border border-amber-400/20 rounded-lg p-3 flex items-center justify-center gap-2 select-none">
          <span className="animate-pulse">⚡</span>
          <span className="font-[family-name:var(--font-display)] text-[11px] font-bold text-amber-400 tracking-wider">
            COMEBACK MODE ACTIVE — +20% XP MULTIPLIER
          </span>
        </div>
      )}
    </div>
  );
}
