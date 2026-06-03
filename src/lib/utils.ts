import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimer(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function calculateElapsedMs(
  startedAtUnix: number,
  totalPausedMs: number,
  pausedAtUnix?: number | null
): number {
  if (pausedAtUnix) return pausedAtUnix - startedAtUnix - totalPausedMs;
  return Date.now() - startedAtUnix - totalPausedMs;
}

export function getMatchMinute(elapsedMs: number): number {
  return Math.floor(elapsedMs / 60000) + 1;
}
