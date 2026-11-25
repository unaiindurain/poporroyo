'use client';

import { useEffect, useState } from 'react';

type DbUser = { twitch_user_id: string; twitch_login: string; display_name: string; avatar_url: string | null; created_at: string };
type DbStreamerChannel = {
  broadcaster_user_id: string;
  broadcaster_login: string;
  reward_id: string | null;
  reward_title: string | null;
  eventsub_sub_id: string | null;
  updated_at: string;
};
type DbPrize = { id: string; label: string; weight: number; color: string; active: boolean; position: number; show_on_landing: boolean };
type DbSpin = {
  id: string;
  redemption_id: string;
  twitch_user_id: string;
  reward_id: string;
  status: 'pending_claim' | 'used';
  prize_id: string | null;
  prize_label: string | null;
  redeemed_at: string;
  used_at: string | null;
};

type DbSnapshot = {
  generatedAt: string;
  users: DbUser[];
  streamerChannel: DbStreamerChannel[];
  prizes: DbPrize[];
  spins: DbSpin[];
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminDbView() {
  const [data, setData] = useState<DbSnapshot | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);

  async function load() {
    const res = await fetch('/api/admin/db');
    if (res.status === 401) {
      setUnauthorized(true);
      return;
    }
    setUnauthorized(false);
    setData(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  if (unauthorized) {
    return (
      <div className="panel">
        <div className="panel__card">
          <h2>Acceso restringido</h2>
          <p>Esta sección solo es visible para la cuenta de Twitch autorizada.</p>
          <a className="btn btn--primary" href="/api/auth/viewer/login?next=/admin/db">
            <span>INICIAR SESIÓN CON TWITCH</span>
          </a>
        </div>
      </div>
    );
  }

  if (!data) return <p className="ruleta__state">Cargando...</p>;

  return (
    <div className="admindb">
      <div className="admindb__head">
        <button className="btn btn--ghost" onClick={load}>
          <span>Actualizar</span>
        </button>
        <span className="admindb__generated">Datos al {fmtDate(data.generatedAt)}</span>
      </div>

      <section className="admindb__card">
        <header className="admindb__card-head">
          <h2>users</h2>
          <span className="admindb__count">{data.users.length} filas</span>
        </header>
        <div className="admindb__scroll">
          <table>
            <thead>
              <tr>
                <th>ID Twitch</th>
                <th>Login</th>
                <th>Nombre</th>
                <th>Creado</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((u) => (
                <tr key={u.twitch_user_id}>
                  <td className="admindb__mono">{u.twitch_user_id}</td>
                  <td>{u.twitch_login}</td>
                  <td>{u.display_name}</td>
                  <td>{fmtDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admindb__card">
        <header className="admindb__card-head">
          <h2>streamer_channel</h2>
          <span className="admindb__count">{data.streamerChannel.length} filas</span>
        </header>
        <div className="admindb__scroll">
          <table>
            <thead>
              <tr>
                <th>Canal</th>
                <th>Recompensa</th>
                <th>Reward ID</th>
                <th>EventSub</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              {data.streamerChannel.map((c) => (
                <tr key={c.broadcaster_user_id}>
                  <td>{c.broadcaster_login}</td>
                  <td>{c.reward_title ?? '—'}</td>
                  <td className="admindb__mono">{c.reward_id ?? '—'}</td>
                  <td>
                    <span className={`admindb__pill ${c.eventsub_sub_id ? 'admindb__pill--ok' : 'admindb__pill--off'}`}>
                      {c.eventsub_sub_id ? 'conectado' : 'pendiente'}
                    </span>
                  </td>
                  <td>{fmtDate(c.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admindb__card">
        <header className="admindb__card-head">
          <h2>prizes</h2>
          <span className="admindb__count">{data.prizes.length} filas</span>
        </header>
        <div className="admindb__scroll">
          <table>
            <thead>
              <tr>
                <th>Premio</th>
                <th>Peso</th>
                <th>Posición</th>
                <th>Activo</th>
                <th>En portada</th>
              </tr>
            </thead>
            <tbody>
              {data.prizes.map((p) => (
                <tr key={p.id}>
                  <td>
                    <span className="admindb__swatch" style={{ background: p.color }} />
                    {p.label}
                  </td>
                  <td>{p.weight}</td>
                  <td>{p.position}</td>
                  <td>
                    <span className={`admindb__pill ${p.active ? 'admindb__pill--ok' : 'admindb__pill--off'}`}>{p.active ? 'sí' : 'no'}</span>
                  </td>
                  <td>
                    <span className={`admindb__pill ${p.show_on_landing ? 'admindb__pill--ok' : 'admindb__pill--off'}`}>
                      {p.show_on_landing ? 'sí' : 'no'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admindb__card">
        <header className="admindb__card-head">
          <h2>spins</h2>
          <span className="admindb__count">{data.spins.length} filas</span>
        </header>
        <div className="admindb__scroll">
          <table>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Estado</th>
                <th>Premio</th>
                <th>Canjeado</th>
                <th>Usado</th>
              </tr>
            </thead>
            <tbody>
              {data.spins.map((s) => (
                <tr key={s.id}>
                  <td className="admindb__mono">{s.twitch_user_id}</td>
                  <td>
                    <span className={`admindb__pill ${s.status === 'used' ? 'admindb__pill--ok' : 'admindb__pill--warn'}`}>
                      {s.status === 'used' ? 'usado' : 'pendiente'}
                    </span>
                  </td>
                  <td>{s.prize_label ?? '—'}</td>
                  <td>{fmtDate(s.redeemed_at)}</td>
                  <td>{fmtDate(s.used_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
