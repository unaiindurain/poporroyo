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
| X / Twitter | `href="#"` — **pendiente**: no se proporcionó enlace, sustituye el `#` por tu URL real (aparece en la tarjeta de la sección Red y en el footer). |

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
- **YouTube**: en `index.html`, dentro de `#player`, sustituye `VIDEO_ID_PRINCIPAL` y `VIDEO_ID_SECUNDARIO` por el ID del último vídeo de cada canal (la parte final de la URL `youtube.com/watch?v=ESTE_ID`).

### 5. Horario semanal
Edita directamente los textos dentro de `<ol class="schedule__list">` en `index.html`. El día actual se resalta automáticamente mediante JavaScript (no requiere configuración).

### 6. Métricas de Business
En la sección `#business`, sustituye los tres `<span class="stat__value">—</span>` por tus cifras reales (seguidores totales, media de viewers, alcance mensual).

### 7. Clips destacados
Cada `<article class="clip">` en la sección `#clips` es un marcador de posición. Sustituye el título, duración, categoría y añade tu imagen/vídeo dentro de `.clip__media` (puedes poner una `<img>` o `<video>` ahí).

### 8. Imagen Open Graph (vista previa al compartir el enlace)
Coloca una imagen `og-cover.jpg` (1200×630px recomendado) dentro de `assets/` — ya está referenciada en el `<head>` de `index.html`.

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
