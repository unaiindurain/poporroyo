import { NextRequest, NextResponse } from 'next/server';
import { requireStreamerSession } from '@/lib/auth';
import { sql } from '@/lib/db';
import { getValidStreamerAccessToken, listManageableRewards, createReward } from '@/lib/twitch';
import { ensureRewardRedemptionSubscription } from '@/lib/eventsub';

export async function GET() {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const streamer = await getValidStreamerAccessToken();
  if (!streamer) return NextResponse.json({ error: 'Canal no vinculado' }, { status: 409 });

  const rewards = await listManageableRewards(streamer.broadcasterUserId, streamer.accessToken);
  return NextResponse.json({ rewards });
}

export async function POST(request: NextRequest) {
  const session = await requireStreamerSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const streamer = await getValidStreamerAccessToken();
  if (!streamer) return NextResponse.json({ error: 'Canal no vinculado' }, { status: 409 });

  const body = await request.json();
  let rewardId: string;
  let rewardTitle: string;

  if (body.action === 'create') {
    if (!body.title || !body.cost || Number(body.cost) <= 0) {
      return NextResponse.json({ error: 'Título y coste son obligatorios' }, { status: 400 });
    }
    const reward = await createReward(streamer.broadcasterUserId, streamer.accessToken, {
      title: body.title,
      cost: Number(body.cost),
    });
    rewardId = reward.id;
    rewardTitle = reward.title;
  } else if (body.action === 'select' && body.rewardId && body.rewardTitle) {
    rewardId = body.rewardId;
    rewardTitle = body.rewardTitle;
  } else {
    return NextResponse.json({ error: 'Petición inválida' }, { status: 400 });
  }

  const { rows } = await sql`SELECT eventsub_sub_id FROM streamer_channel WHERE broadcaster_user_id = ${streamer.broadcasterUserId}`;
  let eventsubSubId = rows[0]?.eventsub_sub_id as string | null;

  if (!eventsubSubId) {
    eventsubSubId = await ensureRewardRedemptionSubscription(streamer.broadcasterUserId);
  }

  await sql`
    UPDATE streamer_channel
    SET reward_id = ${rewardId}, reward_title = ${rewardTitle}, eventsub_sub_id = ${eventsubSubId}, updated_at = now()
    WHERE broadcaster_user_id = ${streamer.broadcasterUserId}
  `;

  return NextResponse.json({ rewardId, rewardTitle });
}
