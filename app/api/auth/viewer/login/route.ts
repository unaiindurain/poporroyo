import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { buildAuthorizeUrl, siteUrl } from '@/lib/twitch';
import { setStateCookie } from '@/lib/session';

export async function GET(request: NextRequest) {
  const state = randomBytes(16).toString('hex');
  const authorizeUrl = buildAuthorizeUrl({
    redirectUri: `${siteUrl()}/api/auth/viewer/callback`,
    scope: '',
    state,
  });

  const response = NextResponse.redirect(authorizeUrl);
  setStateCookie(response, 'viewer', state);
  return response;
}
