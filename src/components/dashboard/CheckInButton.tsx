import { motion } from 'framer-motion';
import { useGameStore } from '../../store/useGameStore';
import { getTodayDateString } from '../../lib/dates';

interface CheckInButtonProps {
  onOpenModal: () => void;
}

export function CheckInButton({ onOpenModal }: CheckInButtonProps) {
  const checkIns = useGameStore((state) => state.checkIns);
  const today = getTodayDateString();

  // Determine check-in state
  const hasCheckedInToday = checkIns.some((c) => c.date === today);

  if (hasCheckedInToday) {
    return (
      <div className="w-full h-16 min-h-[64px] flex items-center justify-center rounded-xl bg-[#12121A] border border-white/5 text-[var(--text-secondary)] font-[family-name:var(--font-display)] text-lg tracking-wider select-none font-bold">
        DONE FOR TODAY ✓
      </div>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onOpenModal}
      animate={{
        boxShadow: [
          '0 0 0 0px rgba(245, 158, 11, 0)',
          '0 0 20px 4px rgba(245, 158, 11, 0.3)',
          '0 0 0 0px rgba(245, 158, 11, 0)',
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileTap={{ scale: 0.98 }}
      className="w-full h-16 min-h-[64px] flex items-center justify-center rounded-xl bg-[rgba(245,158,11,0.06)] border-2 border-[var(--accent-primary)] text-[var(--accent-primary)] font-[family-name:var(--font-display)] text-xl font-bold tracking-widest cursor-pointer hover:bg-[rgba(245,158,11,0.12)] transition-colors select-none outline-none"
    >
      CHECK IN TODAY
    </motion.button>
  );
}
