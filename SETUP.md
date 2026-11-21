# Configuración del sistema de ruleta de puntos de canal

## 1. Registrar la aplicación en Twitch Developer Console

1. Entra en https://dev.twitch.tv/console/apps y pulsa **Registrar tu aplicación**.
2. **Nombre**: algo único en Twitch, por ejemplo `Poporroyo Ruleta`.
3. **Categoría**: `Website Integration`.
4. **OAuth Redirect URLs** — añade estas 4 (sustituye `<dominio>` por tu dominio final en Vercel o tu dominio propio):
   - `https://<dominio>/api/auth/viewer/callback`
   - `https://<dominio>/api/auth/streamer/callback`
   - `http://localhost:3000/api/auth/viewer/callback` (para desarrollo local)
   - `http://localhost:3000/api/auth/streamer/callback` (para desarrollo local)
5. **Tipo de cliente**: `Confidential`.
6. Guarda y pulsa **Gestionar** sobre la app recién creada.
7. Copia el **Client ID**. Pulsa **Nuevo secreto** para generar el **Client Secret** (solo se muestra una vez, guárdalo ya).

Los scopes no se configuran en la consola: se piden en el momento del login.
- Espectadores: sin scopes (solo se usa el token para identificarlos vía `/helix/users`).
- Streamer: `channel:read:redemptions channel:manage:redemptions`.

## 2. Variables de entorno

Copia `.env.example` a `.env.local` y rellena:

```bash
cp .env.example .env.local
```

| Variable | De dónde sale |
|---|---|
| `TWITCH_CLIENT_ID` / `TWITCH_CLIENT_SECRET` | Paso 1 |
| `TWITCH_EVENTSUB_SECRET` | Invéntatela tú: `openssl rand -hex 32` |
| `SESSION_SECRET` | Invéntatela tú: `openssl rand -base64 48` |
| `TOKEN_ENCRYPTION_KEY` | Invéntatela tú: `openssl rand -base64 32` (debe decodificar a 32 bytes) |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` en local; tu dominio en producción |
| `DATABASE_URL` | La rellena Neon/Vercel automáticamente al crear la base de datos (paso 3) |

## 3. Base de datos (Postgres)

1. En el proyecto de Vercel: **Storage → Create Database → Postgres (Neon)**.
2. Vercel inyecta `DATABASE_URL` (y variantes) automáticamente en el proyecto; para desarrollo local copia esa misma cadena a tu `.env.local`.
3. Aplica el esquema:
   ```bash
   npm install
   npm run migrate
   ```

## 4. Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. El login de Twitch y el panel del streamer funcionan igual en local (siempre que las Redirect URLs de `localhost` estén registradas, paso 1.4).

`EventSub` **no funciona contra `localhost`**: Twitch exige una URL pública HTTPS para el webhook. Para probarlo:
- Despliega una preview en Vercel y usa esa URL pública, o
- Usa el [Twitch CLI](https://dev.twitch.tv/docs/cli/) con `twitch event trigger channel.channel_points_custom_reward_redemption.add -F <url>/api/eventsub/webhook -s $TWITCH_EVENTSUB_SECRET`.

## 5. Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. Añade todas las variables de `.env.example` en **Project Settings → Environment Variables** (producción y preview).
3. Mueve el dominio personalizado de GitHub Pages a este proyecto de Vercel (quita el `CNAME` del repo de GitHub Pages y añade el dominio en **Project Settings → Domains** en Vercel, actualizando los registros DNS que te indique).
4. Tras el primer despliegue, entra en `/panel`, autoriza con la cuenta de Twitch del streamer y vincula o crea la recompensa de la ruleta.
