import { create } from 'zustand';

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'HALF_TIME' | 'PAUSED' | 'EXTRA_TIME' | 'FULL_TIME';

export interface MatchEvent {
  id: string;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION';
  minute: number; // e.g., 12, 45, 90
  extraMinute?: number; // e.g., 2 for 45+2
  teamId: string;
  playerId: string;
  createdAtUnix: number;
}

interface TimerState {
  startedAtUnix: number | null;
  pausedAtUnix: number | null;
  totalPausedMs: number;
  isRunning: boolean;
  currentHalf: number;
  elapsedMs: number;
  injuryTimeMs: number; // For +1, +2 etc
  status: MatchStatus;
}

interface MatchStore {
  currentMatchId: string | null;
  isMatchOwner: boolean;
  timer: TimerState;
  scoreA: number;
  scoreB: number;
  events: MatchEvent[];
  
  setCurrentMatch: (id: string, isOwner?: boolean) => void;
  setTimer: (t: Partial<TimerState>) => void;
  tickTimer: () => void;
  setScore: (a: number, b: number) => void;
  
  // New Engine Functions
  addEvent: (event: MatchEvent) => void;
  undoLastEvent: () => void;
  setStatus: (status: MatchStatus) => void;
  setInjuryTime: (minutes: number) => void;
}

export const useMatchStore = create<MatchStore>((set, get) => ({
  currentMatchId: null,
  isMatchOwner: false,
  timer: {
    startedAtUnix: null,
    pausedAtUnix: null,
    totalPausedMs: 0,
    isRunning: false,
    currentHalf: 1,
    elapsedMs: 0,
    injuryTimeMs: 0,
    status: 'SCHEDULED',
  },
  scoreA: 0,
  scoreB: 0,
  events: [],
  
  setCurrentMatch: (id, isOwner = false) => set({ currentMatchId: id, isMatchOwner: isOwner }),
  setTimer: (t) => set((s) => ({ timer: { ...s.timer, ...t } })),
  tickTimer: () => {
    const { timer } = get();
    if (!timer.isRunning || !timer.startedAtUnix) return;
    const elapsed = Date.now() - timer.startedAtUnix - timer.totalPausedMs;
    set((s) => ({ timer: { ...s.timer, elapsedMs: Math.max(0, elapsed) } }));
  },
  setScore: (a, b) => set({ scoreA: a, scoreB: b }),
  
  addEvent: (event) => set((s) => ({ events: [...s.events, event] })),
  undoLastEvent: () => set((s) => {
    const newEvents = s.events.slice(0, -1);
    return { events: newEvents };
  }),
  setStatus: (status) => set((s) => ({ timer: { ...s.timer, status } })),
  setInjuryTime: (minutes) => set((s) => ({ timer: { ...s.timer, injuryTimeMs: minutes * 60 * 1000 } })),
}));
