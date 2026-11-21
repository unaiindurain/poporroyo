import { NextResponse } from 'next/server';
import { requireStreamerSession } from '@/lib/auth';
import { getStreamerChannel } from '@/lib/db';
import { getActivePrizes } from '@/lib/prizes';

export async function GET() {
  const session = await requireStreamerSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const channel = await getStreamerChannel();
  const prizes = await getActivePrizes();

  return NextResponse.json({
    broadcasterLogin: channel?.broadcaster_login,
    rewardId: channel?.reward_id,
    rewardTitle: channel?.reward_title,
    eventsubConnected: Boolean(channel?.eventsub_sub_id),
    prizes,
  });
}
