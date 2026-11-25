import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/auth';
import { sql } from '@/lib/db';

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const [users, streamerChannel, prizes, spins] = await Promise.all([
    sql`SELECT twitch_user_id, twitch_login, display_name, avatar_url, created_at FROM users ORDER BY created_at DESC`,
    sql`SELECT broadcaster_user_id, broadcaster_login, reward_id, reward_title, eventsub_sub_id, updated_at FROM streamer_channel ORDER BY updated_at DESC`,
    sql`SELECT id, label, weight, color, active, position, show_on_landing FROM prizes ORDER BY position`,
    sql`SELECT id, redemption_id, twitch_user_id, reward_id, status, prize_id, prize_label, redeemed_at, used_at FROM spins ORDER BY redeemed_at DESC`,
  ]);

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    users: users.rows,
    streamerChannel: streamerChannel.rows,
    prizes: prizes.rows,
    spins: spins.rows,
  });
}
