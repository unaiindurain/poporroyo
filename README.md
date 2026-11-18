# POPORROYO // Leonida Broadcast Network

Landing page personalizada para el streamer/YouTuber **Poporroyo**, con estética inspirada en el universo visual de GTA VI / Vice City (atardecer tropical de Miami, noche cálida, estilo Rockstar Games).

Construida con **HTML5 + CSS3 + JavaScript Vanilla ES6+**, sin frameworks ni dependencias externas (solo Google Fonts).

## 📁 Estructura

```
poporroyo/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── img/
│   └── poporroyo.webp   (foto usada en la ficha "Leonida ID" del hero)
├── assets/          (coloca aquí tus imágenes: og-cover.jpg, etc.)
└── README.md
```

## 🚀 Desplegar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `poporroyo` o `poporroyo.github.io`).
2. Sube todos los archivos de esta carpeta a la raíz del repositorio:
   ```bash
   git init
   git add .
   git commit -m "Landing page Poporroyo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```
3. En GitHub, ve a **Settings → Pages**.
4. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda. Tu web estará disponible en `https://TU_USUARIO.github.io/TU_REPO/` (o `https://TU_USUARIO.github.io/` si el repo se llama `TU_USUARIO.github.io`).

## ✏️ Dónde cambiar los datos

### 1. Enlaces de redes sociales
Busca y reemplaza las URLs en **`index.html`** (aparecen en 3 sitios: Hero, sección `#network` y `<footer>`):

| Red | Marcador actual |
|---|---|
| Twitch | `https://www.twitch.tv/poporroyo_` |
| YouTube Principal | `https://www.youtube.com/@poporroyo` |
| YouTube Secundario | `https://www.youtube.com/@PoporroyoDos` |
| TikTok Principal | `https://www.tiktok.com/@poporroyo_` |
| TikTok Secundario | `https://www.tiktok.com/@poporroyogoat` |
| Instagram | `https://www.instagram.com/poporroyo/` |
| Discord | `https://discord.gg/9NjHJTBdT` |

> Nota: la tarjeta de X/Twitter se eliminó de la Red y del footer porque esa cuenta no existe todavía. Si la creas en el futuro, puedes volver a añadirla copiando el patrón de la tarjeta de Instagram en `index.html`.

### 2. Correo de contacto
En `index.html`, dentro de la sección `#business`, el botón de copiar usa:
```html
<button ... data-email="poporroyobisnes@gmail.com">
```
Cambia el valor de `data-email` y el texto visible del `<span>` si usas otro correo.

### 3. Estado "EN DIRECTO"
En **`js/main.js`**, al principio del archivo:
```js
const IS_LIVE = false; // cámbialo a true cuando empieces el directo
```

### 4. Reproductor "EN PANTALLA"
- **Twitch**: en `js/main.js`, variable `TWITCH_CHANNEL = 'poporroyo_'` — ya configurada, el `parent` se calcula automáticamente según el dominio donde se publique.
- **YouTube**: los dos iframes de `#player` apuntan a la *playlist de subidas* de cada canal (`https://www.youtube.com/embed/videoseries?list=UU...`), no a un vídeo concreto. YouTube coloca siempre el vídeo más reciente en primer lugar, así que el reproductor **muestra automáticamente el último vídeo subido** sin que tengas que tocar el código nunca.
  - Canal principal: lista `UUhFPZK4WwDzGYlwZylrp5dg`
  - Canal secundario: lista `UUSs-U38Ki44q7WVyLLY8r7g`
  - Si alguna vez cambias de canal/usuario, obtén el nuevo ID (empieza por `UC`) desde `https://www.youtube.com/@tu_usuario` → "Ver código fuente" → busca `"externalId"`, y sustituye el prefijo `UC` por `UU` en el `list=`.

### 5. Horario semanal
Edita directamente los textos dentro de `<ol class="schedule__list">` en `index.html`. El día actual se resalta automáticamente mediante JavaScript (no requiere configuración).

### 6. Métricas de Business

Dos de las tres cifras se actualizan **solas**, sin que tengas que tocar el código nunca:

