'use client';
import { cn } from '@/lib/utils';
import { MatchTimer } from '@/lib/timer';

interface TimerDisplayProps {
  startedAtUnix: number | null;
  totalPausedMs: number;
  pausedAtUnix?: number | null;
  isRunning: boolean;
  elapsedMs: number;
  currentHalf: number;
  className?: string;
}

const halfLabels: Record<number, string> = { 1: '1ST HALF', 2: '2ND HALF', 3: 'EXTRA TIME' };

export function TimerDisplay({ elapsedMs, isRunning, currentHalf, className }: TimerDisplayProps) {
  const display = MatchTimer.formatDisplay(elapsedMs);
  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <span className="text-xs text-muted tracking-widest font-semibold">{halfLabels[currentHalf] ?? 'MATCH'}</span>
      <span className={cn('timer-display text-5xl font-bold tabular-nums', isRunning ? 'text-live' : 'text-muted')}>
        {display}
      </span>
    </div>
  );
}
