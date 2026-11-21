import { NextRequest, NextResponse } from 'next/server';
import { verifyEventSubSignature, REWARD_REDEMPTION_ADD_TYPE } from '@/lib/eventsub';
import { sql, upsertViewer } from '@/lib/db';

type RedemptionEvent = {
  id: string;
  broadcaster_user_id: string;
  user_id: string;
  user_login: string;
  user_name: string;
  reward: { id: string };
  redeemed_at: string;
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const messageId = request.headers.get('Twitch-Eventsub-Message-Id');
  const timestamp = request.headers.get('Twitch-Eventsub-Message-Timestamp');
  const signature = request.headers.get('Twitch-Eventsub-Message-Signature');
  const messageType = request.headers.get('Twitch-Eventsub-Message-Type');

  const isValid = verifyEventSubSignature({
    messageId: messageId ?? '',
    messageTimestamp: timestamp ?? '',
    rawBody,
    signatureHeader: signature,
  });

  if (!isValid) {
    return NextResponse.json({ error: 'firma inválida' }, { status: 403 });
  }

  const body = JSON.parse(rawBody);

  if (messageType === 'webhook_callback_verification') {
    return new NextResponse(body.challenge, { status: 200, headers: { 'Content-Type': 'text/plain' } });
  }

  if (messageType === 'revocation') {
    console.warn('Suscripción de EventSub revocada:', body.subscription);
    return NextResponse.json({ ok: true });
  }

  if (messageType === 'notification' && body.subscription?.type === REWARD_REDEMPTION_ADD_TYPE) {
    const event: RedemptionEvent = body.event;

    const { rows } = await sql`SELECT reward_id FROM streamer_channel WHERE broadcaster_user_id = ${event.broadcaster_user_id}`;
    const configuredRewardId = rows[0]?.reward_id as string | undefined;

    if (configuredRewardId && event.reward.id === configuredRewardId) {
      await upsertViewer({
        id: event.user_id,
        login: event.user_login,
        display_name: event.user_name,
      });

      await sql`
        INSERT INTO spins (redemption_id, twitch_user_id, reward_id, status, redeemed_at)
        VALUES (${event.id}, ${event.user_id}, ${event.reward.id}, 'pending_claim', ${event.redeemed_at})
        ON CONFLICT (redemption_id) DO NOTHING
      `;
    }
  }

  return NextResponse.json({ ok: true });
}
