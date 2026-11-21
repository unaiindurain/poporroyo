const CLIPS = [
  {
    href: 'https://www.youtube.com/shorts/dsDepAJNVoY',
    id: 'dsDepAJNVoY',
    category: 'CUPHEAD',
    views: '2,6 mil vistas',
    title: 'Vídeo entero en YouTube: Poporroyo',
    featured: true,
  },
  {
    href: 'https://www.youtube.com/shorts/ZDyBwEmJnZA',
    id: 'ZDyBwEmJnZA',
    category: 'HUMOR',
    views: '1,9 mil vistas',
    title: 'La mejor intro de la historia',
    featured: false,
  },
  {
    href: 'https://www.youtube.com/shorts/kk5Lob7Y0aA',
    id: 'kk5Lob7Y0aA',
    category: 'DIRECTO',
    views: '1,8 mil vistas',
    title: 'Stream histórico a las 7 y media',
    featured: false,
  },
  {
    href: 'https://www.youtube.com/shorts/1grGrEGng6Y',
    id: '1grGrEGng6Y',
    category: 'FNAF',
    views: '1,6 mil vistas',
    title: "Five Nights at Pedro Sánchez's",
    featured: false,
  },
];

export default function ClipsSection() {
  return (
    <section className="clips" id="clips">
      <div className="section-head">
        <p className="section-head__tag">{'// 03'}</p>
        <h2 className="section-head__title">
          ARCHIVO DE CLIPS <span>{'// DESTACADOS'}</span>
        </h2>
      </div>

      <div className="clips__grid">
        {CLIPS.map((clip) => (
          <a
            key={clip.id}
            className={`clip${clip.featured ? ' clip--featured' : ''}`}
            href={clip.href}
            target="_blank"
            rel="noopener"
          >
            <div className="clip__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${clip.id}/frame0.jpg`} alt="" loading="lazy" />
              <span className="clip__category">{clip.category}</span>
              <span className="clip__duration">{clip.views}</span>
            </div>
            <h3 className="clip__title">{clip.title}</h3>
            <p className="clip__meta">YouTube Shorts // @poporroyo</p>
          </a>
        ))}
      </div>
    </section>
  );
}
