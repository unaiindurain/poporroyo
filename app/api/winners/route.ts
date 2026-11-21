import { NextResponse } from 'next/server';
import { getLandingWinners } from '@/lib/prizes';

export async function GET() {
  const winners = await getLandingWinners();
  return NextResponse.json({ winners });
}
