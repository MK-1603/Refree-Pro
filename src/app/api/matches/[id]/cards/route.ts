import { db, cards } from '@/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const [card] = await db.insert(cards).values({
      matchId: id,
      playerName: body.playerName,
      jerseyNo: body.jerseyNo ?? null,
      team: body.team,
      cardType: body.cardType,
      minute: body.minute,
    }).returning();
    return NextResponse.json(card, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
