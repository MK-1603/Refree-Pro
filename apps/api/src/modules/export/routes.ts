import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { matches, tournaments } from '../../schema';

const sqlClient = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlClient);

const router = Router();

// GET /api/v1/export — fetch all matches and tournaments for export
router.get('/', async (_req: Request, res: Response) => {
  try {
    const allMatches = await db.select().from(matches);
    const allTournaments = await db.select().from(tournaments);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      matches: allMatches,
      tournaments: allTournaments
    });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to export data', detail: e.message });
  }
});

export default router;
