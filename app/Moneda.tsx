'use client';

import { useState } from 'react';

const CURRENCIES = [
  { code: 'COP', flag: '🇨🇴', label: 'COP — Peso colombiano' },
  { code: 'USD', flag: '🇺🇸', label: 'USD — Dólar americano' },
  { code: 'EUR', flag: '🇪🇺', label: 'EUR — Euro' },
  { code: 'JPY', flag: '🇯🇵', label: 'JPY — Yen japonés' },
  { code: 'GBP', flag: '🇬🇧', label: 'GBP — Libra esterlina' },
  { code: 'BRL', flag: '🇧🇷', label: 'BRL — Real brasileño' },
  { code: 'MXN', flag: '🇲🇽', label: 'MXN — Peso mexicano' },
  { code: 'CAD', flag: '🇨🇦', label: 'CAD — Dólar canadiense' },
  { code: 'ARS', flag: '🇦🇷', label: 'ARS — Peso argentino' },
  { code: 'CNY', flag: '🇨🇳', label: 'CNY — Yuan chino' },
];

const QUICK_PAIRS = [
  { from: 'USD', to: 'COP' },
  { from: 'EUR', to: 'COP' },
  { from: 'COP', to: 'USD' },
  { from: 'JPY', to: 'USD' },
  { from: 'EUR', to: 'USD' },
  { from: 'GBP', to: 'EUR' },
];

type Result = {
  value: string;
  meta: string;
  error?: boolean;
};

export default function Moneda() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('COP');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const convert = async (overrideFrom?: string, overrideTo?: string) => {
    const f = overrideFrom ?? from;
    const t = overrideTo ?? to;
    const amt = parseFloat(amount);

    if (isNaN(amt) || amt <= 0) {
      setResult({ value: 'Ingresa una cantidad válida', meta: '', error: true });
      return;
    }

    if (f === t) {
      setResult({
        value: `${amt.toLocaleString('es-CO')} ${t}`,
        meta: 'Misma moneda',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          tools: [{ type: 'web_search_20250305', name: 'web_search' }],
          system:
            'You are a currency converter. Search for the current exchange rate and respond ONLY with a JSON object, no markdown, no explanation: {"result": <number>, "rate": <number>, "from": "<CODE>", "to": "<CODE>"}',
          messages: [
            { role: 'user', content: `Convert ${amt} ${f} to ${t}. Use current market rates.` },
          ],
        }),
      });

      const data = await resp.json();
      const textBlock = data.content?.find((b: { type: string }) => b.type === 'text');
      if (!textBlock) throw new Error('No response');

      const raw = textBlock.text.trim().replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(raw);

      const formatted = parsed.result.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });
      const rateFormatted = parsed.rate.toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      });

      setResult({
        value: `${formatted} ${t}`,
        meta: `1 ${f} = ${rateFormatted} ${t}`,
      });
    } catch {
      setResult({ value: 'Error al obtener la tasa', meta: 'Intenta nuevamente', error: true });
    } finally {
      setLoading(false);
    }
  };

  const handleQuick = (f: string, t: string) => {
    setFrom(f);
    setTo(t);
    convert(f, t);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-icon blue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </div>
        <div>
          <p className="panel-title">Conversor de divisas</p>
          <p className="panel-sub">Tasas en tiempo real</p>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Cantidad y moneda origen</label>
        <div className="field-row">
          <input
            type="number"
            className="input-mono"
            value={amount}
            min="0"
            placeholder="0.00"
            onChange={(e) => setAmount(e.target.value)}
          />
          <select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <button className="swap-btn" onClick={swap} title="Intercambiar">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4m4 4H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Moneda destino</label>
        <div className="field-row">
          <select className="select" style={{ flex: 1 }} value={to} onChange={(e) => setTo(e.target.value)}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.code} — {c.label.split('—')[1].trim()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Conversiones rápidas</label>
        <div className="quick-pills">
          {QUICK_PAIRS.map((p) => (
            <button
              key={`${p.from}-${p.to}`}
              className="pill"
              onClick={() => handleQuick(p.from, p.to)}
            >
              {p.from} → {p.to}
            </button>
          ))}
        </div>
      </div>

      <button
        className="convert-btn blue"
        onClick={() => convert()}
        disabled={loading}
      >
        {loading ? 'Convirtiendo...' : 'Convertir'}
      </button>

      {(result || loading) && (
        <div className={`result-box ${result?.error ? 'error' : ''}`}>
          <p className="result-label">Resultado</p>
          {loading ? (
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          ) : (
            <>
              <p className="result-value">{result?.value}</p>
              {result?.meta && <p className="result-meta">{result.meta}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}