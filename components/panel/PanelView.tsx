'use client';

import { useEffect, useState } from 'react';

type Prize = { id: string; label: string; weight: number; color: string; active: boolean; show_on_landing: boolean };
type Reward = { id: string; title: string; cost: number };

type Status = {
  broadcasterLogin?: string;
  rewardId?: string | null;
  rewardTitle?: string | null;
  eventsubConnected: boolean;
  prizes: Prize[];
};

export default function PanelView() {
  const [status, setStatus] = useState<Status | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [newRewardTitle, setNewRewardTitle] = useState('Girar la ruleta');
  const [newRewardCost, setNewRewardCost] = useState(500);
  const [newPrizeLabel, setNewPrizeLabel] = useState('');
  const [newPrizeWeight, setNewPrizeWeight] = useState(10);
  const [newPrizeShowOnLanding, setNewPrizeShowOnLanding] = useState(false);

  async function loadStatus() {
    const res = await fetch('/api/panel/status');
    if (res.status === 401) {
      setUnauthorized(true);
      return;
    }
    setStatus(await res.json());
  }

  async function loadRewards() {
    const res = await fetch('/api/panel/rewards');
    if (res.ok) {
      const data = await res.json();
      setRewards(data.rewards);
    }
  }

  useEffect(() => {
    loadStatus().then(() => loadRewards());
  }, []);

  async function linkReward(body: Record<string, unknown>) {
    const res = await fetch('/api/panel/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setMessage(res.ok ? { text: 'Recompensa vinculada correctamente.', isError: false } : { text: data.error, isError: true });
    if (res.ok) loadStatus();
  }

  async function addPrize() {
    if (!newPrizeLabel.trim()) return;
    const res = await fetch('/api/panel/prizes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: newPrizeLabel, weight: newPrizeWeight, show_on_landing: newPrizeShowOnLanding }),
    });
    if (res.ok) {
      setNewPrizeLabel('');
      setNewPrizeShowOnLanding(false);
      loadStatus();
    }
  }

  async function updatePrize(prize: Prize, patch: Partial<Prize>) {
    await fetch('/api/panel/prizes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: prize.id, ...patch }),
    });
    loadStatus();
  }

  async function deletePrize(id: string) {
    await fetch(`/api/panel/prizes?id=${id}`, { method: 'DELETE' });
    loadStatus();
  }

  if (unauthorized) {
    return (
      <div className="panel">
        <div className="panel__card">
          <h2>Panel del streamer</h2>
          <p>Inicia sesión con la cuenta de Twitch del canal para gestionar la recompensa y los premios de la ruleta.</p>
          <a className="btn btn--primary" href="/api/auth/streamer/login">
            <span>AUTORIZAR CON TWITCH</span>
          </a>
        </div>
      </div>
    );
  }

  if (!status) return <p className="ruleta__state">Cargando...</p>;

  return (
    <div className="panel">
      <div className="panel__card">
        <h2>Canal vinculado</h2>
        <p>
          Conectado como <strong>{status.broadcasterLogin}</strong>. EventSub:{' '}
          <span className="panel__status">{status.eventsubConnected ? 'conectado' : 'pendiente de vincular recompensa'}</span>
        </p>
      </div>

      <div className="panel__card">
        <h2>Recompensa de puntos de canal</h2>
        {status.rewardTitle && <p>Recompensa activa: {status.rewardTitle}</p>}

        {rewards.length > 0 && (
          <div className="panel__field">
            <label>Elegir una recompensa ya creada por esta app</label>
            <select
              defaultValue=""
              onChange={(e) => {
                const reward = rewards.find((r) => r.id === e.target.value);
                if (reward) linkReward({ action: 'select', rewardId: reward.id, rewardTitle: reward.title });
              }}
            >
              <option value="" disabled>
                Selecciona una recompensa
              </option>
              {rewards.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} ({r.cost} puntos)
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="panel__field">
          <label>O crear una recompensa nueva</label>
          <input value={newRewardTitle} onChange={(e) => setNewRewardTitle(e.target.value)} placeholder="Título" />
          <input
            type="number"
            value={newRewardCost}
            onChange={(e) => setNewRewardCost(Number(e.target.value))}
            placeholder="Coste en puntos"
          />
          <button className="btn btn--ghost" onClick={() => linkReward({ action: 'create', title: newRewardTitle, cost: newRewardCost })}>
            <span>CREAR Y VINCULAR</span>
          </button>
        </div>

        {message && <p className={message.isError ? 'panel__status panel__status--error' : 'panel__status'}>{message.text}</p>}
      </div>

      <div className="panel__card">
        <h2>Premios de la ruleta</h2>
        <p className="panel__hint">
          Marca &quot;En portada&quot; en los premios que requieran contacto (p. ej. una camiseta física): quien lo gane
          aparecerá en la sección de ganadores de la página principal.
        </p>

        {status.prizes.map((prize) => (
          <div key={prize.id} className="panel__prize-row">
            <input defaultValue={prize.label} onBlur={(e) => updatePrize(prize, { label: e.target.value })} />
            <input
              type="number"
              defaultValue={prize.weight}
              onBlur={(e) => updatePrize(prize, { weight: Number(e.target.value) })}
            />
            <input type="color" defaultValue={prize.color} onBlur={(e) => updatePrize(prize, { color: e.target.value })} />
            <label className="panel__checkbox">
              <input
                type="checkbox"
                defaultChecked={prize.show_on_landing}
                onChange={(e) => updatePrize(prize, { show_on_landing: e.target.checked })}
              />
              En portada
            </label>
            <button className="btn btn--ghost" onClick={() => deletePrize(prize.id)}>
              <span>Eliminar</span>
            </button>
          </div>
        ))}

        <div className="panel__prize-row">
          <input value={newPrizeLabel} onChange={(e) => setNewPrizeLabel(e.target.value)} placeholder="Nombre del premio" />
          <input type="number" value={newPrizeWeight} onChange={(e) => setNewPrizeWeight(Number(e.target.value))} placeholder="Peso" />
          <span />
          <label className="panel__checkbox">
            <input
              type="checkbox"
              checked={newPrizeShowOnLanding}
              onChange={(e) => setNewPrizeShowOnLanding(e.target.checked)}
            />
            En portada
          </label>
          <button className="btn btn--primary" onClick={addPrize}>
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
