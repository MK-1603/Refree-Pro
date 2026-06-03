import { db, tournaments } from '@/db';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [t] = await db.insert(tournaments).values({
      name: body.name,
      venue: body.venue,
      startDate: body.startDate,
      endDate: body.endDate,
      status: 'active',
    }).returning();
    return NextResponse.json(t, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}
