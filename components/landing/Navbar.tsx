'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IS_LIVE } from '@/lib/site-config';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link href="#top" className="navbar__logo">
          POPORROYO<span className="navbar__logo-dot">.</span>
        </Link>

        <nav className={`navbar__nav${isOpen ? ' is-open' : ''}`} aria-label="Navegación principal" style={isOpen ? { display: 'flex' } : undefined}>
          <a href="#network">Red</a>
          <a href="#player">En Pantalla</a>
          <a href="#clips">Clips</a>
          <a href="#schedule">Horario</a>
          <a href="#business">Negocios</a>
          <Link href="/ruleta" className="navbar__nav-highlight">
            Ruleta
          </Link>
        </nav>

        <div className="navbar__status" data-live={String(IS_LIVE)}>
          <span className="navbar__status-dot"></span>
          <span className="navbar__status-text">
            {IS_LIVE ? '● ON AIR // EN DIRECTO' : '○ OFF AIR // PRÓXIMO STREAM'}
          </span>
        </div>

        <button
          className="navbar__burger"
          aria-label="Abrir menú"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
