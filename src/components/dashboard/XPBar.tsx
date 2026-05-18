import { ProgressBar } from '../ui/ProgressBar';
import { getLevelLabel, estimateDaysToNextLevel } from '../../lib/levels';

interface XPBarProps {
  level: number;
  totalXP: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  totalCheckIns: number;
}

export function XPBar({
  level,
  totalXP,
  xpInCurrentLevel,
  xpToNextLevel,
  totalCheckIns,
}: XPBarProps) {
  const levelLabel = getLevelLabel(level);

  // Compute a realistic average XP per day:
  // If user has check-ins, we can average totalXP / totalCheckIns.
  // We'll fall back to 120 XP/day (roughly 1 check-in + streak bonus + occasional notes) as a baseline.
  const averageXPPerCheckIn = totalCheckIns > 0 ? Math.round(totalXP / totalCheckIns) : 120;
  const daysToNext = estimateDaysToNextLevel(totalXP, averageXPPerCheckIn);

  return (
    <div className="flex items-center gap-5 w-full bg-[#12121A] border border-white/5 p-5 rounded-xl">
      {/* Prominent Level Display */}
      <div className="flex flex-col items-center shrink-0">
        <span className="font-[family-name:var(--font-display)] text-6xl font-extrabold text-[var(--text-primary)] leading-none select-none">
          {level}
        </span>
        <span className="font-[family-name:var(--font-display)] text-[10px] tracking-widest text-[var(--text-muted)] uppercase mt-1">
          {levelLabel}
        </span>
      </div>

      {/* Progress & Meta Info Section */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="font-[family-name:var(--font-mono)] text-[var(--text-secondary)] font-medium">
            LEVEL PROGRESS
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[var(--text-secondary)] font-semibold">
            {xpInCurrentLevel.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>

        {/* Progress Bar Component */}
        <ProgressBar
          current={xpInCurrentLevel}
          max={xpToNextLevel}
          height={8}
          animated
        />

        {/* Level up estimate days info */}
        {daysToNext !== null && level < 100 && (
          <div className="font-[family-name:var(--font-body)] text-[11px] text-[var(--text-secondary)] mt-2 italic">
            Next level in ~{daysToNext} {daysToNext === 1 ? 'day' : 'days'}
          </div>
        )}
      </div>
    </div>
  );
}
