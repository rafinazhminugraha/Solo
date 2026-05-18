import { useState } from 'react';
import { useGameStore, useComputedStats } from '../../store/useGameStore';
import { getRankDefinition } from '../../lib/ranks';
import { QUEST_CATEGORIES } from '../../constants/stats';
import { HunterCard } from './HunterCard';
import { XPBar } from './XPBar';
import { StreakSection } from './StreakSection';
import { CheckInButton } from './CheckInButton';
import { StatsRadarCollapsed } from './StatsRadarCollapsed';
import { AchievementsRow } from './AchievementsRow';
import { RecentJournal } from './RecentJournal';
import { CheckInModal } from '../checkin/CheckInModal';
import type { AppView } from '../../store/types';

interface DashboardScreenProps {
  onNavigate: (view: AppView) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  const quest = useGameStore((state) => state.quest);
  const checkIns = useGameStore((state) => state.checkIns);
  const earnedAchievements = useGameStore((state) => state.earnedAchievements);
  const fullReset = useGameStore((state) => state.fullReset);

  const stats = useComputedStats();
  const rankDef = getRankDefinition(stats.rank);
  const categoryDef = QUEST_CATEGORIES.find((c) => c.key === quest?.category) || {
    icon: '✦',
    label: quest?.category || 'Custom',
  };

  const [isCheckInOpen, setIsCheckInOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-[family-name:var(--font-body)]">
      {/* Navigation Top Header */}
      <nav className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-30 select-none">
        <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-widest text-[var(--text-primary)]">
          SOLO QUEST
        </span>
        <div className="flex items-center gap-2">
          {/* Debug reset button */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset system data? This will clear all quest entries, streaks, and check-ins.')) {
                fullReset();
                window.location.reload();
              }
            }}
            className="p-2 text-red-500/50 hover:text-red-400 transition-colors text-xs font-semibold uppercase cursor-pointer mr-2"
          >
            Reset
          </button>
          
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            aria-label="App Settings"
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-full hover:bg-white/5 transition-colors cursor-pointer select-none outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5 max-w-xl w-full mx-auto pb-28">
        {/* Hunter Card Widget */}
        <HunterCard
          rankDef={rankDef}
          level={stats.level}
          questName={quest?.name || 'My Quest'}
          categoryIcon={categoryDef.icon}
          categoryLabel={categoryDef.label}
        />

        {/* Level XP Bar */}
        <XPBar
          level={stats.level}
          totalXP={stats.totalXP}
          xpInCurrentLevel={stats.xpInCurrentLevel}
          xpToNextLevel={stats.xpToNextLevel}
          totalCheckIns={stats.totalCheckIns}
        />

        {/* Streaks Widget */}
        <StreakSection />

        {/* Primary Daily Action Button */}
        <CheckInButton onOpenModal={() => setIsCheckInOpen(true)} />

        {/* Radar collapsed metrics */}
        <StatsRadarCollapsed statPoints={stats.statPoints} />

        {/* Horizontal unlocked achievements */}
        <AchievementsRow earnedAchievements={earnedAchievements} />

        {/* Recent logs */}
        <RecentJournal
          checkIns={checkIns}
          onViewAll={() => onNavigate('journal')}
        />
      </div>

      {/* Check-In Modal Dialog */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
      />
    </div>
  );
}
