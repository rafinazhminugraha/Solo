import { motion } from 'framer-motion';
import type { ReactNode, MouseEventHandler } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  fullWidth?: boolean;
  isPulsing?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#F59E0B] text-[#0A0A0F] font-semibold',
    'border border-[#F59E0B]',
    'hover:bg-[#FBBF24] hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    'focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
  ].join(' '),

  secondary: [
    'bg-transparent text-[#F59E0B] font-semibold',
    'border border-[#F59E0B]',
    'hover:bg-[#F59E0B]/10 hover:shadow-[0_0_16px_rgba(245,158,11,0.25)]',
    'focus-visible:ring-2 focus-visible:ring-[#F59E0B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[#8888AA] font-medium',
    'border border-transparent',
    'hover:text-[#E8E8F0] hover:bg-white/5',
    'focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
  ].join(' '),

  danger: [
    'bg-[#EF4444] text-white font-semibold',
    'border border-[#EF4444]',
    'hover:bg-[#F87171] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]',
    'focus-visible:ring-2 focus-visible:ring-[#EF4444] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0F]',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  isPulsing = false,
  type = 'button',
  className = '',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={[
        // Base
        'relative inline-flex items-center justify-center',
        'rounded-lg font-[family-name:var(--font-body)]',
        'transition-all duration-200 ease-out',
        'outline-none select-none cursor-pointer',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        // Variant
        variantStyles[variant],
        // Size
        sizeStyles[size],
        // Modifiers
        fullWidth ? 'w-full' : '',
        isPulsing ? 'animate-pulse-glow' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPulsing && variant === 'primary' && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg animate-ping bg-[#F59E0B] opacity-20 pointer-events-none"
        />
      )}
      {children}
    </motion.button>
  );
}
