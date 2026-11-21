import { sql } from '@/lib/db';
import { decryptSecret, encryptSecret } from '@/lib/crypto';

const TWITCH_OAUTH_BASE = 'https://id.twitch.tv/oauth2';
const HELIX_BASE = 'https://api.twitch.tv/helix';

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}

export function siteUrl(): string {
  return env('NEXT_PUBLIC_SITE_URL').replace(/\/$/, '');
}

export type TwitchTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
};

export type TwitchViewerIdentity = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
};

export function buildAuthorizeUrl(params: { redirectUri: string; scope: string; state: string }): string {
  const url = new URL(`${TWITCH_OAUTH_BASE}/authorize`);
  url.searchParams.set('client_id', env('TWITCH_CLIENT_ID'));
  url.searchParams.set('redirect_uri', params.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', params.scope);
  url.searchParams.set('state', params.state);
  return url.toString();
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<TwitchTokenResponse> {
  const body = new URLSearchParams({
    client_id: env('TWITCH_CLIENT_ID'),
    client_secret: env('TWITCH_CLIENT_SECRET'),
    code,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  });

  const res = await fetch(`${TWITCH_OAUTH_BASE}/token`, { method: 'POST', body });
  if (!res.ok) throw new Error(`No se pudo intercambiar el code de Twitch: ${res.status} ${await res.text()}`);
  return res.json();
}

async function refreshToken(refreshTokenValue: string): Promise<TwitchTokenResponse> {
  const body = new URLSearchParams({
    client_id: env('TWITCH_CLIENT_ID'),
    client_secret: env('TWITCH_CLIENT_SECRET'),
    grant_type: 'refresh_token',
    refresh_token: refreshTokenValue,
  });

  const res = await fetch(`${TWITCH_OAUTH_BASE}/token`, { method: 'POST', body });
  if (!res.ok) throw new Error(`No se pudo refrescar el token de Twitch: ${res.status} ${await res.text()}`);
  return res.json();
}

let cachedAppToken: { token: string; expiresAt: number } | null = null;

/** Token de aplicación (client credentials), usado para gestionar suscripciones de EventSub. */
export async function getAppAccessToken(): Promise<string> {
  if (cachedAppToken && cachedAppToken.expiresAt > Date.now() + 30_000) {
    return cachedAppToken.token;
  }

  const body = new URLSearchParams({
    client_id: env('TWITCH_CLIENT_ID'),
    client_secret: env('TWITCH_CLIENT_SECRET'),
    grant_type: 'client_credentials',
  });

  const res = await fetch(`${TWITCH_OAUTH_BASE}/token`, { method: 'POST', body });
  if (!res.ok) throw new Error(`No se pudo obtener el App Access Token: ${res.status} ${await res.text()}`);

  const data: TwitchTokenResponse = await res.json();
  cachedAppToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function helix(path: string, accessToken: string, init?: RequestInit) {
  const res = await fetch(`${HELIX_BASE}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      'Client-Id': env('TWITCH_CLIENT_ID'),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Twitch Helix ${path} → ${res.status}: ${await res.text()}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function getViewerIdentity(accessToken: string): Promise<TwitchViewerIdentity> {
  const data = await helix('/users', accessToken);
  const user = data.data[0];
  if (!user) throw new Error('Twitch no devolvió ningún usuario para este token');
  return user;
}

/** Devuelve un access token de streamer válido, refrescándolo si está a punto de expirar. */
export async function getValidStreamerAccessToken(): Promise<{ accessToken: string; broadcasterUserId: string } | null> {
  const { rows } = await sql`SELECT * FROM streamer_channel LIMIT 1`;
  const channel = rows[0];
  if (!channel) return null;

  const expiresAt = new Date(channel.token_expires_at as string).getTime();
  if (expiresAt > Date.now() + 60_000) {
    return { accessToken: decryptSecret(channel.access_token as string), broadcasterUserId: channel.broadcaster_user_id as string };
  }

  const refreshed = await refreshToken(decryptSecret(channel.refresh_token as string));
  const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  await sql`
    UPDATE streamer_channel
    SET access_token = ${encryptSecret(refreshed.access_token)},
        refresh_token = ${encryptSecret(refreshed.refresh_token)},
        token_expires_at = ${newExpiresAt},
        updated_at = now()
    WHERE broadcaster_user_id = ${channel.broadcaster_user_id}
  `;

  return { accessToken: refreshed.access_token, broadcasterUserId: channel.broadcaster_user_id as string };
}

export type TwitchReward = {
  id: string;
  title: string;
  cost: number;
  is_enabled: boolean;
};

export async function listManageableRewards(broadcasterUserId: string, accessToken: string): Promise<TwitchReward[]> {
  const data = await helix(
    `/channel_points/custom_rewards?broadcaster_id=${broadcasterUserId}&only_manageable_rewards=true`,
    accessToken,
  );
  return data.data;
}

export async function createReward(
  broadcasterUserId: string,
  accessToken: string,
  input: { title: string; cost: number },
): Promise<TwitchReward> {
  const data = await helix(`/channel_points/custom_rewards?broadcaster_id=${broadcasterUserId}`, accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: input.title,
      cost: input.cost,
      is_enabled: true,
      should_redemptions_skip_request_queue: false,
    }),
  });
  return data.data[0];
}

export async function updateRedemptionStatus(params: {
  broadcasterUserId: string;
  accessToken: string;
  rewardId: string;
  redemptionId: string;
  status: 'FULFILLED' | 'CANCELED';
}) {
  await helix(
    `/channel_points/custom_rewards/redemptions?broadcaster_id=${params.broadcasterUserId}&reward_id=${params.rewardId}&id=${params.redemptionId}`,
    params.accessToken,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: params.status }),
    },
  );
}
