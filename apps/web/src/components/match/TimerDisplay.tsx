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
  matchDuration?: number;
  className?: string;
}

const halfLabels: Record<number, string> = { 1: '1ST HALF', 2: '2ND HALF', 3: 'EXTRA TIME' };

export function TimerDisplay({ elapsedMs, isRunning, currentHalf, matchDuration = 45, className }: TimerDisplayProps) {
  const displayElapsed = currentHalf === 2
    ? elapsedMs + matchDuration * 60 * 1000
    : currentHalf === 3
    ? elapsedMs + matchDuration * 2 * 60 * 1000
    : elapsedMs;

  const display = MatchTimer.formatDisplay(displayElapsed);
  const parts = display.split('.');
  const timePart = parts[0];
  const centiPart = parts[1];

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <span className="text-xs text-muted tracking-widest font-semibold">{halfLabels[currentHalf] ?? 'MATCH'}</span>
      <span className={cn('timer-display text-5xl font-extrabold tabular-nums flex items-baseline justify-center select-none', isRunning ? 'text-live' : 'text-muted')}>
        <span>{timePart}</span>
        {centiPart !== undefined && (
          <span className="text-3xl opacity-75 font-bold ml-0.5">
            .{centiPart}
          </span>
        )}
      </span>
    </div>
  );
}
