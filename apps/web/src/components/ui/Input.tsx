import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm text-muted font-medium">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>}
        <input
          ref={ref}
          className={cn(
            'w-full bg-background border border-border rounded-xl px-4 py-3.5 text-foreground placeholder:text-muted text-sm outline-none focus:border-primary/50 transition-colors',
            icon && 'pl-11',
            error && 'border-red-card/50',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-card">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
