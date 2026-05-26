'use client';

import { useState } from 'react';
import Moneda from './Moneda';
import Temperatura from './Temperatura';
import './styles.css';

type Tab = 'moneda' | 'temperatura';

export default function Page() {
  const [tab, setTab] = useState<Tab>('moneda');

  return (
    <main className="main">
      <p className="app-eyebrow">Conversor inteligente</p>

      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'moneda' ? 'active' : ''}`}
          onClick={() => setTab('moneda')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v2m0 8v2M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5m0 1h.01" />
          </svg>
          Monedas
        </button>
        <button
          className={`tab-btn ${tab === 'temperatura' ? 'active' : ''}`}
          onClick={() => setTab('temperatura')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
          Temperatura
        </button>
      </div>

      <div>
        {tab === 'moneda' && <Moneda />}
        {tab === 'temperatura' && <Temperatura />}
      </div>
    </main>
  );
}