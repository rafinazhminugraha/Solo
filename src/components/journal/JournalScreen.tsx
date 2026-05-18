import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { JournalEntry } from './JournalEntry';
import { Button } from '../ui/Button';

interface JournalScreenProps {
  onBack: () => void;
}

type FilterTab = 'all' | 'notes' | 'milestones' | 'achievements';

export function JournalScreen({ onBack }: JournalScreenProps) {
  const checkIns = useGameStore((state) => state.checkIns);
  const quest = useGameStore((state) => state.quest);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const questName = quest?.name || 'Daily Quest';
  const totalCount = checkIns.length;

  // Filter logic
  const filteredEntries = [...checkIns]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // sorted reverse-chronological
    .filter((entry) => {
      if (activeTab === 'notes') {
        return entry.note !== null && entry.note.trim() !== '';
      }
      if (activeTab === 'milestones') {
        return entry.bonusEvents.some((e) => e.type === 'streak_milestone');
      }
      if (activeTab === 'achievements') {
        return entry.bonusEvents.some((e) => e.type === 'achievement');
      }
      return true; // 'all'
    });

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'notes', label: 'With Notes' },
    { key: 'milestones', label: 'Milestones' },
    { key: 'achievements', label: 'Achievements' },
  ];

  return (
    <div className="flex-grow w-full max-w-xl mx-auto px-4 py-6 flex flex-col gap-6 font-[family-name:var(--font-body)]">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-wider text-[var(--text-primary)]">
            QUEST JOURNAL
          </h2>
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wider">
            {totalCount} {totalCount === 1 ? 'check-in' : 'check-ins'} logged
          </span>
        </div>

        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-[var(--text-secondary)] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
      </div>

      {/* Filter tab bar */}
      {totalCount > 0 && (
        <div className="flex border-b border-white/5 relative flex-wrap">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={[
                  'relative px-4 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer select-none outline-none font-[family-name:var(--font-display)]',
                  isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-white',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Entries List or Empty States */}
      <div className="flex-1 flex flex-col">
        {totalCount === 0 ? (
          /* Large empty state (no checkins at all) */
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-6 text-center select-none">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,255,255,0.03)] animate-pulse">
              📖
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">
                Your journey starts with the first entry.
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-xs leading-relaxed">
                Complete your daily quest and check-in to start writing your progress in the legendary journal.
              </p>
            </div>
            <Button variant="primary" size="md" onClick={onBack}>
              Go to Dashboard
            </Button>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* Filter returns empty state */
          <div className="flex-1 flex flex-col items-center justify-center py-16 gap-4 text-center select-none">
            <div className="text-3xl">🔍</div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                No entries match this filter.
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">
                Try selecting a different filter above to explore your logs.
              </p>
            </div>
          </div>
        ) : (
          /* Render check-in entries reverse-chronological list */
          <div className="flex flex-col">
            <AnimatePresence initial={false}>
              {filteredEntries.map((checkIn) => (
                <motion.div
                  key={checkIn.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <JournalEntry checkIn={checkIn} questName={questName} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
