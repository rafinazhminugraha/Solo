import { useRef, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  /** Optional CSS variable name to override the gradient (e.g. '--rank-a') */
  colorVar?: string;
  /** Bar height in pixels. Defaults to 8. */
  height?: number;
  /** Shows 'X / Y' label when true, percentage when 'percent', or nothing when false. */
  showLabel?: boolean | 'percent';
  /** Animates the fill width via a Framer Motion spring. Defaults to true. */
  animated?: boolean;
}

/**
 * Clamp helper — keeps ratio between 0 and 1.
 */
function clampRatio(current: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(1, Math.max(0, current / max));
}

export function ProgressBar({
  current,
  max,
  colorVar,
  height = 8,
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const ratio = clampRatio(current, max);
  const isFull = current >= max && max > 0;

  // Spring drives a 0→1 value; we transform to '0%'→'100%'
  const springVal = useSpring(0, {
    stiffness: 90,
    damping: 22,
    mass: 1,
  });

  const widthPct = useTransform(springVal, (v) => `${(v * 100).toFixed(2)}%`);

  // Animate to the current ratio whenever it changes
  useEffect(() => {
    if (animated) {
      springVal.set(ratio);
    }
  }, [ratio, animated, springVal]);

  // On first mount, if not animated, jump immediately
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (!animated) {
        springVal.jump(ratio);
      }
    }
  });

  const barBackground = colorVar
    ? `var(${colorVar})`
    : 'linear-gradient(90deg, #3B82F6, #A855F7, #F59E0B)';

  const labelText =
    showLabel === 'percent'
      ? `${Math.round(ratio * 100)}%`
      : showLabel
        ? `${current.toLocaleString()} / ${max.toLocaleString()}`
        : null;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label row */}
      {labelText && (
        <div className="flex justify-end">
          <span
            className="text-xs font-[family-name:var(--font-mono)] text-[var(--text-secondary)]"
            aria-label={`Progress: ${labelText}`}
          >
            {labelText}
          </span>
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label="Progress"
        className="relative w-full overflow-hidden rounded-full bg-white/8"
        style={{ height }}
      >
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: animated ? widthPct : `${ratio * 100}%`,
            background: barBackground,
          }}
        />

        {/* Full glow pulse overlay — only when at 100% */}
        {isFull && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: barBackground }}
            animate={{ opacity: [0.6, 0.15, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>
    </div>
  );
}
