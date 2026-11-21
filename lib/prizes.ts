import { sql, type DbPrize } from '@/lib/db';

export async function getActivePrizes(): Promise<DbPrize[]> {
  const { rows } = await sql`
    SELECT * FROM prizes WHERE active = true ORDER BY position ASC
  `;
  return rows as DbPrize[];
}

export type ShirtWinner = {
  twitchLogin: string;
  displayName: string;
  avatarUrl: string | null;
  prizeLabel: string;
  wonAt: string;
};

/** Ganadores de premios marcados para aparecer en la portada (p. ej. la camiseta), para que el streamer sepa con quién contactar. */
export async function getLandingWinners(): Promise<ShirtWinner[]> {
  const { rows } = await sql`
    SELECT u.twitch_login, u.display_name, u.avatar_url, s.prize_label, s.used_at
    FROM spins s
    JOIN prizes p ON p.id = s.prize_id
    JOIN users u ON u.twitch_user_id = s.twitch_user_id
    WHERE s.status = 'used' AND p.show_on_landing = true
    ORDER BY s.used_at DESC
    LIMIT 50
  `;

  return rows.map((row) => ({
    twitchLogin: row.twitch_login,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    prizeLabel: row.prize_label,
    wonAt: row.used_at,
  }));
}

/** Sorteo ponderado por peso. Se ejecuta siempre en el servidor. */
export function drawWeightedPrize(prizes: DbPrize[]): DbPrize {
  if (prizes.length === 0) throw new Error('No hay premios activos configurados en /panel');

  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const prize of prizes) {
    roll -= prize.weight;
    if (roll <= 0) return prize;
  }

  return prizes[prizes.length - 1];
}
