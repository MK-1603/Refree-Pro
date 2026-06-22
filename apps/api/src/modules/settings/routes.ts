import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const router = Router();

// Ensure the app_settings table exists (idempotent — safe to run every boot)
async function ensureSettingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS app_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      setting_key TEXT UNIQUE NOT NULL,
      setting_value TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
ensureSettingsTable().catch(console.error);

// GET /api/v1/settings — all settings as flat { key: value } map
router.get('/', async (_req: Request, res: Response) => {
  try {
    const rows = await sql`SELECT setting_key, setting_value FROM app_settings`;
    const result: Record<string, string | null> = {};
    for (const row of rows) result[row.setting_key] = row.setting_value;
    res.json(result);
  } catch {
    // Table may not be ready yet — safe empty fallback (triggers onboarding)
    res.json({});
  }
});

// POST /api/v1/settings/clear — clear the entire database
router.post('/clear', async (req: Request, res: Response) => {
  try {
    const { confirmText } = req.body;
    if (confirmText !== 'CONFIRM') {
      res.status(400).json({ error: 'Invalid confirmation text' });
      return;
    }

    await sql`TRUNCATE TABLE matches, tournaments, players, goals, cards, substitutions, penalty_shootout, match_timer_state, tournament_standings CASCADE;`;
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to clear database', detail: e.message });
  }
});

// POST /api/v1/settings — upsert { key, value }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body as { key: string; value: string };
    if (!key) { res.status(400).json({ error: 'Missing key' }); return; }
    await ensureSettingsTable();
    await sql`
      INSERT INTO app_settings (setting_key, setting_value)
      VALUES (${key}, ${value})
      ON CONFLICT (setting_key) DO UPDATE
        SET setting_value = EXCLUDED.setting_value,
            updated_at    = NOW()
    `;
    res.json({ success: true, key, value });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to save setting', detail: e.message });
  }
});

// DELETE /api/v1/settings/:key
router.delete('/:key', async (req: Request, res: Response) => {
  try {
    await sql`DELETE FROM app_settings WHERE setting_key = ${req.params.key}`;
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: 'Failed', detail: e.message });
  }
});

export default router;
