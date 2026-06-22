import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import matchesRouter from './modules/matches/routes';
import tournamentsRouter from './modules/tournaments/routes';
import settingsRouter from './modules/settings/routes';
import exportRouter from './modules/export/routes';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json());

// ── API v1 ──
app.use('/api/v1/matches',     matchesRouter);
app.use('/api/v1/tournaments', tournamentsRouter);
app.use('/api/v1/settings',    settingsRouter);
app.use('/api/v1/export',      exportRouter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', engine: 'Referee Pro V2 API', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`\n  🟢 Referee Pro API  →  http://localhost:${port}`);
  console.log(`  📡 Endpoints ready:`);
  console.log(`     GET/POST  /api/v1/matches`);
  console.log(`     GET/POST  /api/v1/tournaments`);
  console.log(`     GET       /health\n`);
});
