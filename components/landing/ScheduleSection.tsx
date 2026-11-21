'use client';

import { useEffect, useState } from 'react';

const DAYS = [
  { day: 1, label: 'LUNES' },
  { day: 2, label: 'MARTES' },
  { day: 3, label: 'MIÉRCOLES' },
  { day: 4, label: 'JUEVES' },
  { day: 5, label: 'VIERNES' },
  { day: 6, label: 'SÁBADO' },
  { day: 0, label: 'DOMINGO' },
];

export default function ScheduleSection() {
  const [todayIndex, setTodayIndex] = useState<number | null>(null);

  useEffect(() => {
    setTodayIndex(new Date().getDay());
  }, []);

  return (
    <section className="schedule" id="schedule">
      <div className="section-head">
        <p className="section-head__tag">{'// 04'}</p>
        <h2 className="section-head__title">
          HORARIO SEMANAL <span>{'// ITINERARIO'}</span>
        </h2>
      </div>

      <ol className="schedule__list">
        {DAYS.map(({ day, label }) => (
          <li key={day} className={`schedule__row${todayIndex === day ? ' is-today' : ''}`}>
            <span className="schedule__day">{label}</span>
            <span className="schedule__info">17:00 (ESP) — Directo</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
