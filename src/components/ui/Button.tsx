'use client';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-300 min-h-[44px] px-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-primary/90 border border-primary',
        secondary: 'bg-foreground/5 text-foreground border border-border hover:bg-foreground/10 hover:border-foreground/20',
        ghost: 'text-muted hover:text-foreground hover:bg-foreground/5',
        danger: 'bg-red-card text-white hover:bg-red-card/90',
        outline: 'border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary',
      },
      size: {
        sm: 'text-xs min-h-[36px] px-4 rounded-lg',
        md: 'text-sm',
        lg: 'text-base min-h-[52px] px-8 rounded-2xl',
        xl: 'text-lg min-h-[60px] px-10 rounded-2xl',
        icon: 'w-11 h-11 p-0 rounded-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({ className, variant, size, loading, children, onClick, disabled, type, ...rest }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      onClick={onClick}
      type={type}
    >
      {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> : null}
      {children}
    </motion.button>
  );
}
