import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';
import { maybeRevertTtsDiscount } from '@/lib/tts';

export async function GET() {
  await maybeRevertTtsDiscount().catch((err) => console.error('No se pudo revertir el descuento de TTS:', err));

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  const { rows: pendingRows } = await sql`
    SELECT id FROM spins
    WHERE twitch_user_id = ${session.twitch_user_id} AND status = 'pending_claim'
    ORDER BY redeemed_at ASC
    LIMIT 1
  `;

  const { rows: historyRows } = await sql`
    SELECT prize_label, used_at FROM spins
    WHERE twitch_user_id = ${session.twitch_user_id} AND status = 'used'
    ORDER BY used_at DESC
    LIMIT 20
  `;

  return NextResponse.json({
    authenticated: true,
    user: {
      twitch_login: session.twitch_login,
      display_name: session.display_name,
      avatar_url: session.avatar_url,
    },
    hasPendingSpin: pendingRows.length > 0,
    history: historyRows.map((row) => ({ prize: row.prize_label, usedAt: row.used_at })),
  });
}
