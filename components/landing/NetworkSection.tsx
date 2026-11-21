export default function NetworkSection() {
  return (
    <section className="network" id="network">
      <div className="section-head">
        <p className="section-head__tag">{'// 01'}</p>
        <h2 className="section-head__title">
          RED DE TRANSMISIÓN <span>{'// NETWORK'}</span>
        </h2>
      </div>

      <div className="bento">
        <a
          className="bento__card bento__card--twitch bento__card--lg"
          href="https://www.twitch.tv/poporroyo_"
          target="_blank"
          rel="noopener"
        >
          <span className="bento__badge">MAIN</span>
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path d="M4 2 2 7v13h6v3l3-3h4l5-5V2H4Zm16 9-3 3h-4l-3 3v-3H6V4h14v7Z" fill="currentColor" />
            <path d="M15 7h2v5h-2V7Zm-5 0h2v5h-2V7Z" fill="currentColor" />
          </svg>
          <div className="bento__body">
            <h3>TWITCH</h3>
            <p className="bento__handle">@poporroyo_</p>
            <p className="bento__desc">Directos de GTA RP, variedad y charlas con la comunidad en tiempo real.</p>
          </div>
        </a>

        <a className="bento__card bento__card--youtube" href="https://www.youtube.com/@poporroyo" target="_blank" rel="noopener">
          <span className="bento__badge">MAIN</span>
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.5.4a3 3 0 0 0-2.1 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 15.2 22 12 22 12Z"
              fill="currentColor"
            />
            <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="#0D0914" />
          </svg>
          <div className="bento__body">
            <h3>YOUTUBE</h3>
            <p className="bento__handle">@poporroyo</p>
            <p className="bento__desc">Episodios completos, resúmenes de serie y contenido editado principal.</p>
          </div>
        </a>

        <a
          className="bento__card bento__card--youtube-alt"
          href="https://www.youtube.com/@PoporroyoDos"
          target="_blank"
          rel="noopener"
        >
          <span className="bento__badge bento__badge--alt">SEC // EXTRA</span>
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.5.4a3 3 0 0 0-2.1 2.1C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 15.2 22 12 22 12Z"
              fill="currentColor"
            />
            <path d="M10 9.5v5l4.5-2.5L10 9.5Z" fill="#0D0914" />
          </svg>
          <div className="bento__body">
            <h3>YOUTUBE DOS</h3>
            <p className="bento__handle">@PoporroyoDos</p>
            <p className="bento__desc">Clips, VODs y momentos destacados fuera del canal principal.</p>
          </div>
        </a>

        <a className="bento__card bento__card--tiktok" href="https://www.tiktok.com/@poporroyo_" target="_blank" rel="noopener">
          <span className="bento__badge">MAIN</span>
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.1-2.8V9.3a6.1 6.1 0 1 0 5.3 6V8.9a7.8 7.8 0 0 0 4.4 1.4V7.1a4.7 4.7 0 0 1-4.4-5.1Z"
              fill="currentColor"
            />
          </svg>
          <div className="bento__body">
            <h3>TIKTOK</h3>
            <p className="bento__handle">@poporroyo_</p>
            <p className="bento__desc">Shorts verticales, highlights rápidos y tendencias del momento.</p>
          </div>
        </a>

        <a
          className="bento__card bento__card--tiktok-alt"
          href="https://www.tiktok.com/@poporroyogoat"
          target="_blank"
          rel="noopener"
        >
          <span className="bento__badge bento__badge--alt">ALT / CLIPS</span>
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M16.6 2h-3.2v13.4a2.9 2.9 0 1 1-2.1-2.8V9.3a6.1 6.1 0 1 0 5.3 6V8.9a7.8 7.8 0 0 0 4.4 1.4V7.1a4.7 4.7 0 0 1-4.4-5.1Z"
              fill="currentColor"
            />
          </svg>
          <div className="bento__body">
            <h3>TIKTOK GOAT</h3>
            <p className="bento__handle">@poporroyogoat</p>
            <p className="bento__desc">Cuenta alternativa con clips extra y contenido de comunidad.</p>
          </div>
        </a>

        <a className="bento__card bento__card--ig" href="https://www.instagram.com/poporroyo/" target="_blank" rel="noopener">
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="12" cy="12" r="4.3" stroke="currentColor" strokeWidth="1.7" />
            <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
          <div className="bento__body">
            <h3>INSTAGRAM</h3>
            <p className="bento__handle">@poporroyo</p>
            <p className="bento__desc">Fotos, historias y detrás de cámaras del día a día.</p>
          </div>
        </a>

        <a className="bento__card bento__card--discord" href="https://discord.gg/9NjHJTBdT" target="_blank" rel="noopener">
          <svg className="bento__icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M18.9 6.4A15.9 15.9 0 0 0 15 5.1l-.2.4a13 13 0 0 1 3.5 1.3 14 14 0 0 0-12.6 0 13 13 0 0 1 3.5-1.3L9 5.1a15.9 15.9 0 0 0-3.9 1.3C2.8 9.6 2.1 12.7 2.4 15.8a14.6 14.6 0 0 0 4.5 2.3l.6-1a9.8 9.8 0 0 1-1.6-.8l.4-.3a11.6 11.6 0 0 0 10.4 0l.4.3a9.8 9.8 0 0 1-1.6.8l.6 1a14.6 14.6 0 0 0 4.5-2.3c.4-3.5-.6-6.6-1.7-9.4ZM9 13.8c-.8 0-1.4-.7-1.4-1.6S8.2 10.6 9 10.6s1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Zm6 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.5.7 1.4 1.6c0 .9-.6 1.6-1.4 1.6Z"
              fill="currentColor"
            />
          </svg>
          <div className="bento__body">
            <h3>DISCORD</h3>
            <p className="bento__handle">Comunidad Leonida</p>
            <p className="bento__desc">El punto de encuentro oficial: eventos, sorteos y charla 24/7.</p>
          </div>
        </a>
      </div>
    </section>
  );
}
