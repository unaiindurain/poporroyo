import { sql, getStreamerChannel } from '@/lib/db';
import { getValidStreamerAccessToken, updateRewardCost } from '@/lib/twitch';

export const TTS_DISCOUNT_COST = 5;
export const TTS_DISCOUNT_MINUTES = 5;

/**
 * Baja el coste de la recompensa de TTS a {@link TTS_DISCOUNT_COST} puntos durante
 * {@link TTS_DISCOUNT_MINUTES} minutos. Si el streamer no ha vinculado una recompensa
 * de TTS desde /panel, no hace nada: el premio se sigue anunciando en la ruleta, pero
 * el streamer tiene que bajar el coste a mano en Twitch.
 */
export async function activateTtsDiscount(): Promise<void> {
  const channel = await getStreamerChannel();
  if (!channel?.tts_reward_id || channel.tts_base_cost == null) return;

  const streamer = await getValidStreamerAccessToken();
  if (!streamer) return;

  await updateRewardCost(streamer.broadcasterUserId, streamer.accessToken, channel.tts_reward_id, TTS_DISCOUNT_COST);

  await sql`
    UPDATE streamer_channel
    SET tts_discount_until = now() + (${TTS_DISCOUNT_MINUTES} * interval '1 minute')
    WHERE broadcaster_user_id = ${streamer.broadcasterUserId}
  `;
}

/**
 * Comprobación perezosa: si el descuento ya venció, restaura el coste original.
 * Se llama desde endpoints con tráfico frecuente (/api/me, /api/spin) en vez de
 * depender de un cron, así que el coste puede tardar hasta la siguiente visita en
 * revertirse si nadie usa el sitio justo en ese momento.
 */
export async function maybeRevertTtsDiscount(): Promise<void> {
  const channel = await getStreamerChannel();
  if (!channel?.tts_discount_until) return;
  if (new Date(channel.tts_discount_until).getTime() > Date.now()) return;
  if (!channel.tts_reward_id || channel.tts_base_cost == null) {
    await sql`UPDATE streamer_channel SET tts_discount_until = NULL WHERE broadcaster_user_id = ${channel.broadcaster_user_id}`;
    return;
  }

  const streamer = await getValidStreamerAccessToken();
  if (!streamer) return;

  await updateRewardCost(streamer.broadcasterUserId, streamer.accessToken, channel.tts_reward_id, channel.tts_base_cost);

  await sql`
    UPDATE streamer_channel
    SET tts_discount_until = NULL
    WHERE broadcaster_user_id = ${streamer.broadcasterUserId}
  `;
}
