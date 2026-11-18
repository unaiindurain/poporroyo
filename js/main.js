/* ===========================================================
   POPORROYO — main.js
   =========================================================== */

/* Cambia a `true` cuando estés en directo. */
const IS_LIVE = false;

/* Canal de Twitch usado para el embed del reproductor. */
const TWITCH_CHANNEL = 'poporroyo_';

document.addEventListener('DOMContentLoaded', () => {
  setLiveBadge();
  setTwitchEmbed();
  initPlayerTabs();
  highlightToday();
  initCopyEmail();
  initBurgerMenu();
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

/* ---------- 6. Menú hamburguesa (mobile) ---------- */
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
