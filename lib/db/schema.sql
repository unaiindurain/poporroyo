-- Esquema de la base de datos del sistema de ruleta de puntos de canal.
-- Aplicado de forma idempotente por scripts/migrate.ts.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  twitch_user_id   TEXT PRIMARY KEY,
  twitch_login     TEXT NOT NULL,
  display_name     TEXT NOT NULL,
  avatar_url       TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS streamer_channel (
  broadcaster_user_id TEXT PRIMARY KEY,
  broadcaster_login   TEXT NOT NULL,
  access_token         TEXT NOT NULL,
  refresh_token         TEXT NOT NULL,
  token_expires_at      TIMESTAMPTZ NOT NULL,
  reward_id             TEXT,
  reward_title          TEXT,
  eventsub_sub_id        TEXT,
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Recompensa de TTS cuyo coste se baja temporalmente al ganar el premio
-- correspondiente en la ruleta (ver prizes.action = 'tts_discount').
ALTER TABLE streamer_channel ADD COLUMN IF NOT EXISTS tts_reward_id TEXT;
ALTER TABLE streamer_channel ADD COLUMN IF NOT EXISTS tts_reward_title TEXT;
ALTER TABLE streamer_channel ADD COLUMN IF NOT EXISTS tts_base_cost INTEGER;
ALTER TABLE streamer_channel ADD COLUMN IF NOT EXISTS tts_discount_until TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS prizes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label            TEXT NOT NULL,
  weight           INTEGER NOT NULL CHECK (weight > 0),
  color            TEXT NOT NULL DEFAULT '#FF8C42',
  active           BOOLEAN NOT NULL DEFAULT true,
  position         INTEGER NOT NULL DEFAULT 0,
  show_on_landing  BOOLEAN NOT NULL DEFAULT false
);

-- Por si la tabla ya existía antes de añadir esta columna.
ALTER TABLE prizes ADD COLUMN IF NOT EXISTS show_on_landing BOOLEAN NOT NULL DEFAULT false;

-- Efecto especial que dispara el backend al ganar este premio (ver lib/tts.ts).
-- Hoy solo existe 'tts_discount'; cualquier otro premio deja esto en NULL.
ALTER TABLE prizes ADD COLUMN IF NOT EXISTS action TEXT CHECK (action IS NULL OR action IN ('tts_discount'));

CREATE TABLE IF NOT EXISTS spins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  redemption_id   TEXT UNIQUE NOT NULL,
  twitch_user_id  TEXT NOT NULL REFERENCES users(twitch_user_id),
  reward_id       TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('pending_claim', 'used')),
  prize_id        UUID REFERENCES prizes(id),
  prize_label     TEXT,
  redeemed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS spins_user_status_idx ON spins (twitch_user_id, status);

-- Premios iniciales de ejemplo (segmentos de la ruleta). Edítalos desde /panel.
-- show_on_landing = true hace que los ganadores de ese premio aparezcan en la
-- portada, para que el streamer sepa con quién contactar.
INSERT INTO prizes (label, weight, color, position, show_on_landing)
SELECT * FROM (VALUES
  ('Camiseta de Poporroyo', 1, '#FFD166', 0, true),
  ('¡Sigue participando! La próxima vez será', 99, '#B8AEC8', 1, false)
) AS seed(label, weight, color, position, show_on_landing)
WHERE NOT EXISTS (SELECT 1 FROM prizes);
