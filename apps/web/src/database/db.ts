import Dexie, { Table } from 'dexie';

export interface Match {
  id: string;
  tournamentId?: string | null;
  matchNumber: number;
  matchDate: string;
  matchTime: string;
  venue: string;
  refereeName?: string | null;
  teamA: string;
  teamB: string;
  teamAColor: string;
  teamBColor: string;
  squadFormat: string;
  matchDuration: number;
  breakDuration: number;
  extraTime?: number | null;
  scoreA: number;
  scoreB: number;
  status: 'scheduled' | 'live' | 'halftime' | 'extra_time' | 'completed';
  startedAt?: Date | null;
  halftimeAt?: Date | null;
  secondHalfStartedAt?: Date | null;
  extraTimeStartedAt?: Date | null;
  completedAt?: Date | null;
  isLocked: boolean;
  createdAt: number;
}

export interface Player {
  id: string;
  matchId: string;
  team: string; // 'team_a' | 'team_b'
  name: string;
  jerseyNo?: number | null;
  createdAt: number;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  eventType: 'goal' | 'card' | 'sub';
  playerName?: string;
  jerseyNo?: number | null;
  team: string; // 'team_a' | 'team_b'
  goalType?: string;
  cardType?: 'yellow' | 'red';
  playerIn?: string;
  playerOut?: string;
  minute: number;
  elapsedMs?: number | null;
  isUndone: boolean;
  createdAt: number;
}

export interface MatchTimerState {
  matchId: string;
  startedAtUnix?: number | null;
  pausedAtUnix?: number | null;
  totalPausedMs: number;
  isRunning: boolean;
  currentHalf: number;
  half1StartedAtUnix?: number | null;
  half2StartedAtUnix?: number | null;
  extraStartedAtUnix?: number | null;
  injuryTimeMs: number;
  updatedAt: number;
}

export class RefereeDatabase extends Dexie {
  matches!: Table<Match>;
  players!: Table<Player>;
  events!: Table<MatchEvent>;
  timers!: Table<MatchTimerState>;

  constructor() {
    super('RefereeProDB');
    this.version(1).stores({
      matches: 'id, status, matchDate, createdAt',
      players: 'id, matchId, team',
      events: 'id, matchId, eventType, minute, createdAt',
      timers: 'matchId'
    });
  }
}

export const db = new RefereeDatabase();
