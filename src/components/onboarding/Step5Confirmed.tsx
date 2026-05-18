import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { QUEST_CATEGORIES } from '../../constants/stats';
import { useGameStore } from '../../store/useGameStore';
import type { OnboardingStepProps } from './OnboardingFlow';

export function Step5Confirmed({ data, prevStep }: OnboardingStepProps) {
  const categoryDef = QUEST_CATEGORIES.find((c) => c.key === data.category)!;
  const completeOnboarding = useGameStore((state) => state.completeOnboarding);
  
  const xpAward = data.why.trim() ? 25 : 0;
  
  const xpValue = useMotionValue(0);
  const xpSpring = useSpring(xpValue, { stiffness: 50, damping: 20 });
  const xpDisplay = useTransform(xpSpring, (v) => `+${v.toFixed(0)}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      xpValue.set(xpAward);
    }, 800);
    return () => clearTimeout(timer);
  }, [xpAward, xpValue]);

  const handleFinish = () => {
    completeOnboarding({
      name: data.name,
      category: data.category,
      why: data.why || null,
    });
    // Navigation to dashboard handled by parent app checking hasCompletedOnboarding
  };

  return (
    <div className="w-full h-full bg-[#0A0A0F] flex flex-col p-6 pt-16 pb-24 md:p-12 relative items-center overflow-y-auto">
      <button onClick={prevStep} className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer">
         &larr; Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto mt-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [-15, 0] }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="border-4 border-[var(--accent-primary)] text-[var(--accent-primary)] font-[family-name:var(--font-display)] text-2xl font-bold px-6 py-2 rounded-lg transform shadow-[0_0_20px_var(--accent-glow)]">
            QUEST REGISTERED
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <Card elevated className="w-full p-6 flex flex-col gap-4 text-center">
            <h3 className="font-[family-name:var(--font-display)] text-3xl text-[var(--text-primary)]">
              {data.name}
            </h3>
            
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-sm font-medium border" style={{ color: categoryDef.color, borderColor: categoryDef.color + '40', backgroundColor: categoryDef.color + '10' }}>
                {categoryDef.icon} {categoryDef.label}
              </span>
            </div>

            {data.why && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="font-[family-name:var(--font-body)] italic text-[var(--text-secondary)]">
                  "{data.why}"
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <span className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] text-sm">INITIAL XP</span>
          <motion.div className="font-[family-name:var(--font-mono)] text-4xl font-bold text-[var(--accent-primary)] drop-shadow-[0_0_10px_var(--accent-glow)]">
            {xpDisplay}
          </motion.div>
        </motion.div>

      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="max-w-xl w-full mx-auto mt-auto pt-8 shrink-0"
      >
        <Button variant="primary" size="lg" fullWidth onClick={handleFinish} isPulsing>
          Enter the System
        </Button>
      </motion.div>
    </div>
  );
}
