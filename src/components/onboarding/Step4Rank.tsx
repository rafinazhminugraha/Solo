import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { RANK_DEFINITIONS } from '../../constants/ranks';
import type { OnboardingStepProps } from './OnboardingFlow';

export function Step4Rank({ nextStep, prevStep }: OnboardingStepProps) {
  const rankE = RANK_DEFINITIONS.find(r => r.key === 'E')!;
  
  return (
    <div className="w-full h-full bg-[#0A0A0F] flex flex-col p-6 pt-16 pb-24 md:p-12 relative text-center items-center overflow-y-auto">
      <button onClick={prevStep} className="absolute top-6 left-6 text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer">
         &larr; Back
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl mx-auto mt-12">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 blur-3xl opacity-20 rounded-full" style={{ backgroundColor: rankE.color }} />
          <h1 
            className="font-[family-name:var(--font-display)] text-8xl relative z-10"
            style={{ color: rankE.color, textShadow: `0 0 20px ${rankE.glowColor}` }}
          >
            E
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-[family-name:var(--font-display)] text-xl text-[var(--text-primary)] tracking-widest uppercase mb-4"
        >
          {rankE.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-[family-name:var(--font-body)] text-[var(--text-secondary)] mb-12 max-w-sm"
        >
          Everyone starts here. The question is where you end.
        </motion.p>

        {/* Rank Ladder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-2 items-center"
        >
          {[...RANK_DEFINITIONS].reverse().map((rank) => (
            <div 
              key={rank.key} 
              className={`w-12 h-2 rounded-full transition-all duration-300 ${rank.key === 'E' ? 'opacity-100 scale-110 shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'opacity-20'}`}
              style={{ backgroundColor: rank.color }}
            />
          ))}
        </motion.div>
      </div>

      <div className="max-w-xl w-full mx-auto mt-auto pt-8 shrink-0">
        <Button variant="primary" size="lg" fullWidth onClick={nextStep}>
          Accept Your Rank
        </Button>
      </div>
    </div>
  );
}
