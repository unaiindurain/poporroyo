import { NextResponse } from 'next/server';
import { requireStreamerSession } from '@/lib/auth';
import { getStreamerChannel } from '@/lib/db';
import { getActivePrizes } from '@/lib/prizes';
import { maybeRevertTtsDiscount } from '@/lib/tts';

export async function GET() {
  const session = await requireStreamerSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  await maybeRevertTtsDiscount().catch((err) => console.error('No se pudo revertir el descuento de TTS:', err));

  const channel = await getStreamerChannel();
  const prizes = await getActivePrizes();

  return NextResponse.json({
    broadcasterLogin: channel?.broadcaster_login,
    rewardId: channel?.reward_id,
    rewardTitle: channel?.reward_title,
    eventsubConnected: Boolean(channel?.eventsub_sub_id),
    prizes,
    tts: {
      rewardId: channel?.tts_reward_id ?? null,
      rewardTitle: channel?.tts_reward_title ?? null,
      baseCost: channel?.tts_base_cost ?? null,
      discountUntil: channel?.tts_discount_until ?? null,
    },
  });
}
