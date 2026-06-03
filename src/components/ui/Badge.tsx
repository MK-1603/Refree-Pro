import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; className: string }> = {
  live:       { label: 'LIVE',       className: 'bg-live/20 text-live border border-live/30' },
  scheduled:  { label: 'SCHEDULED',  className: 'bg-foreground/5 text-muted border border-border' },
  completed:  { label: 'COMPLETED',  className: 'bg-primary/20 text-primary border border-primary/30' },
  halftime:   { label: 'HALF TIME',  className: 'bg-yellow-card/20 text-yellow-card border border-yellow-card/30' },
  extra_time: { label: 'EXTRA TIME', className: 'bg-orange-500/20 text-orange-400 border border-orange-500/30' },
  abandoned:  { label: 'ABANDONED',  className: 'bg-red-card/20 text-red-card border border-red-card/30' },
  active:     { label: 'ACTIVE',     className: 'bg-primary/20 text-primary border border-primary/30' },
  archived:   { label: 'ARCHIVED',   className: 'bg-foreground/5 text-muted border border-border' },
};

export function Badge({ status, className }: { status: string; className?: string }) {
  const cfg = statusConfig[status] ?? { label: status.toUpperCase(), className: 'bg-foreground/5 text-muted border border-border' };
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide', cfg.className, className)}>
      {status === 'live' && <span className="live-dot w-1.5 h-1.5" />}
      {cfg.label}
    </span>
  );
}
