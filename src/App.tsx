import { useEffect, useState } from 'react';
import { useGameStore } from './store/useGameStore';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { LevelUpCeremony } from './components/ceremonies/LevelUpCeremony';
import { RankUpCeremony } from './components/ceremonies/RankUpCeremony';
import type { AppView } from './store/types';

function App() {
  const hasCompletedOnboarding = useGameStore((state) => state.hasCompletedOnboarding);
  const pendingCeremony = useGameStore((state) => state.pendingCeremony);
  
  const [hydrated, setHydrated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');

  useEffect(() => {
    // Setup state hydration listener
    const unsubFinish = useGameStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useGameStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsubFinish();
    };
  }, []);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-[#E8E8F0] font-sans">
        <div className="text-2xl font-bold animate-pulse">Solo Quest — Loading...</div>
      </div>
    );
  }

  // Gate onboarding first
  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)]">
      {/* Active screen content switch */}
      {currentView === 'dashboard' && (
        <DashboardScreen onNavigate={setCurrentView} />
      )}

      {currentView === 'journal' && (
        <div className="min-h-screen flex flex-col p-6 max-w-xl mx-auto text-center justify-center items-center font-[family-name:var(--font-body)]">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent-primary)] mb-3 font-bold">
            JOURNAL LOGS
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm">
            All your daily reflections and quest outcomes are safely archived here. Full Journal screen coming in Phase 8!
          </p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold uppercase cursor-pointer"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      )}

      {currentView === 'stats' && (
        <div className="min-h-screen flex flex-col p-6 max-w-xl mx-auto text-center justify-center items-center font-[family-name:var(--font-body)]">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent-primary)] mb-3 font-bold">
            STATS ANALYSIS
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm">
            In-depth training radar chart, XP progression velocity, and history logs. Coming in Phase 7!
          </p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold uppercase cursor-pointer"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      )}

      {currentView === 'settings' && (
        <div className="min-h-screen flex flex-col p-6 max-w-xl mx-auto text-center justify-center items-center font-[family-name:var(--font-body)]">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent-primary)] mb-3 font-bold">
            SYSTEM SETTINGS
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6 max-w-sm">
            Configure reminder timers, alerts, and toggle profile resets. Full screen coming in Phase 8!
          </p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold uppercase cursor-pointer"
          >
            &larr; Back to Dashboard
          </button>
        </div>
      )}

      {/* Global Ceremonies Overlays (Level-Up & Rank-Up) rendered in front of everything */}
      {pendingCeremony && pendingCeremony.type === 'level_up' && <LevelUpCeremony />}
      {pendingCeremony && pendingCeremony.type === 'rank_up' && <RankUpCeremony />}
    </div>
  );
}

export default App;
