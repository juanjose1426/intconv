'use client';

import { useState } from 'react';

type Scale = 'C' | 'F' | 'K';

const SCALES: { value: Scale; label: string }[] = [
  { value: 'C', label: '°C — Celsius' },
  { value: 'F', label: '°F — Fahrenheit' },
  { value: 'K', label: 'K — Kelvin' },
];

function toCelsius(val: number, from: Scale): number {
  if (from === 'C') return val;
  if (from === 'F') return (val - 32) * 5 / 9;
  return val - 273.15;
}

function fromCelsius(celsius: number, to: Scale): number {
  if (to === 'C') return celsius;
  if (to === 'F') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

const UNIT_LABEL: Record<Scale, string> = { C: '°C', F: '°F', K: 'K' };

type AllTemps = { c: number; f: number; k: number } | null;

export default function Temperatura() {
  const [amount, setAmount] = useState('25');
  const [from, setFrom] = useState<Scale>('C');
  const [to, setTo] = useState<Scale>('F');
  const [result, setResult] = useState<string | null>(null);
  const [meta, setMeta] = useState<string | null>(null);
  const [allTemps, setAllTemps] = useState<AllTemps>(null);

  const convert = () => {
    const val = parseFloat(amount);
    if (isNaN(val)) {
      setResult('Ingresa un valor válido');
      setMeta(null);
      setAllTemps(null);
      return;
    }

    const celsius = toCelsius(val, from);
    const converted = fromCelsius(celsius, to);

    setResult(`${round2(converted).toLocaleString('es-CO')} ${UNIT_LABEL[to]}`);
    setMeta(
      `${round2(val).toLocaleString('es-CO')} ${UNIT_LABEL[from]} = ${round2(converted).toLocaleString('es-CO')} ${UNIT_LABEL[to]}`
    );
    setAllTemps({
      c: round2(celsius),
      f: round2(fromCelsius(celsius, 'F')),
      k: round2(fromCelsius(celsius, 'K')),
    });
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon coral">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
        </div>
        <div>
          <p className="panel-title">Conversor de temperatura</p>
          <p className="panel-sub">Celsius · Fahrenheit · Kelvin</p>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Valor y escala origen</label>
        <div className="field-row">
          <input
            type="number"
            className="input-mono"
            value={amount}
            placeholder="0"
            onChange={(e) => setAmount(e.target.value)}
          />
          <select className="select" value={from} onChange={(e) => setFrom(e.target.value as Scale)}>
            {SCALES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Escala destino</label>
        <div className="field-row">
          <select
            className="select"
            style={{ flex: 1 }}
            value={to}
            onChange={(e) => setTo(e.target.value as Scale)}
          >
            {SCALES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="convert-btn coral" onClick={convert}>
        Convertir
      </button>

      {result && (
        <div className="result-box">
          <p className="result-label">Resultado</p>
          <p className="result-value">{result}</p>
          {meta && <p className="result-meta">{meta}</p>}
        </div>
      )}

      {allTemps && (
        <>
          <div className="divider" />
          <p className="field-label" style={{ marginBottom: '10px' }}>Todas las escalas</p>
          <div className="temp-cards">
            <div className="temp-card temp-card--c">
              <span className="temp-card-val">{allTemps.c}°</span>
              <span className="temp-card-unit">Celsius</span>
            </div>
            <div className="temp-card temp-card--f">
              <span className="temp-card-val">{allTemps.f}°</span>
              <span className="temp-card-unit">Fahrenheit</span>
            </div>
            <div className="temp-card temp-card--k">
              <span className="temp-card-val">{allTemps.k}</span>
              <span className="temp-card-unit">Kelvin</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}