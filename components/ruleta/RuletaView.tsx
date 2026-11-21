'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Wheel, { type WheelPrize } from '@/components/ruleta/Wheel';

type MeResponse =
  | { authenticated: false }
  | {
      authenticated: true;
      user: { twitch_login: string; display_name: string; avatar_url: string | null };
      hasPendingSpin: boolean;
      history: { prize: string; usedAt: string }[];
    };

type UiState = 'loading' | 'logged-out' | 'no-spin' | 'ready' | 'spinning' | 'result';

export default function RuletaView() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [prizes, setPrizes] = useState<WheelPrize[]>([]);
  const [uiState, setUiState] = useState<UiState>('loading');
  const [targetPrizeId, setTargetPrizeId] = useState<string | null>(null);
  const [resultLabel, setResultLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMe = useCallback(async () => {
    const res = await fetch('/api/me');
    const data: MeResponse = await res.json();
    setMe(data);

    if (!data.authenticated) {
      setUiState('logged-out');
    } else if (uiState !== 'spinning' && uiState !== 'result') {
      setUiState(data.hasPendingSpin ? 'ready' : 'no-spin');
    }
  }, [uiState]);

  useEffect(() => {
    fetch('/api/prizes')
      .then((res) => res.json())
      .then((data) => setPrizes(data.prizes));
  }, []);

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uiState === 'no-spin' || uiState === 'logged-out') {
      pollRef.current = setInterval(fetchMe, 8000);
      return () => {
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiState]);

  async function handleSpin() {
    setError(null);
    setUiState('spinning');

    const res = await fetch('/api/spin', { method: 'POST' });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'No se pudo girar la ruleta');
      setUiState('no-spin');
      return;
    }

    setResultLabel(data.prize.label);
    setTargetPrizeId(data.prize.id);
  }

  function handleSettled() {
    setUiState('result');
    fetchMe();
  }

  if (uiState === 'loading') {
    return <p className="ruleta__state">Cargando...</p>;
  }

  return (
    <div className="ruleta">
      {me?.authenticated && (
        <div className="ruleta__profile">
          {me.user.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.user.avatar_url} alt="" />
          )}
          <div>
            <strong>{me.user.display_name}</strong>
            <form action="/api/auth/viewer/logout" method="POST">
              <button type="submit" className="ruleta__logout">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      )}

      {uiState === 'logged-out' && (
        <div className="ruleta__state">
          <p>Inicia sesión con tu cuenta de Twitch para desbloquear tus tiradas de la ruleta.</p>
          <a className="btn btn--primary" href="/api/auth/viewer/login">
            <span>INICIAR SESIÓN CON TWITCH</span>
          </a>
        </div>
      )}

      <Wheel prizes={prizes} targetPrizeId={targetPrizeId} onSettled={handleSettled} />

      {uiState === 'no-spin' && (
        <div className="ruleta__state">
          <p>Todavía no tienes ninguna tirada disponible. Canjea la recompensa de puntos de canal en el chat de Twitch para desbloquear una.</p>
          {error && <p style={{ color: 'var(--sunset-pink)' }}>{error}</p>}
        </div>
      )}

      {uiState === 'ready' && (
        <div className="ruleta__state">
          <p>¡Tienes una tirada disponible!</p>
          <button className="btn btn--primary" onClick={handleSpin}>
            <span>GIRAR LA RULETA</span>
          </button>
        </div>
      )}

      {uiState === 'spinning' && (
        <div className="ruleta__state">
          <p>Girando...</p>
        </div>
      )}

      {uiState === 'result' && resultLabel && (
        <div className="ruleta__result">
          <p>Has ganado:</p>
          <p className="ruleta__result-prize">{resultLabel}</p>
        </div>
      )}

      {me?.authenticated && me.history.length > 0 && (
        <div className="ruleta__history">
          <h2>{'// Historial de tiradas'}</h2>
          {me.history.map((row, i) => (
            <div key={i} className="ruleta__history-row">
              <span>{row.prize}</span>
              <span>{new Date(row.usedAt).toLocaleDateString('es-ES')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
