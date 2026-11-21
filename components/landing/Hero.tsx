import { TWITCH_CHANNEL, DISCORD_INVITE_CODE } from '@/lib/site-config';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero__grid">
        <div className="hero__content">
          <p className="hero__tag">{'// LEONIDA BROADCAST NETWORK — CANAL 024'}</p>
          <h1 className="hero__title">
            POPO<span className="hero__title-accent">RROYO</span>
          </h1>
          <p className="hero__bio">Haciendo historia con todos vosotros.</p>

          <div className="hero__cta">
            <a className="btn btn--primary" href={`https://www.twitch.tv/${TWITCH_CHANNEL}`} target="_blank" rel="noopener">
              <span>VER DIRECTO EN TWITCH</span>
            </a>
            <a className="btn btn--ghost" href={`https://discord.gg/${DISCORD_INVITE_CODE}`} target="_blank" rel="noopener">
              <span>UNIRSE AL DISCORD</span>
            </a>
          </div>
        </div>

        <div className="hero__poster">
          <div className="poster-card">
            <div className="poster-card__header">
              <span>LEONIDA ID</span>
              <span>#024</span>
            </div>
            <div className="poster-card__figure" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/poporroyo.webp" alt="" className="poster-card__photo" loading="lazy" />
            </div>
            <div className="poster-card__footer">
              <span className="poster-card__label">POPORROYO</span>
              <span className="poster-card__coords">25.7617° N, 80.1918° W</span>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <span>
            HACIENDO HISTORIA CON TODOS VOSOTROS&nbsp;&nbsp;//&nbsp;&nbsp;POPORROYO&nbsp;&nbsp;//&nbsp;&nbsp;WELCOME TO
            LEONIDA&nbsp;&nbsp;//&nbsp;&nbsp;DIRECTOS CADA SEMANA&nbsp;&nbsp;//&nbsp;&nbsp;HACIENDO HISTORIA CON TODOS
            VOSOTROS&nbsp;&nbsp;//&nbsp;&nbsp;POPORROYO&nbsp;&nbsp;//&nbsp;&nbsp;WELCOME TO
            LEONIDA&nbsp;&nbsp;//&nbsp;&nbsp;DIRECTOS CADA SEMANA&nbsp;&nbsp;//&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
