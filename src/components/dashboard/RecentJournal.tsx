import type { CheckIn } from '../../store/types';
import { formatDisplayDate } from '../../lib/dates';
import { Card } from '../ui/Card';

interface RecentJournalProps {
  checkIns: CheckIn[];
  onViewAll: () => void;
}

export function RecentJournal({ checkIns, onViewAll }: RecentJournalProps) {
  // Take last 3 items, reversed (most recent first)
  const recentCheckIns = [...checkIns].reverse().slice(0, 3);

  return (
    <div className="flex flex-col gap-4 w-full bg-[#12121A] border border-white/5 p-5 rounded-xl font-[family-name:var(--font-body)]">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-display)] text-xs tracking-widest text-[var(--text-secondary)] font-bold uppercase">
          RECENT JOURNAL
        </span>
        {checkIns.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-[var(--accent-primary)] hover:text-amber-400 transition-colors cursor-pointer outline-none select-none font-[family-name:var(--font-body)]"
          >
            View All &rarr;
          </button>
        )}
      </div>

      {/* Journal list view */}
      {recentCheckIns.length === 0 ? (
        <div className="text-center py-6 text-xs text-[var(--text-secondary)] bg-white/5 border border-white/5 rounded-lg border-dashed">
          No check-ins logged yet. Ready to start your adventure?
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recentCheckIns.map((c) => {
            const displayDate = formatDisplayDate(c.date);
            const truncatedNote =
              c.note && c.note.length > 80 ? `${c.note.substring(0, 80)}...` : c.note;

            return (
              <Card
                key={c.id}
                elevated
                className="p-3.5 flex items-start justify-between gap-4 font-[family-name:var(--font-body)]"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wider text-[var(--text-secondary)] uppercase">
                    {displayDate}
                  </span>
                  <span className="text-xs text-[var(--text-primary)] font-medium mt-1 select-text">
                    {truncatedNote || 'No reflection note.'}
                  </span>
                  
                  {/* Tagged Stats */}
                  {c.statsTagged.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {c.statsTagged.map((stat) => (
                        <span
                          key={stat}
                          className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[10px] font-semibold text-[var(--text-secondary)] uppercase font-[family-name:var(--font-mono)]"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* XP Earned */}
                <div className="shrink-0 font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--accent-primary)] bg-amber-500/10 border border-amber-400/20 px-2 py-1 rounded select-none">
                  +{c.xpEarned} XP
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
