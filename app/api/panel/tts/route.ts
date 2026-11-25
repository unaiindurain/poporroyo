import { NextRequest, NextResponse } from 'next/server';
import { requireStreamerSession } from '@/lib/auth';
import { sql } from '@/lib/db';

/** Vincula qué recompensa de puntos de canal es la de TTS, guardando su coste actual como base. */
export async function POST(request: NextRequest) {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  if (!body.rewardId || !body.rewardTitle || !Number.isFinite(Number(body.cost))) {
    return NextResponse.json({ error: 'Falta rewardId, rewardTitle o cost' }, { status: 400 });
  }

  await sql`
    UPDATE streamer_channel
    SET tts_reward_id = ${body.rewardId}, tts_reward_title = ${body.rewardTitle}, tts_base_cost = ${Number(body.cost)}
    WHERE broadcaster_user_id = ${session.twitch_user_id}
  `;

  return NextResponse.json({ ok: true });
}
