import { db, matches } from '@/db';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const tournamentId = url.searchParams.get('tournamentId');

    let query = db.select().from(matches).$dynamic();
    if (status) query = query.where(eq(matches.status, status));
    if (tournamentId) query = query.where(eq(matches.tournamentId, tournamentId));

    const data = await query.orderBy(desc(matches.createdAt));
    return NextResponse.json(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: 'Failed', detail: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const missing = ['venue', 'matchDate', 'matchTime', 'teamA', 'teamB', 'squadFormat'].filter(f => !body[f]);
    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(', ')}` }, { status: 400 });
    }
    if (!body.matchNumber || isNaN(body.matchNumber)) {
      return NextResponse.json({ error: 'matchNumber must be a valid integer' }, { status: 400 });
    }

    // Sanitize nullable fields — empty string must become null
    const tournamentId = body.tournamentId && String(body.tournamentId).trim() !== '' ? String(body.tournamentId).trim() : null;
    const refereeName = body.refereeName && String(body.refereeName).trim() !== '' ? String(body.refereeName).trim() : null;
    const extraTime = body.extraTime !== null && body.extraTime !== undefined && body.extraTime !== '' ? Number(body.extraTime) : null;

    // Use raw neon SQL to avoid any ORM type coercion issues
    const sql = neon(process.env.DATABASE_URL!);

    const rows = await sql`
      INSERT INTO matches (
        tournament_id, match_number, match_date, match_time, venue,
        referee_name, team_a, team_b, team_a_color, team_b_color,
        squad_format, match_duration, break_duration, extra_time
      ) VALUES (
        ${tournamentId}, ${Number(body.matchNumber)}, ${body.matchDate}, ${body.matchTime}, ${body.venue.trim()},
        ${refereeName}, ${body.teamA.trim()}, ${body.teamB.trim()}, ${body.teamAColor ?? '#0F8A5F'}, ${body.teamBColor ?? '#E74C3C'},
        ${body.squadFormat}, ${Number(body.matchDuration)}, ${Number(body.breakDuration)}, ${extraTime}
      ) RETURNING *
    `;

    const m = rows[0];

    // Insert players if provided
    if (body.players && Array.isArray(body.players) && body.players.length > 0) {
      for (const p of body.players) {
        if (!p.name?.trim()) continue;
        await sql`
          INSERT INTO players (match_id, team, name, jersey_no)
          VALUES (${m.id}, ${p.team}, ${p.name.trim()}, ${p.jerseyNo ? Number(p.jerseyNo) : null})
        `;
      }
    }

    return NextResponse.json(m, { status: 201 });
  } catch (e: unknown) {
    const err = e as Record<string, unknown>;
    const msg = err?.message ?? err?.toString?.() ?? 'Unknown error';
    const detail = err?.cause ?? err?.code ?? '';
    console.error('[POST /api/matches] Full error:', JSON.stringify(err, null, 2));
    return NextResponse.json({ error: 'Failed to create match', detail: `${msg} ${detail}` }, { status: 500 });
  }
}
