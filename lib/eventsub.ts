import { createHmac, timingSafeEqual } from 'node:crypto';
import { getAppAccessToken, siteUrl } from '@/lib/twitch';

const HELIX_EVENTSUB_URL = 'https://api.twitch.tv/helix/eventsub/subscriptions';
const REWARD_REDEMPTION_ADD = 'channel.channel_points_custom_reward_redemption.add';

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

/** Crea (o reutiliza) la suscripción de EventSub para los canjes de la recompensa del canal. */
export async function ensureRewardRedemptionSubscription(broadcasterUserId: string): Promise<string> {
  const appToken = await getAppAccessToken();

  const res = await fetch(HELIX_EVENTSUB_URL, {
    method: 'POST',
    headers: {
      'Client-Id': env('TWITCH_CLIENT_ID'),
      Authorization: `Bearer ${appToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: REWARD_REDEMPTION_ADD,
      version: '1',
      condition: { broadcaster_user_id: broadcasterUserId },
      transport: {
        method: 'webhook',
        callback: `${siteUrl()}/api/eventsub/webhook`,
        secret: env('TWITCH_EVENTSUB_SECRET'),
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`No se pudo crear la suscripción de EventSub: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.data[0].id;
}

export async function deleteSubscription(subscriptionId: string): Promise<void> {
  const appToken = await getAppAccessToken();

  await fetch(`${HELIX_EVENTSUB_URL}?id=${subscriptionId}`, {
    method: 'DELETE',
    headers: {
      'Client-Id': env('TWITCH_CLIENT_ID'),
      Authorization: `Bearer ${appToken}`,
    },
  });
}

/** Verifica la firma HMAC-SHA256 que Twitch adjunta a cada petición de EventSub. */
export function verifyEventSubSignature(params: {
  messageId: string;
  messageTimestamp: string;
  rawBody: string;
  signatureHeader: string | null;
}): boolean {
  if (!params.signatureHeader) return false;

  const secret = env('TWITCH_EVENTSUB_SECRET');
  const message = params.messageId + params.messageTimestamp + params.rawBody;
  const expected = 'sha256=' + createHmac('sha256', secret).update(message).digest('hex');

  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(params.signatureHeader);

  return expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf);
}

export const REWARD_REDEMPTION_ADD_TYPE = REWARD_REDEMPTION_ADD;
