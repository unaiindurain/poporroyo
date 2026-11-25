import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getViewerIdentity, siteUrl } from '@/lib/twitch';
import {
  createSessionToken,
  readAndClearStateCookie,
  setSessionCookie,
  clearStateCookie,
  readAndClearNextPath,
  clearNextCookie,
  isSafeNextPath,
} from '@/lib/session';
import { upsertViewer } from '@/lib/db';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const errorParam = request.nextUrl.searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(new URL('/ruleta?error=acceso_denegado', request.url));
  }

  const expectedState = await readAndClearStateCookie('viewer');
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL('/ruleta?error=estado_invalido', request.url));
  }

  const token = await exchangeCodeForToken(code, `${siteUrl()}/api/auth/viewer/callback`);
  const identity = await getViewerIdentity(token.access_token);

  await upsertViewer({
    id: identity.id,
    login: identity.login,
    display_name: identity.display_name,
    avatar_url: identity.profile_image_url,
  });

  const sessionToken = await createSessionToken({
    twitch_user_id: identity.id,
    twitch_login: identity.login,
    display_name: identity.display_name,
    avatar_url: identity.profile_image_url,
    role: 'viewer',
  });

  const next = await readAndClearNextPath();
  const target = next && isSafeNextPath(next) ? next : '/ruleta';

  const response = NextResponse.redirect(new URL(target, request.url));
  setSessionCookie(response, sessionToken);
  clearStateCookie(response, 'viewer');
  clearNextCookie(response);
  return response;
}
