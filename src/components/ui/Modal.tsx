import { useEffect, useRef, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  fullScreen?: boolean;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const sheetVariants = {
  hidden: { y: '100%', opacity: 0.6 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 340, damping: 38, mass: 1 },
  },
  exit: {
    y: '100%',
    opacity: 0,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const fullScreenVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 38, mass: 1 },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

export function Modal({ isOpen, onClose, children, title, fullScreen = false }: ModalProps) {
  const previousOverflowRef = useRef<string>('');

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      previousOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = previousOverflowRef.current;
    }
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
            onClick={fullScreen ? undefined : onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Dialog'}
            variants={fullScreen ? fullScreenVariants : sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={[
              'fixed z-50 flex flex-col',
              'font-[family-name:var(--font-body)]',
              fullScreen
                ? 'inset-0 bg-[#0A0A0F]'
                : [
                    'bottom-0 left-0 right-0',
                    'max-h-[92dvh] rounded-t-2xl',
                    'bg-[#1A1A26] border-t border-white/8',
                    'shadow-[0_-8px_40px_rgba(0,0,0,0.6)]',
                  ].join(' '),
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {/* Header */}
            {(title || !fullScreen) && (
              <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
                {/* Drag handle for non-fullscreen */}
                {!fullScreen && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
                )}

                {title && (
                  <h2 className="text-[var(--text-primary)] font-semibold text-lg tracking-wide">
                    {title}
                  </h2>
                )}

                {!fullScreen && (
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close dialog"
                    className={[
                      'ml-auto flex items-center justify-center',
                      'w-8 h-8 rounded-full',
                      'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                      'hover:bg-white/10 transition-colors duration-150',
                    ].join(' ')}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
