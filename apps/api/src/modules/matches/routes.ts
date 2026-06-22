import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, and, sql } from 'drizzle-orm';
import {
  matches, players, goals, cards, substitutions,
  matchTimerState, tournaments, tournamentStandings,
} from '../../schema';

// ── DB connection ──
const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);


const router = Router();

// ═══════════════════════════════════════
// GET  /api/matches         — list matches
// POST /api/matches         — create match
// ═══════════════════════════════════════
router.get('/', async (req: Request, res: Response) => {
  try {
    const { status, tournamentId, global } = req.query as Record<string, string>;
    const cookies = Object.fromEntries((req.headers.cookie || '').split('; ').map(c => c.split('=')));
    const deviceId = global === 'true' ? null : (cookies['device_id'] || req.headers['x-device-id'] || req.query.deviceId);

    const conditions = [];
    if (status)       conditions.push(eq(matches.status, status));
    if (tournamentId) conditions.push(eq(matches.tournamentId, tournamentId));
    if (deviceId)     conditions.push(eq(matches.deviceId, deviceId as string));

    let query = db.select().from(matches).$dynamic();
    if (conditions.length > 0) query = query.where(and(...conditions));
    const data = await query.orderBy(desc(matches.createdAt));

    const priority = (s: string) => (['live','halftime','extra_time'].includes(s) ? 1 : s === 'scheduled' ? 2 : s === 'completed' ? 3 : 4);
    data.sort((a, b) => {
      const diff = priority(a.status ?? 'scheduled') - priority(b.status ?? 'scheduled');
      if (diff !== 0) return diff;
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const missing = ['venue', 'matchDate', 'matchTime', 'teamA', 'teamB', 'squadFormat'].filter(f => !body[f]);
    if (missing.length > 0) { res.status(400).json({ error: `Missing: ${missing.join(', ')}` }); return; }

    const tournamentId = body.tournamentId?.trim() || null;
    const refereeName  = body.refereeName?.trim()  || null;
    const extraTime    = body.extraTime !== undefined && body.extraTime !== '' ? Number(body.extraTime) : null;
    const deviceId     = req.headers['x-device-id'] as string | null ?? body.deviceId ?? null;

    // Slot conflict check
    const conflict = await sqlClient`
      SELECT id FROM matches
      WHERE match_date = ${body.matchDate} AND match_time = ${body.matchTime}
        AND LOWER(TRIM(venue)) = LOWER(TRIM(${body.venue}))
        AND device_id = ${deviceId}
    `;
    if (conflict.length > 0) { res.status(400).json({ error: 'Slot conflict', detail: 'This time slot at the selected venue is already booked.' }); return; }

    const rows = await sqlClient`
      INSERT INTO matches (tournament_id, match_number, match_date, match_time, venue,
        referee_name, team_a, team_b, team_a_color, team_b_color, squad_format,
        match_duration, break_duration, extra_time, device_id)
      VALUES (${tournamentId}, ${Number(body.matchNumber)}, ${body.matchDate}, ${body.matchTime}, ${body.venue.trim()},
        ${refereeName}, ${body.teamA.trim()}, ${body.teamB.trim()},
        ${body.teamAColor ?? '#0F8A5F'}, ${body.teamBColor ?? '#E74C3C'},
        ${body.squadFormat}, ${Number(body.matchDuration)}, ${Number(body.breakDuration)},
        ${extraTime}, ${deviceId})
      RETURNING *
    `;
    const m = rows[0];

    if (body.players?.length > 0) {
      for (const p of body.players) {
        if (!p.name?.trim()) continue;
        await sqlClient`INSERT INTO players (match_id, team, name, jersey_no) VALUES (${m.id}, ${p.team}, ${p.name.trim()}, ${p.jerseyNo ? Number(p.jerseyNo) : null})`;
      }
    }
    res.status(201).json(m);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to create match', detail: e.message });
  }
});

// ═══════════════════════════════════════
// GET    /api/matches/:id
// PATCH  /api/matches/:id
// DELETE /api/matches/:id
// ═══════════════════════════════════════
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [m] = await db.select().from(matches).where(eq(matches.id, id));
    if (!m) { res.status(404).json({ error: 'Not found' }); return; }

    const [ps, gs, cs, ss, ts] = await Promise.all([
      db.select().from(players).where(eq(players.matchId, id)),
      db.select().from(goals).where(eq(goals.matchId, id)),
      db.select().from(cards).where(eq(cards.matchId, id)),
      db.select().from(substitutions).where(eq(substitutions.matchId, id)),
      db.select().from(matchTimerState).where(eq(matchTimerState.matchId, id)),
    ]);
    res.json({ match: m, players: ps, goals: gs, cards: cs, substitutions: ss, timer: ts[0] ?? null });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };
    if (body.completedAt)         body.completedAt         = new Date(body.completedAt);
    if (body.startedAt)           body.startedAt           = new Date(body.startedAt);
    if (body.halftimeAt)          body.halftimeAt          = new Date(body.halftimeAt);
    if (body.secondHalfStartedAt) body.secondHalfStartedAt = new Date(body.secondHalfStartedAt);
    if (body.extraTimeStartedAt)  body.extraTimeStartedAt  = new Date(body.extraTimeStartedAt);

    const [m] = await db.update(matches).set(body).where(eq(matches.id, id)).returning();
    res.json(m);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await db.delete(matches).where(eq(matches.id, req.params.id));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// GET  /api/matches/:id/events
// ═══════════════════════════════════════
router.get('/:id/events', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [gs, cs, ss] = await Promise.all([
      db.select().from(goals).where(eq(goals.matchId, id)),
      db.select().from(cards).where(eq(cards.matchId, id)),
      db.select().from(substitutions).where(eq(substitutions.matchId, id)),
    ]);
    const events = [
      ...gs.map(g => ({ ...g, eventType: 'goal' })),
      ...cs.map(c => ({ ...c, eventType: 'card' })),
      ...ss.map(s => ({ ...s, eventType: 'sub' })),
    ].sort((a, b) => {
      if (a.elapsedMs != null && b.elapsedMs != null) return (a.elapsedMs as number) - (b.elapsedMs as number);
      return (a.minute as number) - (b.minute as number);
    });
    res.json(events);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// POST /api/matches/:id/goals
// ═══════════════════════════════════════
router.post('/:id/goals', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const [goal] = await db.insert(goals).values({
      matchId: id, playerName: body.playerName, jerseyNo: body.jerseyNo ?? null,
      team: body.team, goalType: body.goalType ?? 'normal', minute: body.minute, elapsedMs: body.elapsedMs ?? null,
    }).returning();

    if (body.team === 'team_a') await db.update(matches).set({ scoreA: sql`score_a + 1` }).where(eq(matches.id, id));
    else                        await db.update(matches).set({ scoreB: sql`score_b + 1` }).where(eq(matches.id, id));

    const [m] = await db.select().from(matches).where(eq(matches.id, id));
    res.status(201).json({ goal, scoreA: m.scoreA, scoreB: m.scoreB });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// POST /api/matches/:id/cards
// ═══════════════════════════════════════
router.post('/:id/cards', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const [card] = await db.insert(cards).values({
      matchId: id, playerName: body.playerName, jerseyNo: body.jerseyNo ?? null,
      team: body.team, cardType: body.cardType, minute: body.minute, elapsedMs: body.elapsedMs ?? null,
    }).returning();
    res.status(201).json(card);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// POST /api/matches/:id/substitutions
// ═══════════════════════════════════════
router.post('/:id/substitutions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const [sub] = await db.insert(substitutions).values({
      matchId: id, team: body.team, playerOut: body.playerOut,
      playerIn: body.playerIn, minute: body.minute, elapsedMs: body.elapsedMs ?? null,
    }).returning();
    res.status(201).json(sub);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// POST /api/matches/:id/undo
// ═══════════════════════════════════════
router.post('/:id/undo', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [lGoal] = await db.select().from(goals).where(and(eq(goals.matchId, id), eq(goals.isUndone, false))).orderBy(desc(goals.createdAt)).limit(1);
    const [lCard] = await db.select().from(cards).where(and(eq(cards.matchId, id), eq(cards.isUndone, false))).orderBy(desc(cards.createdAt)).limit(1);
    const [lSub]  = await db.select().from(substitutions).where(and(eq(substitutions.matchId, id), eq(substitutions.isUndone, false))).orderBy(desc(substitutions.createdAt)).limit(1);

    const candidates = [
      lGoal && { type: 'goal', event: lGoal, ts: new Date(lGoal.createdAt!) },
      lCard && { type: 'card', event: lCard, ts: new Date(lCard.createdAt!) },
      lSub  && { type: 'sub',  event: lSub,  ts: new Date(lSub.createdAt!)  },
    ].filter(Boolean) as { type: string; event: any; ts: Date }[];

    if (candidates.length === 0) { res.status(400).json({ error: 'No events to undo' }); return; }
    candidates.sort((a, b) => b.ts.getTime() - a.ts.getTime());
    const { type, event } = candidates[0];

    if (type === 'goal') {
      await db.update(goals).set({ isUndone: true }).where(eq(goals.id, event.id));
      if (event.team === 'team_a') await db.update(matches).set({ scoreA: sql`GREATEST(0, score_a - 1)` }).where(eq(matches.id, id));
      else                         await db.update(matches).set({ scoreB: sql`GREATEST(0, score_b - 1)` }).where(eq(matches.id, id));
    } else if (type === 'card') {
      await db.update(cards).set({ isUndone: true }).where(eq(cards.id, event.id));
    } else {
      await db.update(substitutions).set({ isUndone: true }).where(eq(substitutions.id, event.id));
    }

    const [m] = await db.select().from(matches).where(eq(matches.id, id));
    res.json({ success: true, type, scoreA: m.scoreA, scoreB: m.scoreB });
  } catch (e: any) {
    res.status(500).json({ error: 'Undo failed', detail: e.message });
  }
});

// ═══════════════════════════════════════
// GET  /api/matches/:id/players
// POST /api/matches/:id/players
// ═══════════════════════════════════════
router.get('/:id/players', async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(players).where(eq(players.matchId, req.params.id));
    res.json(data);
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/players', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const [p] = await db.insert(players).values({ matchId: id, team: body.team, name: body.name, jerseyNo: body.jerseyNo ?? null }).returning();
    res.status(201).json(p);
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

// ═══════════════════════════════════════
// TIMER ROUTES
// ═══════════════════════════════════════
router.get('/:id/timer', async (req: Request, res: Response) => {
  try {
    const [t] = await db.select().from(matchTimerState).where(eq(matchTimerState.matchId, req.params.id));
    res.json(t ?? null);
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/timer/start', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    const [existing] = await db.select().from(matchTimerState).where(eq(matchTimerState.matchId, id));

    if (existing) {
      const extra = existing.pausedAtUnix ? now - (existing.pausedAtUnix as number) : 0;
      await db.update(matchTimerState).set({ isRunning: true, pausedAtUnix: null, totalPausedMs: (existing.totalPausedMs as number ?? 0) + extra, updatedAt: new Date() }).where(eq(matchTimerState.matchId, id));
    } else {
      await db.insert(matchTimerState).values({ matchId: id, startedAtUnix: now, isRunning: true, totalPausedMs: 0, currentHalf: 1, half1StartedAtUnix: now, updatedAt: new Date() });
      await db.update(matches).set({ status: 'live', startedAt: new Date() }).where(eq(matches.id, id));
    }
    const [t] = await db.select().from(matchTimerState).where(eq(matchTimerState.matchId, id));
    res.json(t);
  } catch (e: any) { res.status(500).json({ error: e.message }); }
});

router.post('/:id/timer/pause', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    await db.update(matchTimerState).set({ isRunning: false, pausedAtUnix: now, updatedAt: new Date() }).where(eq(matchTimerState.matchId, id));
    const [t] = await db.select().from(matchTimerState).where(eq(matchTimerState.matchId, id));
    res.json(t);
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/timer/halftime', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.update(matchTimerState).set({ isRunning: false, pausedAtUnix: Date.now(), updatedAt: new Date() }).where(eq(matchTimerState.matchId, id));
    await db.update(matches).set({ status: 'halftime', halftimeAt: new Date() }).where(eq(matches.id, id));
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/timer/second-half', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const now = Date.now();
    await db.update(matchTimerState).set({ isRunning: true, startedAtUnix: now, pausedAtUnix: null, totalPausedMs: 0, currentHalf: 2, half2StartedAtUnix: now, updatedAt: new Date() }).where(eq(matchTimerState.matchId, id));
    await db.update(matches).set({ status: 'live', secondHalfStartedAt: new Date() }).where(eq(matches.id, id));
    res.json({ success: true });
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

router.post('/:id/timer/injury-time', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { injuryTimeMs } = req.body;
    await db.update(matchTimerState).set({ injuryTimeMs, updatedAt: new Date() }).where(eq(matchTimerState.matchId, id));
    const [t] = await db.select().from(matchTimerState).where(eq(matchTimerState.matchId, id));
    res.json(t);
  } catch (e: any) { res.status(500).json({ error: 'Failed' }); }
});

// ═══════════════════════════════════════
// PUT /api/matches/:id/events/:eventId
// ═══════════════════════════════════════
router.put('/:id/events/:eventId', async (req: Request, res: Response) => {
  try {
    const { id, eventId } = req.params;
    const { eventType, minute, playerName, jerseyNo, playerIn, playerOut } = req.body;

    if (eventType === 'goal') {
      await db.update(goals).set({ minute, playerName, jerseyNo: jerseyNo ?? null }).where(eq(goals.id, eventId));
    } else if (eventType === 'card' || eventType === 'yellow' || eventType === 'red') {
      await db.update(cards).set({ minute, playerName, jerseyNo: jerseyNo ?? null }).where(eq(cards.id, eventId));
    } else if (eventType === 'sub') {
      await db.update(substitutions).set({ minute, playerIn, playerOut }).where(eq(substitutions.id, eventId));
    } else {
      return res.status(400).json({ error: 'Unknown event type' });
    }

    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to update event', detail: e.message });
  }
});

export default router;
