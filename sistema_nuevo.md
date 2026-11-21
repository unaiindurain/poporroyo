Actúa como un desarrollador senior full-stack y especialista en integraciones con la API de Twitch y EventSub.

Estoy empezando desde cero una página web para un streamer donde los espectadores inician sesión con su cuenta de Twitch y, si canjean una recompensa personalizada de puntos de canal en el chat de Twitch, pueden desbloquear y tirar una ruleta interactiva en la web. Aún no tengo registrada la aplicación en Twitch Developer Console ni ninguna parte del sistema implementada.

### Contexto importante del sistema y roles
1. **Aplicación de Twitch:** La app se registrará en **mi** Twitch Developer Console (yo soy el desarrollador; el streamer no crea ninguna app ni me pasa claves privadas). Usaremos mi `Client ID` y `Client Secret` en el servidor.
2. **Dos flujos de autenticación / roles en Twitch:**
   - **Espectadores (viewers):** Inician sesión con su cuenta de Twitch para identificarse mediante su `user_id` y `login`.
   - **Streamer (dueño del canal):** Autoriza la aplicación mediante un flujo OAuth aparte con permisos para leer/gestionar recompensas de canal (`channel:read:redemptions` / `channel:manage:redemptions`), guardando su `access_token`, `refresh_token` y `broadcaster_user_id` en base de datos para operar sobre su canal.
3. **Gestión de recompensas:** Ten en cuenta que las recompensas personalizadas creadas vía API quedan ligadas al `Client ID` que las creó. Diseña la creación/vinculación de la recompensa de la ruleta desde el backend/panel de forma limpia y extensible.

### Qué quiero que diseñes y construyas paso a paso
1. **Guía inicial de configuración (Twitch Developer Console):**
   - Qué datos poner al registrar la app (nombre, categoría, OAuth Redirect URLs, permisos/scopes necesarios para viewers y para el streamer, y qué variables configurar en `.env`).
2. **Esquema de base de datos:**
   - Tabla/estructura de usuarios de la web (`twitch_user_id`, `twitch_login`, avatar, rol `viewer` o `streamer`).
   - Tabla/estructura para el canal del streamer (`broadcaster_user_id`, `access_token`, `refresh_token`, `reward_id` activo de la ruleta).
   - Tabla/estructura para **canjes y tiradas** (`redemption_id` único para evitar duplicados, `twitch_user_id`, estado de la tirada: `available` / `spinning` / `used` / `pending_claim`, premio obtenido y fechas).
3. **Flujo completo de autenticación, EventSub y ruleta segura:**
   - Login con Twitch para viewers y ruta separada de autorización para el streamer (incluyendo refresco de tokens).
   - Suscripción y recepción idempotente de `channel.channel_points_custom_reward_redemption.add` filtrando por el `reward.id` de la ruleta.
   - Sorteo del premio **siempre en el backend** (nunca en el frontend), con consumo atómico de la tirada para evitar recargas infinitas o trampas desde el navegador.
4. **Interfaz / Frontend de la ruleta:**
   - Vista de ruleta conectada al usuario autenticado con Twitch, con estados claros (sin tiradas, tirada disponible, tirando con animación sincronizada al premio devuelto por el servidor, premio ganado e historial).

### Instrucciones de trabajo
- Primero, **propón el stack más adecuado y rápido para arrancar esto desde cero** (indicando si prefieres algo con PHP/MySQL o Node/Next/etc. y por qué) y **dime qué archivos o estructura de carpetas vamos a crear**.
- Dame instrucciones claras y numeradas para registrar la app en Twitch Developer Console antes de tocar código.
- Entrega código completo, limpio y listo para probar, sin dejar huecos tipo `// TODO` en la lógica crítica de autenticación, canjes o sorteo.
