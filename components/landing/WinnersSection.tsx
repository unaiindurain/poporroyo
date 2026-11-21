import { getLandingWinners } from '@/lib/prizes';

export default async function WinnersSection() {
  const winners = await getLandingWinners();

  return (
    <section className="winners" id="ganadores">
      <div className="section-head">
        <p className="section-head__tag">{'// 05'}</p>
        <h2 className="section-head__title">
          GANADORES DE LA RULETA <span>{'// CAMISETA POPORROYO'}</span>
        </h2>
      </div>

      <div className="winners__panel">
        {winners.length === 0 ? (
          <p className="winners__empty">
            Todavía nadie ha ganado la camiseta en la ruleta de puntos de canal. ¡Sigue participando en directo!
          </p>
        ) : (
          <ul className="winners__list">
            {winners.map((winner, i) => (
              <li key={i} className="winners__row">
                {winner.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="winners__avatar" src={winner.avatarUrl} alt="" />
                ) : (
                  <span className="winners__avatar winners__avatar--placeholder" />
                )}
                <div className="winners__info">
                  <strong className="winners__name">{winner.displayName}</strong>
                  <span className="winners__handle">@{winner.twitchLogin}</span>
                </div>
                <div className="winners__meta">
                  <span className="winners__prize">{winner.prizeLabel}</span>
                  <span className="winners__date">{new Date(winner.wonAt).toLocaleDateString('es-ES')}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="winners__note">
          Si apareces aquí, contacta por Discord o Twitch con Poporroyo para que te haga llegar tu camiseta.
        </p>
      </div>
    </section>
  );
}
