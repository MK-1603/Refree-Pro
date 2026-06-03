import { cn } from '@/lib/utils';

const steps = ['Details', 'Teams', 'Config', 'Review'];

export function CreateMatchStepper({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              i < current ? 'bg-primary text-white' : i === current ? 'border-2 border-primary text-primary' : 'border border-border text-muted')}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={cn('text-[10px] mt-1 hidden sm:block', i === current ? 'text-primary' : 'text-muted')}>{s}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('flex-1 h-px mx-2', i < current ? 'bg-primary' : 'bg-border')} />
          )}
        </div>
      ))}
    </div>
  );
}
