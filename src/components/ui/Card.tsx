import type { ReactNode, CSSProperties } from 'react';
import type { RankKey } from '../../store/types';

interface CardProps {
  children: ReactNode;
  className?: string;
  elevated?: boolean;
  glow?: RankKey | null;
}

/** Maps each RankKey to its raw hex color (mirrors --rank-* CSS vars). */
const RANK_COLORS: Record<RankKey, string> = {
  E: '#6B7280',
  D: '#22C55E',
  C: '#3B82F6',
  B: '#A855F7',
  A: '#F59E0B',
  S: '#EF4444',
  SS: '#F97316',
  SSS: '#FFFFFF',
};

export function Card({ children, className = '', elevated = false, glow = null }: CardProps) {
  const glowStyle: CSSProperties = glow
    ? {
        boxShadow: `0 0 0 1px ${RANK_COLORS[glow]}66, 0 0 24px ${RANK_COLORS[glow]}29`,
      }
    : {};

  return (
    <div
      className={[
        'rounded-xl border border-white/5',
        'transition-shadow duration-300',
        elevated ? 'bg-[#1A1A26]' : 'bg-[#12121A]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={glowStyle}
    >
      {children}
    </div>
  );
}
