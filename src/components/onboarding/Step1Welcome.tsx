import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import type { OnboardingStepProps } from './OnboardingFlow';

export function Step1Welcome({ nextStep }: OnboardingStepProps) {
  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
  }));

  return (
    <div className="relative w-full h-full bg-[#0A0A0F] flex flex-col items-center justify-center overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse"
            style={{
              top: p.top,
              left: p.left,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration,
            }}
          />
        ))}
      </div>

      <div className="z-10 flex flex-col items-center text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[family-name:var(--font-display)] text-5xl md:text-7xl tracking-wide text-[var(--text-primary)] mb-4"
        >
          SOLO QUEST
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-[family-name:var(--font-body)] text-lg text-[var(--text-secondary)] mb-12"
        >
          One quest. One you. Every day.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button variant="primary" size="lg" onClick={nextStep} isPulsing>
            Begin Your Journey
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
