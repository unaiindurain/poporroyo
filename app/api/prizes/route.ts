import { NextResponse } from 'next/server';
import { getActivePrizes } from '@/lib/prizes';

export async function GET() {
  const prizes = await getActivePrizes();
  return NextResponse.json({
    prizes: prizes.map((p) => ({ id: p.id, label: p.label, color: p.color })),
  });
}
