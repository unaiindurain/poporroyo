'use client';

import { useEffect, useState } from 'react';
import { DISCORD_INVITE_CODE, YOUTUBE_API_KEY, YOUTUBE_CHANNEL_IDS } from '@/lib/site-config';

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('es-ES', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export default function BusinessSection() {
  const [youtubeValue, setYoutubeValue] = useState('—');
  const [youtubeSource, setYoutubeSource] = useState('');
  const [discordValue, setDiscordValue] = useState('—');
  const [discordSource, setDiscordSource] = useState('');
  const [copied, setCopied] = useState(false);

  const email = 'poporroyobisnes@gmail.com';

  useEffect(() => {
    if (!YOUTUBE_API_KEY) {
      setYoutubeSource('Configura YOUTUBE_API_KEY');
      return;
    }

    (async () => {
      try {
        const ids = YOUTUBE_CHANNEL_IDS.join(',');
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${ids}&key=${YOUTUBE_API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`YouTube API ${res.status}`);

        const data = await res.json();
        const total = data.items.reduce(
          (sum: number, item: { statistics: { subscriberCount?: string } }) =>
            sum + Number(item.statistics.subscriberCount || 0),
          0,
        );

        setYoutubeValue(formatCompactNumber(total));
        setYoutubeSource('● En vivo // YouTube API');
      } catch (err) {
        console.warn('No se pudo cargar el nº de suscriptores de YouTube:', err);
        setYoutubeSource('Sin conexión con la API');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const url = `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Discord API ${res.status}`);

        const data = await res.json();
        setDiscordValue(formatCompactNumber(data.approximate_member_count));
        setDiscordSource('● En vivo // Discord');
      } catch (err) {
        console.warn('No se pudo cargar el nº de miembros de Discord:', err);
        setDiscordSource('Sin conexión con Discord');
      }
    })();
  }, []);

  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const fallback = document.createElement('textarea');
      fallback.value = email;
      document.body.appendChild(fallback);
      fallback.select();
      document.execCommand('copy');
      fallback.remove();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="business" id="business">
      <div className="section-head">
        <p className="section-head__tag">{'// 05'}</p>
        <h2 className="section-head__title">
          MARCAS &amp; COLABORACIONES <span>{'// BUSINESS'}</span>
        </h2>
      </div>

      <div className="business__panel">
        <div className="business__stats">
          <div className="stat">
            <span className="stat__value">{youtubeValue}</span>
            <span className="stat__label">Suscriptores YouTube</span>
            <span className="stat__source">{youtubeSource}</span>
          </div>
          <div className="stat">
            <span className="stat__value">{discordValue}</span>
            <span className="stat__label">Miembros Discord</span>
            <span className="stat__source">{discordSource}</span>
          </div>
          <div className="stat">
            {/* Sin API pública: audiencia combinada de las 7 plataformas (Twitch 682 + YT principal 6.520 +
                YT secundario 4.080 + TikTok principal 1.132 + TikTok secundario 28.600 + Instagram 7.793 +
                Discord 375 = 49.182). Actualiza este número a mano cuando vuelvas a calcularlo. */}
            <span
              className="stat__value"
              title="Audiencia combinada: Twitch + YouTube (x2) + TikTok (x2) + Instagram + Discord"
            >
              49,2 mil
            </span>
            <span className="stat__label">Alcance Mensual</span>
            <span className="stat__source">Manual · Audiencia combinada</span>
          </div>
        </div>

        <div className="business__contact">
          <p>¿Tienes una propuesta de colaboración o patrocinio? Escríbeme directamente.</p>
          <button className={`btn btn--primary btn--copy${copied ? ' is-copied' : ''}`} onClick={handleCopyEmail}>
            <span>{copied ? '¡CORREO COPIADO!' : email}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
