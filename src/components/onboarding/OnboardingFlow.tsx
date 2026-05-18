import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Step1Welcome } from './Step1Welcome';
import { Step2Quest } from './Step2Quest';
import { Step3Why } from './Step3Why';
import { Step4Rank } from './Step4Rank';
import { Step5Confirmed } from './Step5Confirmed';
import type { QuestCategory } from '../../store/types';

export interface OnboardingData {
  name: string;
  category: QuestCategory;
  why: string;
}

export interface OnboardingStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '10%' : '-10%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '10%' : '-10%',
    opacity: 0,
  }),
};

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    category: 'mind',
    why: '',
  });

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateData = (partial: Partial<OnboardingData>) => {
    setData((d) => ({ ...d, ...partial }));
  };

  const stepProps = { data, updateData, nextStep, prevStep };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--bg-primary)]">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute inset-0 w-full h-full"
        >
          {step === 1 && <Step1Welcome {...stepProps} />}
          {step === 2 && <Step2Quest {...stepProps} />}
          {step === 3 && <Step3Why {...stepProps} />}
          {step === 4 && <Step4Rank {...stepProps} />}
          {step === 5 && <Step5Confirmed {...stepProps} />}
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-50 pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === step ? 'bg-[var(--accent-primary)] scale-125' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
