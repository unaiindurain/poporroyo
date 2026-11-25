import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';
import { getActivePrizes, drawWeightedPrize } from '@/lib/prizes';
import { getValidStreamerAccessToken, updateRedemptionStatus } from '@/lib/twitch';
import { activateTtsDiscount, maybeRevertTtsDiscount } from '@/lib/tts';

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No has iniciado sesión' }, { status: 401 });
  }

  await maybeRevertTtsDiscount().catch((err) => console.error('No se pudo revertir el descuento de TTS:', err));

  const prizes = await getActivePrizes();
  if (prizes.length === 0) {
    return NextResponse.json({ error: 'La ruleta no tiene premios configurados todavía' }, { status: 503 });
  }

  const prize = drawWeightedPrize(prizes);

  // Consumo atómico: solo una petición puede quedarse la fila `pending_claim` más antigua.
  const { rows } = await sql`
    UPDATE spins
    SET status = 'used', prize_id = ${prize.id}, prize_label = ${prize.label}, used_at = now()
    WHERE id = (
      SELECT id FROM spins
      WHERE twitch_user_id = ${session.twitch_user_id} AND status = 'pending_claim'
      ORDER BY redeemed_at ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING id, redemption_id, reward_id
  `;

  const spin = rows[0];
  if (!spin) {
    return NextResponse.json({ error: 'No tienes ninguna tirada disponible' }, { status: 409 });
  }

  if (prize.action === 'tts_discount') {
    await activateTtsDiscount().catch((err) => console.error('No se pudo activar el descuento de TTS:', err));
  }

  // Marcar el canje como cumplido en Twitch (en segundo plano, no bloquea la respuesta al viewer).
  getValidStreamerAccessToken()
    .then((streamer) => {
      if (!streamer) return;
      return updateRedemptionStatus({
        broadcasterUserId: streamer.broadcasterUserId,
        accessToken: streamer.accessToken,
        rewardId: spin.reward_id as string,
        redemptionId: spin.redemption_id as string,
        status: 'FULFILLED',
      });
    })
    .catch((err) => console.error('No se pudo marcar el canje como cumplido en Twitch:', err));

  return NextResponse.json({ prize: { id: prize.id, label: prize.label, color: prize.color } });
}
