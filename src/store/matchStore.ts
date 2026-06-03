import { create } from 'zustand';

interface TimerState {
  startedAtUnix: number | null;
  pausedAtUnix: number | null;
  totalPausedMs: number;
  isRunning: boolean;
  currentHalf: number;
  elapsedMs: number;
}

interface MatchStore {
  currentMatchId: string | null;
  timer: TimerState;
  scoreA: number;
  scoreB: number;
  setCurrentMatch: (id: string) => void;
  setTimer: (t: Partial<TimerState>) => void;
  tickTimer: () => void;
  setScore: (a: number, b: number) => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  currentMatchId: null,
  timer: {
    startedAtUnix: null,
    pausedAtUnix: null,
    totalPausedMs: 0,
    isRunning: false,
    currentHalf: 1,
    elapsedMs: 0,
  },
  scoreA: 0,
  scoreB: 0,
  setCurrentMatch: (id) => set({ currentMatchId: id }),
  setTimer: (t) => set((s) => ({ timer: { ...s.timer, ...t } })),
  tickTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || !timer.startedAtUnix) return;
    const elapsed = Date.now() - timer.startedAtUnix - timer.totalPausedMs;
    set((s) => ({ timer: { ...s.timer, elapsedMs: Math.max(0, elapsed) } }));
  },
  setScore: (a, b) => set({ scoreA: a, scoreB: b }),
}));
