import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { RadarChart } from '../stats/RadarChart';
import type { StatKey } from '../../store/types';

interface StatsRadarCollapsedProps {
  statPoints: Record<StatKey, number>;
  onViewDetails: () => void;
}

export function StatsRadarCollapsed({ statPoints, onViewDetails }: StatsRadarCollapsedProps) {
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
            <div className="px-5 pb-6 pt-2 border-t border-white/5 flex flex-col items-center justify-center gap-4">
              {/* Actual Radar Chart */}
              <div className="w-full max-w-[280px]">
                <RadarChart statPoints={statPoints} />
              </div>

              {/* Stats Summary List */}
              <div className="w-full grid grid-cols-2 gap-2 text-xs font-[family-name:var(--font-mono)]">
                {Object.entries(statPoints).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase"
                  >
                    <span className="text-[var(--text-secondary)]">{key}</span>
                    <span className="font-bold text-[var(--accent-primary)]">{value}</span>
                  </div>
                ))}
              </div>

              {/* View Full analysis link */}
              <button
                type="button"
                onClick={onViewDetails}
                className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs font-bold text-[var(--accent-primary)] hover:text-amber-400 bg-white/[0.01] hover:bg-white/5 transition-all cursor-pointer text-center outline-none select-none uppercase tracking-wider font-[family-name:var(--font-display)] mt-2"
              >
                Analyze Build &rarr;
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

