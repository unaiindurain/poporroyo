import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/ruleta', request.url));
  clearSessionCookie(response);
  return response;
}
