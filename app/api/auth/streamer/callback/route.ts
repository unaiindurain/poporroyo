import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getViewerIdentity, siteUrl } from '@/lib/twitch';
import { createSessionToken, readAndClearStateCookie, setSessionCookie, clearStateCookie } from '@/lib/session';
import { encryptSecret } from '@/lib/crypto';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(new URL('/panel?error=acceso_denegado', request.url));
  }

  const expectedState = await readAndClearStateCookie('streamer');
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/panel?error=estado_invalido', request.url));
  }

  const token = await exchangeCodeForToken(code, `${siteUrl()}/api/auth/streamer/callback`);
  const identity = await getViewerIdentity(token.access_token);
  const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();

  await sql`
    INSERT INTO streamer_channel (broadcaster_user_id, broadcaster_login, access_token, refresh_token, token_expires_at)
    VALUES (${identity.id}, ${identity.login}, ${encryptSecret(token.access_token)}, ${encryptSecret(token.refresh_token)}, ${expiresAt})
    ON CONFLICT (broadcaster_user_id)
    DO UPDATE SET broadcaster_login = EXCLUDED.broadcaster_login,
                  access_token = EXCLUDED.access_token,
                  refresh_token = EXCLUDED.refresh_token,
                  token_expires_at = EXCLUDED.token_expires_at,
                  updated_at = now()
  `;

  const sessionToken = await createSessionToken({
    twitch_user_id: identity.id,
    twitch_login: identity.login,
    display_name: identity.display_name,
    avatar_url: identity.profile_image_url,
    role: 'streamer',
  });

  const response = NextResponse.redirect(new URL('/panel', request.url));
  setSessionCookie(response, sessionToken);
  clearStateCookie(response, 'streamer');
  return response;
}
