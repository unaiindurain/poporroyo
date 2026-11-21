# POPORROYO // Leonida Broadcast Network

Web personalizada para el streamer/YouTuber **Poporroyo**, con estética inspirada en el universo visual de GTA VI / Vice City (atardecer tropical de Miami, noche cálida, estilo Rockstar Games), más un sistema de **ruleta de puntos de canal de Twitch**: los espectadores inician sesión con su cuenta de Twitch y, al canjear una recompensa de puntos de canal en el chat, desbloquean una tirada en `/ruleta`.

Construida con **Next.js (App Router) + TypeScript**, desplegada en **Vercel** con **Postgres (Neon)**.

## 📁 Estructura

```
poporroyo/
├── app/
│   ├── page.tsx               (landing)
│   ├── ruleta/page.tsx        (ruleta, requiere login de Twitch)
│   ├── panel/page.tsx         (panel del streamer)
│   └── api/                   (auth, EventSub, sorteo, panel)
├── components/
│   ├── landing/                (secciones de la landing)
│   ├── ruleta/                 (rueda + vista de la ruleta)
│   └── panel/                  (vista del panel del streamer)
├── lib/                        (db, twitch, eventsub, sesión, cifrado, sorteo)
├── scripts/migrate.ts           (aplica lib/db/schema.sql)
├── public/img/, public/assets/
├── .env.example
└── SETUP.md                    (registro en Twitch, variables, despliegue)
```

## 🎰 Sistema de ruleta de Twitch

Ver **[SETUP.md](./SETUP.md)** para la guía completa: registrar la app en Twitch Developer Console, variables de entorno, base de datos y despliegue.

Resumen del flujo: el streamer autoriza la app una vez desde `/panel` (vincula o crea la recompensa de puntos de canal); cuando un espectador la canjea en el chat, Twitch avisa al backend vía EventSub, que guarda la tirada disponible; el espectador, tras iniciar sesión con Twitch en `/ruleta`, pulsa "girar" y el servidor decide el premio de forma atómica (nunca en el navegador) y lo consume para que no se pueda repetir.

## 🚀 Desarrollo y despliegue

```bash
npm install
cp .env.example .env.local   # rellena las variables, ver SETUP.md
npm run migrate              # crea las tablas en Postgres
npm run dev
```

Para producción: importa el repo en Vercel, añade las variables de entorno y una base de datos Postgres (Neon) desde **Storage**, y mueve tu dominio personalizado a este proyecto (detalles en SETUP.md).

## ✏️ Dónde cambiar los datos de la landing

### 1. Configuración general
`lib/site-config.ts` centraliza: `IS_LIVE`, canal de Twitch, clave de la API de YouTube, IDs de canal, invitación de Discord.

### 2. Enlaces de redes sociales
Están repetidos en `components/landing/Hero.tsx`, `NetworkSection.tsx` y `Footer.tsx` (Twitch, YouTube x2, TikTok x2, Instagram, Discord).

### 3. Correo de contacto
`components/landing/BusinessSection.tsx`, constante `email`.

### 4. Reproductor "EN PANTALLA"
`components/landing/PlayerSection.tsx`: Twitch usa `TWITCH_CHANNEL` de `lib/site-config.ts`; los dos iframes de YouTube apuntan a las *playlists de subidas* de cada canal (`UU...`), así que siempre muestran el último vídeo sin tocar código.

### 5. Horario semanal
`components/landing/ScheduleSection.tsx`, array `DAYS`. El día actual se resalta automáticamente.

### 6. Métricas de Business
`components/landing/BusinessSection.tsx`: suscriptores de YouTube (vía `YOUTUBE_API_KEY` en `lib/site-config.ts`) y miembros de Discord se cargan en vivo; el "Alcance Mensual" es manual (editar el `<span>` correspondiente).

### 7. Clips destacados
Array `CLIPS` en `components/landing/ClipsSection.tsx`.

### 8. Foto "Leonida ID"
`public/img/poporroyo.webp`, referenciada en `components/landing/Hero.tsx`.

### 9. Imagen Open Graph
`public/assets/og-cover.jpg` (1200×630px), referenciada en `app/layout.tsx`.

### 10. Chat de Discord flotante (WidgetBot)
`components/landing/DiscordWidget.tsx`, constante `DISCORD_SERVER_ID` en `lib/site-config.ts`.

### 11. Premios y recompensa de la ruleta
Desde `/panel` (autorizado como streamer): vincula o crea la recompensa de puntos de canal y edita los premios (nombre, peso, color) de la ruleta.

## 🎨 Personalización visual

Colores, tipografías y espaciados están centralizados como *custom properties* al inicio de `app/globals.css`:

```css
:root {
  --bg-deep: #0D0914;
  --bg-surface: #161021;
  --sunset-pink: #FF3B7F;
  --sunset-orange: #FF8C42;
  --pool-teal: #00F0C8;
  --sun-yellow: #FFD166;
  --text-warm: #FFF8F0;
  --text-lavender: #B8AEC8;
}
```
