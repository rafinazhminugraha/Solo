import { STAT_DEFINITIONS } from '../../constants/stats';
import { formatDisplayDate } from '../../lib/dates';
import type { CheckIn } from '../../store/types';

interface JournalEntryProps {
  checkIn: CheckIn;
  questName: string;
}

export function JournalEntry({ checkIn, questName }: JournalEntryProps) {
  // Map stat key to symbol and label
  const getStatInfo = (key: string) => {
    const def = STAT_DEFINITIONS.find((d) => d.key === key);
    return def ? { symbol: def.symbol, label: def.label.toLowerCase() } : { symbol: '✦', label: key };
  };

  // Map bonus event type to icon emoji
  const getBonusIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'streak_milestone':
        return '🔥';
      case 'note':
        return '✍️';
      case 'comeback':
        return '⚡';
      default:
        return '✦';
    }
  };

  return (
    <div className="py-5 border-b border-white/5 flex flex-col gap-3.5 font-[family-name:var(--font-body)]">
      {/* Top row: Date, Streak badge & XP */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Formatted Date */}
            <span className="font-[family-name:var(--font-mono)] text-xs font-semibold text-[var(--text-secondary)] tracking-wide">
              {formatDisplayDate(checkIn.date)}
            </span>
            {/* Streak day pill badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/15">
              🔥 Day {checkIn.streakDay}
            </span>
          </div>
          
          {/* Quest Name */}
          <span className="text-[11px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            {questName}
          </span>
        </div>

        {/* Total XP Earned */}
        <div className="text-right">
          <span className="font-[family-name:var(--font-mono)] text-sm font-black text-[var(--accent-primary)] select-none">
            +{checkIn.xpEarned} XP
          </span>
        </div>
      </div>

      {/* Stat tags */}
      {checkIn.statsTagged.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {checkIn.statsTagged.map((statKey) => {
            const { symbol, label } = getStatInfo(statKey);
            return (
              <span
                key={statKey}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-[var(--text-secondary)]"
              >
                <span>{symbol}</span>
                <span>{label}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Note description block */}
      {checkIn.note && (
        <p className="text-sm font-[family-name:var(--font-body)] text-[var(--text-primary)] leading-relaxed text-left bg-white/[0.02] border border-white/[0.03] p-3 rounded-xl">
          {checkIn.note}
        </p>
      )}

      {/* Bonus XP events row */}
      {checkIn.bonusEvents.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          {checkIn.bonusEvents.map((event, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold bg-white/5 border border-white/5 text-[var(--text-secondary)]"
            >
              <span>{getBonusIcon(event.type)}</span>
              <span>{event.label}</span>
              <span className="text-[var(--accent-primary)] font-[family-name:var(--font-mono)]">
                +{event.xp} XP
              </span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
