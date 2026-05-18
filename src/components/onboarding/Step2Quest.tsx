import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { QUEST_CATEGORIES } from '../../constants/stats';
import type { OnboardingStepProps } from './OnboardingFlow';
import type { QuestCategory } from '../../store/types';

export function Step2Quest({ data, updateData, nextStep, prevStep }: OnboardingStepProps) {
  const [name, setName] = useState(data.name);
  const [category, setCategory] = useState<QuestCategory>(data.category);

  const isValid = name.trim().length > 0;

  const handleContinue = () => {
    if (isValid) {
      updateData({ name: name.trim(), category });
      nextStep();
    }
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
          className="font-[family-name:var(--font-display)] text-2xl text-[var(--text-primary)] mb-8"
        >
          What will you do every single day?
        </motion.h2>

        <motion.input
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          type="text"
          autoFocus
          placeholder="e.g. Meditate for 10 minutes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[var(--bg-input)] text-[var(--text-primary)] font-[family-name:var(--font-body)] text-xl p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[var(--accent-primary)] mb-10 transition-colors"
        />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {QUEST_CATEGORIES.map((cat) => {
            const isSelected = category === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 font-[family-name:var(--font-body)] cursor-pointer ${
                  isSelected 
                    ? 'text-white' 
                    : 'border-white/10 text-[var(--text-secondary)] hover:border-white/30'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.color : 'transparent',
                  borderColor: isSelected ? cat.color : undefined,
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>
      </div>

      <div className="max-w-xl w-full mx-auto mt-auto pt-8 shrink-0">
        <Button variant="primary" size="lg" fullWidth disabled={!isValid} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
