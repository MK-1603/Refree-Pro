import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { tournaments, matches, tournamentStandings } from '../../schema';

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

const router = Router();

// GET /api/tournaments
router.get('/', async (req: Request, res: Response) => {
  try {
    const cookies = Object.fromEntries((req.headers.cookie || '').split('; ').map(c => c.split('=')));
    const deviceId = cookies['device_id'] || req.headers['x-device-id'];
    
    let query = db.select().from(tournaments).$dynamic();
    if (deviceId) query = query.where(eq(tournaments.deviceId, deviceId as string));
    const data = await query.orderBy(desc(tournaments.createdAt));
    res.json(data);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// POST /api/tournaments
router.post('/', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const deviceId = req.headers['x-device-id'] as string | null ?? body.deviceId ?? null;
    const [t] = await db.insert(tournaments).values({
      name: body.name,
      venue: body.venue,
      startDate: body.startDate,
      endDate: body.endDate,
      status: 'active',
      deviceId,
    }).returning();
    res.status(201).json(t);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// GET /api/tournaments/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [t] = await db.select().from(tournaments).where(eq(tournaments.id, id));
    if (!t) { res.status(404).json({ error: 'Not found' }); return; }
    const tMatches = await db.select().from(matches).where(eq(matches.tournamentId, id));
    const standings = await db.select().from(tournamentStandings).where(eq(tournamentStandings.tournamentId, id));
    res.json({ tournament: t, matches: tMatches, standings });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// PATCH /api/tournaments/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const [t] = await db.update(tournaments).set(req.body).where(eq(tournaments.id, req.params.id)).returning();
    res.json(t);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

// DELETE /api/tournaments/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await db.delete(tournaments).where(eq(tournaments.id, req.params.id));
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

export default router;
