import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

export type DbUser = {
  twitch_user_id: string;
  twitch_login: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
};

export type DbStreamerChannel = {
  broadcaster_user_id: string;
  broadcaster_login: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  reward_id: string | null;
  reward_title: string | null;
  eventsub_sub_id: string | null;
  updated_at: string;
};

export type DbPrize = {
  id: string;
  label: string;
  weight: number;
  color: string;
  active: boolean;
  position: number;
  show_on_landing: boolean;
};

export type SpinStatus = 'pending_claim' | 'used';

export type DbSpin = {
  id: string;
  redemption_id: string;
  twitch_user_id: string;
  reward_id: string;
  status: SpinStatus;
  prize_id: string | null;
  prize_label: string | null;
  redeemed_at: string;
  used_at: string | null;
};

type SqlTag = {
  (strings: TemplateStringsArray, ...values: unknown[]): Promise<{ rows: any[] }>;
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>;
};

let client: NeonQueryFunction<false, true> | null = null;

function getClient(): NeonQueryFunction<false, true> {
  if (!client) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('Falta la variable de entorno DATABASE_URL');
    client = neon(connectionString, { fullResults: true });
  }
  return client;
}

/** Cliente Postgres (Neon) perezoso: no lee `DATABASE_URL` hasta la primera consulta. */
export const sql: SqlTag = Object.assign(
  (strings: TemplateStringsArray, ...values: unknown[]) => getClient()(strings, ...values),
  { query: (text: string, params?: unknown[]) => getClient().query(text, params ?? []) },
);

export async function upsertViewer(user: { id: string; login: string; display_name: string; avatar_url?: string | null }) {
  await sql`
    INSERT INTO users (twitch_user_id, twitch_login, display_name, avatar_url)
    VALUES (${user.id}, ${user.login}, ${user.display_name}, ${user.avatar_url ?? null})
    ON CONFLICT (twitch_user_id)
    DO UPDATE SET twitch_login = EXCLUDED.twitch_login,
                  display_name = EXCLUDED.display_name,
                  avatar_url = EXCLUDED.avatar_url
  `;
}

export async function getStreamerChannel(): Promise<DbStreamerChannel | null> {
  const { rows } = await sql`SELECT * FROM streamer_channel ORDER BY updated_at DESC LIMIT 1`;
  return (rows[0] as DbStreamerChannel) ?? null;
}
