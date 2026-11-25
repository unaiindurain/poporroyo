import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export type SessionRole = 'viewer' | 'streamer';

export type SessionPayload = {
  twitch_user_id: string;
  twitch_login: string;
  display_name: string;
  avatar_url: string | null;
  role: SessionRole;
};

const SESSION_COOKIE = 'poporroyo_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('Falta la variable de entorno SESSION_SECRET');
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/* ---------- Cookie de estado OAuth (anti-CSRF, de corta duración) ---------- */

const STATE_MAX_AGE_SECONDS = 60 * 10; // 10 minutos

export function stateCookieName(flow: 'viewer' | 'streamer'): string {
  return `poporroyo_oauth_state_${flow}`;
}

export function setStateCookie(response: NextResponse, flow: 'viewer' | 'streamer', state: string) {
  response.cookies.set(stateCookieName(flow), state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function readAndClearStateCookie(flow: 'viewer' | 'streamer'): Promise<string | null> {
  const store = await cookies();
  return store.get(stateCookieName(flow))?.value ?? null;
}

export function clearStateCookie(response: NextResponse, flow: 'viewer' | 'streamer') {
  response.cookies.delete(stateCookieName(flow));
}

/* ---------- Ruta de vuelta tras el login del viewer (ej. /admin/db) ---------- */

const NEXT_COOKIE = 'poporroyo_oauth_next_viewer';

/** Solo rutas internas (`/algo`), nunca `//evil.com` ni URLs absolutas. */
export function isSafeNextPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//');
}

export function setNextCookie(response: NextResponse, path: string) {
  response.cookies.set(NEXT_COOKIE, path, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function readAndClearNextPath(): Promise<string | null> {
  const store = await cookies();
  return store.get(NEXT_COOKIE)?.value ?? null;
}

export function clearNextCookie(response: NextResponse) {
  response.cookies.delete(NEXT_COOKIE);
}
