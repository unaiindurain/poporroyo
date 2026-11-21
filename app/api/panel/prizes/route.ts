import { NextRequest, NextResponse } from 'next/server';
import { requireStreamerSession } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();

  if (!body.label || !body.weight || Number(body.weight) <= 0) {
    return NextResponse.json({ error: 'Nombre y peso (mayor que 0) son obligatorios' }, { status: 400 });
  }

  const { rows: positionRows } = await sql`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM prizes`;

  const { rows } = await sql`
    INSERT INTO prizes (label, weight, color, position)
    VALUES (${body.label}, ${Number(body.weight)}, ${body.color ?? '#FF8C42'}, ${positionRows[0].next})
    RETURNING *
  `;

  return NextResponse.json({ prize: rows[0] });
}

export async function PATCH(request: NextRequest) {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: 'Falta el id del premio' }, { status: 400 });

  const { rows } = await sql`
    UPDATE prizes
    SET label = COALESCE(${body.label}, label),
        weight = COALESCE(${body.weight}, weight),
        color = COALESCE(${body.color}, color),
        active = COALESCE(${body.active}, active)
    WHERE id = ${body.id}
    RETURNING *
  `;

  if (rows.length === 0) return NextResponse.json({ error: 'Premio no encontrado' }, { status: 404 });
  return NextResponse.json({ prize: rows[0] });
}

export async function DELETE(request: NextRequest) {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const id = request.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Falta el id del premio' }, { status: 400 });

  await sql`DELETE FROM prizes WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
