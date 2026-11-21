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

CREATE TABLE IF NOT EXISTS prizes (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label     TEXT NOT NULL,
  weight    INTEGER NOT NULL CHECK (weight > 0),
  color     TEXT NOT NULL DEFAULT '#FF8C42',
  active    BOOLEAN NOT NULL DEFAULT true,
  position  INTEGER NOT NULL DEFAULT 0
);

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
INSERT INTO prizes (label, weight, color, position)
SELECT * FROM (VALUES
  ('100 puntos extra', 10, '#FF3B7F', 0),
  ('Grito en directo', 20, '#FF8C42', 1),
  ('Sticker de Discord', 25, '#FFD166', 2),
  ('Elegir el próximo juego', 5, '#00F0C8', 3),
  ('Mención en el stream', 20, '#FF3B7F', 4),
  ('Sigue participando', 20, '#B8AEC8', 5)
) AS seed(label, weight, color, position)
WHERE NOT EXISTS (SELECT 1 FROM prizes);
