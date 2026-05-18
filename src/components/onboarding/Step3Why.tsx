import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import type { OnboardingStepProps } from './OnboardingFlow';

export function Step3Why({ data, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const [why, setWhy] = useState(data.why);

  const handleContinue = () => {
    updateData({ why: why.trim() });
    nextStep();
  };

  const handleSkip = () => {
    updateData({ why: '' });
    nextStep();
  };

  return (
    <div className="w-full h-full bg-[#0A0A0F] flex flex-col p-6 pt-16 pb-24 md:p-12 relative overflow-y-auto">
      <button onClick={prevStep} className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer">
         &larr; Back
      </button>

      <div className="max-w-xl w-full mx-auto flex-1 flex flex-col mt-12">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)] mb-2"
        >
          Why does this matter to you?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] mb-8"
        >
          Your 'why' is stored privately. It fuels your quest.
        </motion.p>

        <motion.textarea
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          autoFocus
          rows={4}
          placeholder="I want to become stronger..."
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-primary)] font-[family-name:var(--font-body)] text-lg p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent-primary)] resize-none mb-4 transition-colors"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[var(--accent-primary)] font-[family-name:var(--font-body)] text-sm"
        >
          ✦ Completing this awards +25 XP
        </motion.p>
      </div>

      <div className="max-w-xl w-full mx-auto mt-auto pt-8 flex flex-col gap-4 shrink-0">
        <Button variant="primary" size="lg" fullWidth onClick={handleContinue}>
          Continue
        </Button>
        <button onClick={handleSkip} className="text-[var(--text-secondary)] hover:text-white text-sm py-2 cursor-pointer font-[family-name:var(--font-body)] transition-colors">
          Skip
        </button>
      </div>
    </div>
  );
}
