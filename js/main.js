/* ===========================================================
   POPORROYO — main.js
   =========================================================== */

/* Cambia a `true` cuando estés en directo. */
const IS_LIVE = false;

/* Canal de Twitch usado para el embed del reproductor. */
const TWITCH_CHANNEL = 'poporroyo_';

/*
 * Clave de la API de YouTube Data v3 (gratuita).
 * Cómo conseguirla: Google Cloud Console → crea un proyecto → habilita
 * "YouTube Data API v3" → Credenciales → crear API Key → restríngela
 * por "Referrer HTTP" a tu dominio (p. ej. unaiindurain.github.io/*).
 * Mientras esté vacía, el bloque de suscriptores se queda en "—".
 */
const YOUTUBE_API_KEY = 'AIzaSyA_lCO-MtjsHDcP51JHR1xGiD23jLrSBFo';
const YOUTUBE_CHANNEL_IDS = [
  'UChFPZK4WwDzGYlwZylrp5dg', // @poporroyo
  'UCSs-U38Ki44q7WVyLLY8r7g', // @PoporroyoDos
];

/* Código de invitación de Discord (lo que va después de discord.gg/). No necesita API key. */
const DISCORD_INVITE_CODE = '9NjHJTBdT';

document.addEventListener('DOMContentLoaded', () => {
  setLiveBadge();
  setTwitchEmbed();
  initPlayerTabs();
  highlightToday();
  initCopyEmail();
  initBurgerMenu();
  loadYoutubeStat();
  loadDiscordStat();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- 1. Badge ON AIR / OFF AIR ---------- */
function setLiveBadge() {
  const badge = document.getElementById('liveBadge');
  if (!badge) return;

  const text = badge.querySelector('.navbar__status-text');
  badge.dataset.live = String(IS_LIVE);

  text.textContent = IS_LIVE
    ? '● ON AIR // EN DIRECTO'
    : '○ OFF AIR // PRÓXIMO STREAM';
}

/* ---------- 2. Embed de Twitch (parent dinámico) ---------- */
function setTwitchEmbed() {
  const frame = document.getElementById('twitchFrame');
  if (!frame) return;

  const parent = location.hostname || 'localhost';
  frame.src = `https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&muted=true`;
}

/* ---------- 3. Pestañas del reproductor ---------- */
function initPlayerTabs() {
  const tabs = document.querySelectorAll('.player__tab');
  const screens = document.querySelectorAll('.player__screen');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      screens.forEach((screen) => {
        screen.classList.toggle('is-active', screen.dataset.screen === target);
      });
    });
  });
}

/* ---------- 4. Resaltar el día actual en el horario ---------- */
function highlightToday() {
  const todayIndex = new Date().getDay(); // 0 = domingo ... 6 = sábado
  const rows = document.querySelectorAll('.schedule__row');

  rows.forEach((row) => {
    if (Number(row.dataset.day) === todayIndex) {
      row.classList.add('is-today');
    }
  });
}

/* ---------- 5. Copiar correo al portapapeles ---------- */
function initCopyEmail() {
  const btn = document.getElementById('copyEmailBtn');
  if (!btn) return;

  const label = btn.querySelector('span');
  const originalText = label.textContent;
  const email = btn.dataset.email;

  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch (err) {
      const fallback = document.createElement('textarea');
      fallback.value = email;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      fallback.remove();
    }

    label.textContent = '¡CORREO COPIADO!';
    btn.classList.add('is-copied');

    setTimeout(() => {
      label.textContent = originalText;
      btn.classList.remove('is-copied');
    }, 2000);
  });
}

/* ---------- 6. Estadísticas en vivo (YouTube + Discord) ---------- */
function formatCompactNumber(value) {
  return new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

async function loadYoutubeStat() {
  const valueEl = document.getElementById('statYoutube');
  const sourceEl = document.getElementById('statYoutubeSource');
  if (!valueEl) return;

  if (!YOUTUBE_API_KEY) {
    sourceEl.textContent = 'Configura YOUTUBE_API_KEY';
    return;
  }

  try {
    const ids = YOUTUBE_CHANNEL_IDS.join(',');
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ids}&key=${YOUTUBE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`YouTube API ${res.status}`);

    const data = await res.json();
    const total = data.items.reduce((sum, item) => sum + Number(item.statistics.subscriberCount || 0), 0);

    valueEl.textContent = formatCompactNumber(total);
    sourceEl.textContent = '● En vivo // YouTube API';
  } catch (err) {
    console.warn('No se pudo cargar el nº de suscriptores de YouTube:', err);
    sourceEl.textContent = 'Sin conexión con la API';
  }
}

async function loadDiscordStat() {
  const valueEl = document.getElementById('statDiscord');
  const sourceEl = document.getElementById('statDiscordSource');
  if (!valueEl) return;

  try {
    const url = `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Discord API ${res.status}`);

    const data = await res.json();
    valueEl.textContent = formatCompactNumber(data.approximate_member_count);
    sourceEl.textContent = '● En vivo // Discord';
  } catch (err) {
    console.warn('No se pudo cargar el nº de miembros de Discord:', err);
    sourceEl.textContent = 'Sin conexión con Discord';
  }
}

/* ---------- 7. Menú hamburguesa (mobile) ---------- */
function initBurgerMenu() {
  const burger = document.getElementById('burgerBtn');
  const nav = document.querySelector('.navbar__nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    nav.style.display = isOpen ? 'flex' : '';
  });
}
