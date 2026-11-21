'use client';

import { useEffect, useState } from 'react';
import { TWITCH_CHANNEL } from '@/lib/site-config';

const TABS = [
  { target: 'twitch', label: 'TWITCH // DIRECTO' },
  { target: 'yt-main', label: 'YOUTUBE // MAIN' },
  { target: 'yt-sec', label: 'YOUTUBE // DOS' },
] as const;

export default function PlayerSection() {
  const [active, setActive] = useState<(typeof TABS)[number]['target']>('twitch');
  const [twitchSrc, setTwitchSrc] = useState('');

  useEffect(() => {
    const parent = window.location.hostname || 'localhost';
    setTwitchSrc(`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${parent}&muted=true`);
  }, []);

  return (
    <section className="player" id="player">
      <div className="section-head">
        <p className="section-head__tag">{'// 02'}</p>
        <h2 className="section-head__title">
          EN PANTALLA <span>{'// LIVE FEED'}</span>
        </h2>
      </div>

      <div className="player__panel">
        <div className="player__tabs" role="tablist" aria-label="Seleccionar fuente de vídeo">
          {TABS.map((tab) => (
            <button
              key={tab.target}
              className={`player__tab${active === tab.target ? ' is-active' : ''}`}
              role="tab"
              aria-selected={active === tab.target}
              onClick={() => setActive(tab.target)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="player__frame">
          <div className={`player__screen${active === 'twitch' ? ' is-active' : ''}`}>
            <iframe src={twitchSrc} title="Directo de Twitch" allowFullScreen loading="lazy" />
          </div>
          <div className={`player__screen${active === 'yt-main' ? ' is-active' : ''}`}>
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=UUhFPZK4WwDzGYlwZylrp5dg"
              title="Último vídeo del canal principal"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <div className={`player__screen${active === 'yt-sec' ? ' is-active' : ''}`}>
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=UUSs-U38Ki44q7WVyLLY8r7g"
              title="Último vídeo del canal secundario"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
