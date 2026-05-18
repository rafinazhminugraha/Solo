import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';

interface StatsRadarCollapsedProps {
  statPoints: Record<string, number>;
}

export function StatsRadarCollapsed({ statPoints }: StatsRadarCollapsedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card elevated className="overflow-hidden font-[family-name:var(--font-body)]">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 text-left outline-none cursor-pointer hover:bg-white/5 transition-colors select-none"
      >
        <span className="font-[family-name:var(--font-display)] text-sm tracking-widest text-[var(--text-secondary)] font-bold">
          STATS RADAR CHART
        </span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[var(--text-secondary)]"
        >
          ▼
        </motion.span>
      </button>

      {/* Expanded Chart Area */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-6 pt-2 border-t border-white/5 flex flex-col items-center justify-center">
              {/* Radar Chart Placeholder Container */}
              <div className="relative w-full max-w-[280px] h-[200px] flex flex-col items-center justify-center bg-white/5 rounded-xl border border-white/5 p-4 mb-4">
                <span className="text-3xl mb-2 select-none">📊</span>
                <span className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">
                  Radar Chart Expanding...
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-1 text-center leading-relaxed">
                  (Visualizing Focus, Discipline, Endurance, Wisdom, Vitality)
                </span>
              </div>

              {/* Stats Summary List */}
              <div className="w-full grid grid-cols-2 gap-3 text-xs font-[family-name:var(--font-mono)]">
                {Object.entries(statPoints).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5"
                  >
                    <span className="uppercase text-[var(--text-secondary)]">{key}</span>
                    <span className="font-bold text-[var(--accent-primary)]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