- **Suscriptores YouTube** (suma de los dos canales) — en vivo, vía la API oficial de YouTube. Necesita una API key gratuita (una sola vez):
  1. Ve a [Google Cloud Console](https://console.cloud.google.com/) → crea un proyecto.
  2. En "APIs y servicios" → habilita **YouTube Data API v3**.
  3. En "Credenciales" → "Crear credenciales" → **Clave de API**.
  4. Restringe esa clave por **"Referencias HTTP"** y añade tu dominio, p. ej. `https://unaiindurain.github.io/*` (así nadie más puede usar tu clave desde otra web).
  5. Pega la clave en `js/main.js`, en la constante `YOUTUBE_API_KEY = ''`.
  - Mientras `YOUTUBE_API_KEY` esté vacía, el número se queda en `—` y debajo aparece el aviso "Configura YOUTUBE_API_KEY".

- **Miembros Discord** — en vivo, **sin configuración**: usa el enlace de invitación público (`DISCORD_INVITE_CODE` en `js/main.js`, ya configurado con tu invite actual) para leer `approximate_member_count`. Si cambias el enlace de invitación de Discord, actualiza esa constante.

- **Alcance Mensual** — no existe ninguna API pública que dé este dato (es una métrica privada de analíticas). Se calculó a mano como **audiencia combinada**: la suma de seguidores/suscriptores/miembros de las 7 plataformas (Twitch + YouTube principal + YouTube secundario + TikTok principal + TikTok secundario + Instagram + Discord). Última actualización: 49.182 (49,2 mil).

  Para recalcularlo: suma tus seguidores actuales de cada red y edita el `<span class="stat__value">` dentro de `#business` en `index.html` (el comentario justo encima lleva el desglose para que sea fácil actualizarlo).

> Nota: Twitch no permite consultar el nº de seguidores desde el navegador sin un backend que guarde un secreto de cliente, así que no se incluyó como "en vivo". Si más adelante quieres automatizarlo también, haría falta mover el sitio a un hosting con función serverless (p. ej. Vercel) en vez de GitHub Pages puro.

### 7. Clips destacados
La sección `#clips` muestra 4 YouTube Shorts reales del canal (Twitch y TikTok no permiten obtener sus clips automáticamente sin iniciar sesión, así que se usaron los Shorts públicos como fuente). Cada tarjeta es un `<a class="clip">` que enlaza al short real y usa su miniatura oficial (`https://i.ytimg.com/vi/ID/frame0.jpg`).

Para actualizarlos manualmente: cambia el `href` por la URL del clip/short que quieras destacar, el `src` de la `<img>` por su miniatura, y los textos de categoría/vistas/título.

### 8. Foto "Leonida ID" (ficha del hero)
La ficha de personaje del hero usa `img/poporroyo.webp`. Para cambiarla, sustituye ese archivo por otra imagen (manteniendo el mismo nombre) o actualiza la ruta `src` en el `<img class="poster-card__photo">` dentro de `index.html`.

### 9. Imagen Open Graph (vista previa al compartir el enlace)
Coloca una imagen `og-cover.jpg` (1200×630px recomendado) dentro de `assets/` — ya está referenciada en el `<head>` de `index.html`.

### 10. Chat de Discord flotante (WidgetBot)
Al final de `index.html`, justo antes de `</body>`, hay un pequeño script que carga el **Crate** de [WidgetBot](https://widgetbot.io/): una burbuja de chat de Discord flotante, minimizada por defecto, que deja a los visitantes chatear sin salir de la web.

```js
new Crate({
  server: '1329247427945037845', // ID de tu servidor de Discord
  defaultVisibility: 'minimized',
  indicator: true,
});
```

- Si cambias de servidor de Discord, sustituye el `server` por el ID nuevo.
- Puedes añadir `channel: 'ID_DEL_CANAL'` si quieres que abra un canal concreto en vez del que configuraste por defecto en el panel de WidgetBot.
- `defaultVisibility: 'maximized'` hace que empiece abierta en vez de minimizada.

## 🎨 Personalización visual

Todos los colores, tipografías y espaciados están centralizados como *custom properties* al inicio de `css/styles.css`:

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

Cambia estos valores para ajustar la paleta sin tocar el resto del CSS.

## ✅ Buenas prácticas incluidas

- HTML5 semántico y accesible (`aria-label`, roles de pestañas, `alt`/labels en iconos).
- Mobile-first, totalmente responsive (navbar con menú hamburguesa en móvil).
- Meta tags OpenGraph y Twitter Card para compartir en redes.
- `loading="lazy"` en los iframes del reproductor.
- Sin dependencias de frameworks: carga rápida, ideal para PageSpeed > 95.
