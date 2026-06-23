import { db, Match, MatchEvent, Player, MatchTimerState } from '../database/db';
import { v4 as uuidv4 } from 'uuid';

export const matchService = {
  async getMatches() {
    return db.matches.orderBy('createdAt').reverse().toArray();
  },

  async createMatch(data: any) {
    const id = uuidv4();
    const match: Match = {
      id,
      tournamentId: data.tournamentId || null,
      matchNumber: Number(data.matchNumber) || 1,
      matchDate: data.matchDate,
      matchTime: data.matchTime,
      venue: data.venue.trim(),
      refereeName: data.refereeName?.trim() || null,
      teamA: data.teamA.trim(),
      teamB: data.teamB.trim(),
      teamAColor: data.teamAColor || '#0F8A5F',
      teamBColor: data.teamBColor || '#E74C3C',
      squadFormat: data.squadFormat,
      matchDuration: Number(data.matchDuration),
      breakDuration: Number(data.breakDuration),
      extraTime: data.extraTime ? Number(data.extraTime) : null,
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      isLocked: false,
      createdAt: Date.now(),
    };

    // Slot conflict check locally
    const existing = await db.matches
      .where('matchDate')
      .equals(data.matchDate)
      .toArray();
      
    const conflict = existing.find(
      (m) => m.matchTime === data.matchTime && m.venue.toLowerCase() === data.venue.toLowerCase()
    );

    if (conflict) {
      throw new Error('Slot conflict: This time slot at the selected venue is already booked.');
    }

    await db.matches.add(match);

    if (data.players?.length > 0) {
      const players: Player[] = data.players
        .filter((p: any) => p.name?.trim())
        .map((p: any) => ({
          id: uuidv4(),
          matchId: id,
          team: p.team,
          name: p.name.trim(),
          jerseyNo: p.jerseyNo ? Number(p.jerseyNo) : null,
          createdAt: Date.now(),
        }));
      await db.players.bulkAdd(players);
    }

    return match;
  },

  async getMatchFull(id: string) {
    const match = await db.matches.get(id);
    if (!match) throw new Error('Not found');

    const [players, events, timers] = await Promise.all([
      db.players.where('matchId').equals(id).toArray(),
      db.events.where('matchId').equals(id).toArray(),
      db.timers.get(id)
    ]);

    // Sort events
    events.sort((a, b) => {
      if (a.elapsedMs != null && b.elapsedMs != null) return a.elapsedMs - b.elapsedMs;
      return a.minute - b.minute;
    });

    return { match, players, events, timer: timers || null };
  },

  async updateMatch(id: string, updates: Partial<Match>) {
    await db.matches.update(id, updates);
    return db.matches.get(id);
  },

  async deleteMatch(id: string) {
    await db.transaction('rw', db.matches, db.players, db.events, db.timers, async () => {
      await db.matches.delete(id);
      await db.players.where('matchId').equals(id).delete();
      await db.events.where('matchId').equals(id).delete();
      await db.timers.delete(id);
    });
    return { success: true };
  },

  async getEvents(matchId: string) {
    const events = await db.events.where('matchId').equals(matchId).toArray();
    return events.sort((a, b) => {
      if (a.elapsedMs != null && b.elapsedMs != null) return a.elapsedMs - b.elapsedMs;
      return a.minute - b.minute;
    });
  },

  async addGoal(matchId: string, data: any) {
    const goal: MatchEvent = {
      id: uuidv4(),
      matchId,
      eventType: 'goal',
      playerName: data.playerName,
      jerseyNo: data.jerseyNo ?? null,
      team: data.team,
      goalType: data.goalType ?? 'normal',
      minute: data.minute,
      elapsedMs: data.elapsedMs ?? null,
      isUndone: false,
      createdAt: Date.now(),
    };

    let newScoreA = 0;
    let newScoreB = 0;

    await db.transaction('rw', db.matches, db.events, async () => {
      await db.events.add(goal);
      const match = await db.matches.get(matchId);
      if (match) {
        if (data.team === 'team_a') match.scoreA += 1;
        else match.scoreB += 1;
        await db.matches.put(match);
        newScoreA = match.scoreA;
        newScoreB = match.scoreB;
      }
    });

    return { goal, scoreA: newScoreA, scoreB: newScoreB };
  },

  async addCard(matchId: string, data: any) {
    const card: MatchEvent = {
      id: uuidv4(),
      matchId,
      eventType: 'card',
      playerName: data.playerName,
      jerseyNo: data.jerseyNo ?? null,
      team: data.team,
      cardType: data.cardType,
      minute: data.minute,
      elapsedMs: data.elapsedMs ?? null,
      isUndone: false,
      createdAt: Date.now(),
    };
    await db.events.add(card);
    return card;
  },

  async addSub(matchId: string, data: any) {
    const sub: MatchEvent = {
      id: uuidv4(),
      matchId,
      eventType: 'sub',
      team: data.team,
      playerIn: data.playerIn,
      playerOut: data.playerOut,
      minute: data.minute,
      elapsedMs: data.elapsedMs ?? null,
      isUndone: false,
      createdAt: Date.now(),
    };
    await db.events.add(sub);
    return sub;
  },

  async undoLastEvent(matchId: string) {
    let newScoreA = 0;
    let newScoreB = 0;
    let undoneType = '';

    await db.transaction('rw', db.matches, db.events, async () => {
      const activeEvents = await db.events
        .where('matchId').equals(matchId)
        .filter(e => !e.isUndone)
        .toArray();

      if (activeEvents.length === 0) throw new Error('No events to undo');

      activeEvents.sort((a, b) => b.createdAt - a.createdAt);
      const lastEvent = activeEvents[0];
      undoneType = lastEvent.eventType;

      await db.events.update(lastEvent.id, { isUndone: true });

      const match = await db.matches.get(matchId);
      if (match && lastEvent.eventType === 'goal') {
        if (lastEvent.team === 'team_a') match.scoreA = Math.max(0, match.scoreA - 1);
        else match.scoreB = Math.max(0, match.scoreB - 1);
        await db.matches.put(match);
      }

      if (match) {
        newScoreA = match.scoreA;
        newScoreB = match.scoreB;
      }
    });

    return { success: true, type: undoneType, scoreA: newScoreA, scoreB: newScoreB };
  },

  async updateEvent(matchId: string, eventId: string, updates: Partial<MatchEvent>) {
    await db.events.update(eventId, updates);
    return { success: true };
  },

  async startTimer(matchId: string) {
    const now = Date.now();
    let result: MatchTimerState | undefined;

    await db.transaction('rw', db.matches, db.timers, async () => {
      const existing = await db.timers.get(matchId);
      if (existing) {
        const extra = existing.pausedAtUnix ? now - existing.pausedAtUnix : 0;
        existing.isRunning = true;
        existing.pausedAtUnix = null;
        existing.totalPausedMs += extra;
        existing.updatedAt = now;
        await db.timers.put(existing);
        result = existing;
      } else {
        const timer: MatchTimerState = {
          matchId,
          startedAtUnix: now,
          isRunning: true,
          totalPausedMs: 0,
          currentHalf: 1,
          half1StartedAtUnix: now,
          injuryTimeMs: 0,
          updatedAt: now,
        };
        await db.timers.put(timer);
        await db.matches.update(matchId, { status: 'live', startedAt: new Date(now) });
        result = timer;
      }
    });
    return result;
  },

  async pauseTimer(matchId: string) {
    const now = Date.now();
    let result: MatchTimerState | undefined;
    await db.transaction('rw', db.timers, async () => {
      const existing = await db.timers.get(matchId);
      if (existing) {
        existing.isRunning = false;
        existing.pausedAtUnix = now;
        existing.updatedAt = now;
        await db.timers.put(existing);
        result = existing;
      }
    });
    return result;
  },

  async endHalf(matchId: string) {
    const now = Date.now();
    await db.transaction('rw', db.matches, db.timers, async () => {
      const existing = await db.timers.get(matchId);
      if (existing) {
        existing.isRunning = false;
        existing.pausedAtUnix = now;
        existing.updatedAt = now;
        await db.timers.put(existing);
      }
      await db.matches.update(matchId, { status: 'halftime', halftimeAt: new Date(now) });
    });
    return { success: true };
  },

  async startSecondHalf(matchId: string) {
    const now = Date.now();
    await db.transaction('rw', db.matches, db.timers, async () => {
      const existing = await db.timers.get(matchId);
      if (existing) {
        existing.isRunning = true;
        existing.startedAtUnix = now;
        existing.pausedAtUnix = null;
        existing.totalPausedMs = 0;
        existing.currentHalf = 2;
        existing.half2StartedAtUnix = now;
        existing.updatedAt = now;
        await db.timers.put(existing);
      }
      await db.matches.update(matchId, { status: 'live', secondHalfStartedAt: new Date(now) });
    });
    return { success: true };
  },

  async setInjuryTime(matchId: string, injuryTimeMs: number) {
    let result: MatchTimerState | undefined;
    await db.transaction('rw', db.timers, async () => {
      const existing = await db.timers.get(matchId);
      if (existing) {
        existing.injuryTimeMs = injuryTimeMs;
        existing.updatedAt = Date.now();
        await db.timers.put(existing);
        result = existing;
      }
    });
    return result;
  }
};
