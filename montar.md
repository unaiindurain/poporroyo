Actúa como un Director de Arte y Desarrollador Frontend Senior especializado en branding de entretenimiento, cultura pop y videojuegos AAA.

Necesito que desarrolles una landing page personalizada para un streamer y YouTuber, lista para alojarse en GitHub Pages, con una estética inspirada en el universo visual de **GTA VI / Vice City moderno** (atardecer tropical de Miami, noche cálida, vibras de Leonida, estilo cinematográfico de Rockstar Games).

### 1. Datos del Creador (Rellena esto antes de enviar)
- **Nombre / Nick:** Poporroyo
- **Slogan / Bio corta:** Haciendo historia con todos vosotros.
- **Ecosistema de Redes Sociales (8 plataformas):**
  - **Twitch (Principal):** https://www.twitch.tv/poporroyo_
  - **YouTube (Principal):** https://www.youtube.com/@poporroyo
  - **YouTube Secundario:** https://www.youtube.com/@PoporroyoDos
  - **TikTok (Principal):** https://www.tiktok.com/@poporroyo_
  - **TikTok Secundario:** https://www.tiktok.com/@poporroyogoat
  - **Instagram:** https://www.instagram.com/poporroyo/
  - **Discord (Comunidad):** https://discord.gg/9NjHJTBdT
- **Correo de contacto / Negocios:** poporroyobisnes@gmail.com

### 2. Dirección de Arte: Estética GTA VI / Leonida (OBLIGATORIO)
Quiero un diseño con identidad visual cinematográfica y humana, evitando por completo las plantillas genéricas de IA:
- **PROHIBIDO:** No uses tarjetas blancas ni el típico diseño SaaS cuadrado con degradados morado-azul genéricos. Evita el exceso de glassmorphism borroso.
- **Paleta de Colores (Vice City Sunset & Night):**
  - Fondo principal: Noche profunda tropical (`#0D0914`) y superficies en tono berenjena/asfalto oscuro (`#161021`).
  - Acentos principales: Degradado cálido de atardecer en Miami (`linear-gradient(135deg, #FF3B7F 0%, #FF8C42 100%)`), acompañado de toques de turquesa piscina (`#00F0C8`) y amarillo sol cálido (`#FFD166`) para detalles puntuales.
  - Textos: Blanco cálido (`#FFF8F0`) y gris lavanda suave (`#B8AEC8`).
- **Textura y Atmósfera:** Añade un sutil overlay de grano cinematográfico (SVG noise muy suave con `opacity: 0.03` y `pointer-events: none`) sobre el fondo para darle acabado de póster/tráiler de videojuego.
- **Tipografía con Personalidad:**
  - Titulares grandes y agresivos: *Anton* o *Bebas Neue* (Google Fonts) en mayúsculas, con tracking ajustado y sombras duras o degradados cálidos.
  - Subtítulos/Etiquetas estilo matrícula o postal de Vice City: *Space Mono* o *JetBrains Mono*.
  - Cuerpo de texto limpio: *Plus Jakarta Sans*.
- **Composición y Detalles Visuales:**
  - Bordes nítidos (`1px solid rgba(255, 140, 66, 0.25)`) con esquinas ligeramente recortadas o radios pequeños (`4px`).
  - Elementos gráficos estilo "Weazel News / Leonida", sellos de ubicación, coordenadas ficticias o reales, y una cinta *marquee* horizontal con el nick del creador y frases icónicas del canal.

### 3. Requisitos Técnicos Estrictos
- **Stack:** Código puro (HTML5 semántico, CSS3 moderno con Custom Properties, Grid/Flexbox y JavaScript Vanilla ES6+). Cero frameworks externos.
- **Arquitectura de archivos (sin CSS ni JS inline en el HTML):**
  - `index.html`
  - `css/styles.css`
  - `js/main.js`
  - `README.md` (con instrucciones claras para desplegar en GitHub Pages y dónde cambiar los enlaces/datos).
- **Rendimiento:** >95 en PageSpeed, 100% responsive (Mobile-First) y meta tags OpenGraph.

### 4. Secciones y Funcionalidades
1. **Navbar estilo HUD / Postal:** Logo/Nick a la izquierda con tipografía display, enlaces limpios de navegación al centro y un badge dinámico de estado a la derecha (`● ON AIR // EN DIRECTO` en rosa coral pulsante o `○ OFF AIR // PRÓXIMO STREAM`, configurable mediante una variable `IS_LIVE = true/false` al inicio de `main.js`).
2. **Hero Cinematográfico Asimétrico:**
   - Titular gigante con efecto de atardecer, breve bio con actitud y botones de acción principales (Twitch y Discord) con hover estilo desplazamiento táctil y sombra sólida.
   - Espacio lateral enmarcado tipo póster promocional (con silueta/placeholder elegante y etiquetas estilo ficha de personaje) + cinta *marquee* inferior animada.
3. **Hub de Canales y Redes ("RED DE TRANSMISIÓN / NETWORK"):**
   - Una sección tipo Bento Grid táctico diseñada específicamente para albergar las **8 plataformas** con claridad visual y sin amontonarlas:
     - Tarjetas destacadas para **Twitch**, **YouTube Principal** y **YouTube Secundario** (diferenciando claramente el canal principal del secundario/clips/VODs con etiquetas tipo `MAIN` y `SEC // EXTRA`).
     - Bloque conectado para **TikTok Principal** y **TikTok Secundario** (con etiquetas `MAIN` y `ALT / CLIPS`).
     - Accesos directos estilizados para **Instagram**, **X (Twitter)** y **Discord**.
   - Cada tarjeta debe incluir su icono SVG limpio, el @usuario editable, una micro-descripción del tipo de contenido que se sube ahí y efecto hover con color de acento.
4. **Módulo Reproductor ("EN PANTALLA"):**
   - Reproductor 16:9 con marco estilizado y pestañas funcionales en JS para alternar entre el directo de **Twitch**, el último vídeo de **YouTube Principal** y el último vídeo de **YouTube Secundario**.
5. **Archivo de Clips & Vídeos Destacados:**
   - Cuadrícula asimétrica (1 tarjeta grande destacada + 2 o 3 secundarias) con efecto zoom suave al pasar el ratón, duración del clip y etiquetas de categoría.
6. **Horario Semanal (Schedule):**
   - Diseño tipo cartelera/itinerario de Lunes a Domingo con tipografía monoespaciada. JavaScript debe detectar el día actual automáticamente y resaltarlo con un badge `HOY // LIVE`.
7. **Zona de Marcas & Colaboraciones (Business):**
   - Bloque diseñado para sponsors con 3 métricas grandes (Seguidores totales, Media de Viewers, Alcance mensual) y un botón interactivo que copia el correo de contacto al portapapeles cambiando su texto a `¡CORREO COPIADO!` durante 2 segundos.
8. **Footer:** Enlaces rápidos a las 8 redes con iconos SVG limpios y créditos minimalistas.

Entrega el código completo de cada archivo por separado (`index.html`, `css/styles.css`, `js/main.js` y `README.md`), cuidando al máximo el CSS y las transiciones sin resumir ninguna parte del código.
