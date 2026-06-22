'use client';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
  { label: 'Details', desc: 'Venue & date' },
  { label: 'Teams',   desc: 'Names & colors' },
  { label: 'Config',  desc: 'Duration & rules' },
  { label: 'Review',  desc: 'Confirm & launch' },
];

export function CreateMatchStepper({ current }: { current: number }) {
  return (
    <div className="w-full space-y-3">
      {/* Segmented progress bar */}
      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full overflow-hidden bg-foreground/10"
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                i < current ? 'w-full bg-foreground' :
                i === current ? 'w-1/2 bg-foreground/60' :
                'w-0 bg-foreground'
              )}
            />
          </div>
        ))}
      </div>

      {/* Step dots + labels */}
      <div className="flex justify-between">
        {STEPS.map((step, i) => {
          const done   = i < current;
          const active = i === current;
          return (
            <div key={step.label} className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300',
                done   ? 'bg-foreground text-background shadow-sm' :
                active ? 'bg-foreground text-background ring-[3px] ring-foreground/20' :
                         'bg-foreground/8 text-muted-foreground border border-border/40',
              )}>
                {done ? <Check size={11} strokeWidth={3} /> : i + 1}
              </div>
              <div className="flex flex-col items-center">
                <span className={cn(
                  'text-[9px] font-black uppercase tracking-widest leading-none',
                  active ? 'text-foreground' : done ? 'text-foreground/50' : 'text-muted-foreground/60',
                )}>
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
