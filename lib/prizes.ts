import { sql, type DbPrize } from '@/lib/db';

export async function getActivePrizes(): Promise<DbPrize[]> {
  const { rows } = await sql`
    SELECT * FROM prizes WHERE active = true ORDER BY position ASC
  `;
  return rows as DbPrize[];
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
