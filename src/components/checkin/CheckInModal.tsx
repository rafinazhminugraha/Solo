import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, useComputedStats } from '../../store/useGameStore';
import { STAT_DEFINITIONS } from '../../constants/stats';
import { ACHIEVEMENT_DEFINITIONS } from '../../constants/achievements';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { RewardScreen } from './RewardScreen';
import { checkFreezeEligibility } from '../../lib/streaks';
import { getTodayDateString } from '../../lib/dates';
import type { StatKey, AchievementDefinition } from '../../store/types';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

export function CheckInModal({ isOpen, onClose }: CheckInModalProps) {
  const quest = useGameStore((state) => state.quest);
  const streak = useGameStore((state) => state.streak);
  const performCheckIn = useGameStore((state) => state.performCheckIn);
  const activateFreeze = useGameStore((state) => state.activateFreeze);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [selectedStats, setSelectedStats] = useState<StatKey[]>([]);
  const [note, setNote] = useState('');
  
  // Track metrics computed pre/post check-in to feed into the RewardScreen
  const [rewardData, setRewardData] = useState<{
    xpEarned: number;
    prevStreak: number;
    newStreak: number;
    newAchievements: AchievementDefinition[];
    milestoneBonus: number | null;
  } | null>(null);

  const today = getTodayDateString();
  const isEligibleForFreeze = checkFreezeEligibility(streak, today);

  const nextStep = () => {
    setDirection(1);
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const toggleStat = (key: StatKey) => {
    setSelectedStats((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleUseFreeze = () => {
    if (isEligibleForFreeze) {
      activateFreeze();
    }
    handleClose();
  };

  const handleSubmit = () => {
    const prevStreak = streak.current;
    
    // Perform check-in directly in store
    performCheckIn(note.trim() || null, selectedStats);

    // Get the newly updated state to calculate rewarded XP and new streak
    const updatedState = useGameStore.getState();
    const newStreak = updatedState.streak.current;
    
    const lastCheckIn = updatedState.checkIns[updatedState.checkIns.length - 1];
    const xpEarned = lastCheckIn ? lastCheckIn.xpEarned : 100;

    // Calculate newly unlocked achievements (earned in the last 4 seconds)
    const now = Date.now();
    const newlyEarned = updatedState.earnedAchievements
      .filter((ea) => now - ea.earnedAt < 4000)
      .map((ea) => {
        return ACHIEVEMENT_DEFINITIONS.find((def) => def.id === ea.achievementId);
      })
      .filter((def): def is AchievementDefinition => !!def);

    // Find milestone bonus
    const milestoneBonus =
      lastCheckIn?.bonusEvents.find((e) => e.type === 'streak_milestone')?.xp || null;

    // Save reward metadata and show the Reward Screen overlay
    setRewardData({
      xpEarned,
      prevStreak,
      newStreak,
      newAchievements: newlyEarned,
      milestoneBonus,
    });
    setStep(4);
  };

  const handleClose = () => {
    // Reset all internal local states upon closing modal
    setStep(1);
    setDirection(1);
    setSelectedStats([]);
    setNote('');
    setRewardData(null);
    onClose();
  };

  const stepProps = {
    questName: quest?.name || 'Daily Quest',
    selectedStats,
    toggleStat,
    note,
    setNote,
    nextStep,
    prevStep,
    handleUseFreeze,
    isEligibleForFreeze,
    handleSubmit,
  };

  return (
    <>
      <Modal isOpen={isOpen && step < 4} onClose={handleClose} title="Daily Check-In">
        <div className="relative w-full overflow-hidden min-h-[300px] flex flex-col justify-between py-2">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-full flex-1 flex flex-col justify-between"
            >
              {step === 1 && <Step1Confirm {...stepProps} />}
              {step === 2 && <Step2Stats {...stepProps} />}
              {step === 3 && <Step3Note {...stepProps} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Modal>

      {/* Render Full-Screen Reward overlay if Step 4 is active */}
      {isOpen && step === 4 && rewardData && (
        <RewardScreen
          xpEarned={rewardData.xpEarned}
          prevStreak={rewardData.prevStreak}
          newStreak={rewardData.newStreak}
          newAchievements={rewardData.newAchievements}
          milestoneBonus={rewardData.milestoneBonus}
          onDismiss={handleClose}
        />
      )}
    </>
  );
}

/* Step subcomponents inline for modularity */

interface StepProps {
  questName: string;
  selectedStats: StatKey[];
  toggleStat: (key: StatKey) => void;
  note: string;
  setNote: (note: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleUseFreeze: () => void;
  isEligibleForFreeze: boolean;
  handleSubmit: () => void;
}

function Step1Confirm({ questName, nextStep, handleUseFreeze, isEligibleForFreeze }: StepProps) {
  return (
    <div className="flex flex-col items-center text-center py-6 w-full max-w-sm mx-auto flex-1 justify-center gap-6 font-[family-name:var(--font-body)]">
      <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)] font-semibold leading-snug">
        Did you complete "{questName}" today?
      </h3>

      <div className="w-full flex flex-col items-center gap-3">
        {/* Yes Button taking 80% width */}
        <div className="w-[80%] h-[72px]">
          <Button variant="primary" size="lg" fullWidth className="h-full font-bold" onClick={nextStep}>
            YES
          </Button>
        </div>

        {/* No/Freeze Button */}
        {isEligibleForFreeze ? (
          <Button variant="ghost" size="sm" onClick={handleUseFreeze}>
            No / Use Streak Freeze ❄️
          </Button>
        ) : (
          <span className="text-[11px] text-[var(--text-muted)] select-none">
            Streak freeze unavailable for today
          </span>
        )}
      </div>
    </div>
  );
}

function Step2Stats({ selectedStats, toggleStat, nextStep, prevStep }: StepProps) {
  return (
    <div className="flex flex-col gap-6 py-4 flex-grow w-full max-w-sm mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevStep} className="text-xs text-[var(--text-secondary)] hover:text-white cursor-pointer select-none font-semibold">
          &larr; Back
        </button>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)] font-bold tracking-wider">
          STEP 2 OF 3
        </span>
        <button type="button" onClick={nextStep} className="text-xs text-[var(--text-secondary)] hover:text-white cursor-pointer select-none font-semibold">
          Skip &rarr;
        </button>
      </div>

      <h3 className="text-lg font-semibold text-[var(--text-primary)]">
        What did you train today?
      </h3>

      {/* Stats list tag selectors */}
      <div className="flex flex-col gap-2.5">
        {STAT_DEFINITIONS.map((def) => {
          const isSelected = selectedStats.includes(def.key);
          return (
            <button
              key={def.key}
              type="button"
              onClick={() => toggleStat(def.key)}
              className={[
                'w-full flex items-center justify-between p-3.5 rounded-xl border font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer select-none outline-none font-[family-name:var(--font-mono)]',
                isSelected
                  ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-[#0A0A0F]'
                  : 'bg-white/5 border-white/5 text-[var(--text-secondary)] hover:border-white/10',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span>{def.label}</span>
              <span className="text-sm select-none">{def.symbol}</span>
            </button>
          );
        })}
      </div>

      <Button variant="primary" size="md" fullWidth onClick={nextStep}>
        Continue
      </Button>
    </div>
  );
}

function Step3Note({ note, setNote, prevStep, handleSubmit }: StepProps) {
  return (
    <div className="flex flex-col gap-5 py-4 flex-grow w-full max-w-sm mx-auto font-[family-name:var(--font-body)]">
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevStep} className="text-xs text-[var(--text-secondary)] hover:text-white cursor-pointer select-none font-semibold">
          &larr; Back
        </button>
        <span className="font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)] font-bold tracking-wider">
          STEP 3 OF 3
        </span>
        <div className="w-10" />
      </div>

      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          How did it feel?
        </h3>
        <span className="text-[11px] text-[var(--text-secondary)]">
          Record a brief reflection reflection (optional)
        </span>
      </div>

      {/* Input reflection area */}
      <div className="flex flex-col gap-1.5 relative">
        <textarea
          rows={3}
          maxLength={200}
          placeholder="Today was tough but I stayed consistent..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-primary)] font-[family-name:var(--font-body)] text-sm p-3.5 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent-primary)] resize-none transition-colors"
        />
        <div className="flex justify-end font-[family-name:var(--font-mono)] text-[10px] text-[var(--text-muted)] mt-1">
          {200 - note.length} remaining
        </div>
      </div>

      <Button variant="primary" size="md" fullWidth onClick={handleSubmit}>
        Submit Check-In
      </Button>
    </div>
  );
}
