'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface StrikeRow {
  strike: number; callOI: number; putOI: number;
  callChng: number; putChng: number; callLTP: number; putLTP: number;
}
interface NSEData {
  symbol: string; underlyingValue: number; timestamp: string;
  nearestExpiry: string; maxPainStrike: number;
  totalCallOI: number; totalPutOI: number; pcr: number;
  strikeData: StrikeRow[];
}

const SYMBOLS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];
const fmtOI = (n: number) => n >= 100_000 ? (n / 100_000).toFixed(2) + 'L' : n >= 1_000 ? (n / 1_000).toFixed(1) + 'K' : String(n);
const fmtN = (n: number) => n.toLocaleString('en-IN');

export default function MaxPainPage() {
  const [symbol, setSymbol] = useState('NIFTY');
  const [data, setData] = useState<NSEData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchData = useCallback(async (sym: string) => {
    setLoading(true); setError('');
    try {
      const res = await fetch(`/api/nse?symbol=${sym}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
      setLastFetched(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(symbol); }, [symbol, fetchData]);

  // Sort by distance from ATM, take 20 strikes nearest to underlying
  const atm = data?.underlyingValue ?? 0;
  const nearStrikes = data
    ? [...data.strikeData]
        .sort((a, b) => Math.abs(a.strike - atm) - Math.abs(b.strike - atm))
        .slice(0, 20)
        .sort((a, b) => b.strike - a.strike)
    : [];

  const maxOI = nearStrikes.reduce((m, r) => Math.max(m, r.callOI, r.putOI), 1);
  const dist = data ? data.underlyingValue - data.maxPainStrike : 0;
  const distAbs = Math.abs(dist);

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>Max Pain Calculator</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/pcr" style={{ color: '#00C076', fontSize: 13, textDecoration: 'none' }}>PCR Tracker</Link>
          <Link href="/brokerage-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Brokerage</Link>
          <Link href="/events" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Events</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>NIFTY Max Pain Calculator</h1>
            <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
              Live option chain data from NSE. Max pain = the level where option buyers lose the most at expiry.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* Symbol selector */}
            <div style={{ display: 'flex', gap: 6 }}>
              {SYMBOLS.map(s => (
                <button key={s} onClick={() => setSymbol(s)} style={{
                  padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: symbol === s ? 'rgba(0,192,118,0.15)' : '#161b22',
                  color: symbol === s ? '#00C076' : '#8b949e',
                  border: `1px solid ${symbol === s ? 'rgba(0,192,118,0.4)' : '#30363d'}`,
                }}>{s}</button>
              ))}
            </div>
            <button onClick={() => fetchData(symbol)} disabled={loading} style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
              background: '#161b22', color: loading ? '#8b949e' : '#e6edf3', border: '1px solid #30363d',
            }}>
              {loading ? '⟳ Loading...' : '↻ Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ color: '#f85149', fontWeight: 600, marginBottom: 4 }}>Unable to load live data</div>
            <div style={{ color: '#8b949e', fontSize: 14 }}>{error}</div>
            <div style={{ color: '#8b949e', fontSize: 13, marginTop: 8 }}>NSE sometimes blocks automated requests. Try refreshing in a few seconds.</div>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Key metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: `${symbol} Spot`, value: fmtN(data.underlyingValue), color: '#e6edf3', sub: 'Current price' },
                { label: 'Max Pain', value: fmtN(data.maxPainStrike), color: '#f0883e', sub: 'Expiry gravity level' },
                { label: 'Distance', value: `${distAbs} pts`, color: dist > 0 ? '#f85149' : '#00C076', sub: dist > 0 ? '↓ Market above max pain' : '↑ Market below max pain' },
                { label: 'Expiry', value: data.nearestExpiry, color: '#8b949e', sub: 'Current expiry' },
              ].map(({ label, value, color, sub }) => (
                <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#8b949e', marginTop: 4 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* What max pain means */}
            <div style={{ background: 'rgba(240,136,62,0.06)', border: '1px solid rgba(240,136,62,0.2)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <span style={{ fontSize: 14, color: '#f0883e', fontWeight: 600 }}>Max Pain: </span>
              <span style={{ fontSize: 14, color: '#8b949e' }}>
                {symbol} is trading at <strong style={{ color: '#e6edf3' }}>{fmtN(data.underlyingValue)}</strong>.
                Max pain is <strong style={{ color: '#f0883e' }}>{fmtN(data.maxPainStrike)}</strong> —{' '}
                {distAbs} points {dist > 0 ? 'below' : 'above'} current price.
                In ~60–65% of expiries, {symbol} closes near this level. This is not a guarantee — it is a probability-weighted anchor.
              </span>
            </div>

            {/* OI Visualization */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #21262d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Open Interest by Strike</span>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#8b949e' }}>
                  <span><span style={{ color: '#f85149' }}>■</span> Call OI</span>
                  <span><span style={{ color: '#00C076' }}>■</span> Put OI</span>
                  <span><span style={{ color: '#f0883e' }}>●</span> Max Pain</span>
                </div>
              </div>
              <div style={{ padding: '8px 0' }}>
                {nearStrikes.map(row => {
                  const isMaxPain = row.strike === data.maxPainStrike;
                  const isATM = Math.abs(row.strike - atm) < 50;
                  const callWidth = (row.callOI / maxOI) * 100;
                  const putWidth  = (row.putOI  / maxOI) * 100;
                  return (
                    <div key={row.strike} style={{
                      display: 'grid', gridTemplateColumns: '1fr 80px 1fr',
                      alignItems: 'center', padding: '5px 20px',
                      background: isMaxPain ? 'rgba(240,136,62,0.08)' : isATM ? 'rgba(88,166,255,0.04)' : 'transparent',
                      borderLeft: isMaxPain ? '3px solid #f0883e' : '3px solid transparent',
                    }}>
                      {/* Call bar (right-aligned) */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: '#8b949e', minWidth: 40, textAlign: 'right' }}>{fmtOI(row.callOI)}</span>
                        <div style={{ width: `${callWidth}%`, maxWidth: '100%', height: 16, background: 'rgba(248,81,73,0.5)', borderRadius: '4px 0 0 4px', minWidth: callWidth > 0 ? 2 : 0 }} />
                      </div>

                      {/* Strike */}
                      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: isMaxPain ? 700 : 500, color: isMaxPain ? '#f0883e' : isATM ? '#58a6ff' : '#e6edf3' }}>
                        {isMaxPain && <span style={{ fontSize: 9, display: 'block', color: '#f0883e' }}>MAX PAIN</span>}
                        {isATM && !isMaxPain && <span style={{ fontSize: 9, display: 'block', color: '#58a6ff' }}>ATM</span>}
                        {row.strike.toLocaleString('en-IN')}
                      </div>

                      {/* Put bar (left-aligned) */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: `${putWidth}%`, maxWidth: '100%', height: 16, background: 'rgba(0,192,118,0.5)', borderRadius: '0 4px 4px 0', minWidth: putWidth > 0 ? 2 : 0 }} />
                        <span style={{ fontSize: 11, color: '#8b949e', minWidth: 40 }}>{fmtOI(row.putOI)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top OI table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              {/* Top Call OI = resistance */}
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262d', background: 'rgba(248,81,73,0.06)' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#f85149' }}>🔴 Top Call OI — Resistance</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0D1117' }}>
                    <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Strike</th>
                    <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>OI</th>
                    <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Chng</th>
                  </tr></thead>
                  <tbody>
                    {[...data.strikeData]
                      .filter(r => r.strike >= atm)
                      .sort((a, b) => b.callOI - a.callOI)
                      .slice(0, 5)
                      .map(r => (
                        <tr key={r.strike} style={{ borderBottom: '1px solid #21262d' }}>
                          <td style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500 }}>{fmtN(r.strike)}</td>
                          <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 13 }}>{fmtOI(r.callOI)}</td>
                          <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 12, color: r.callChng >= 0 ? '#00C076' : '#f85149' }}>
                            {r.callChng >= 0 ? '+' : ''}{fmtOI(r.callChng)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Top Put OI = support */}
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262d', background: 'rgba(0,192,118,0.06)' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#00C076' }}>🟢 Top Put OI — Support</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#0D1117' }}>
                    <th style={{ padding: '8px 16px', textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Strike</th>
                    <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>OI</th>
                    <th style={{ padding: '8px 16px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Chng</th>
                  </tr></thead>
                  <tbody>
                    {[...data.strikeData]
                      .filter(r => r.strike <= atm)
                      .sort((a, b) => b.putOI - a.putOI)
                      .slice(0, 5)
                      .map(r => (
                        <tr key={r.strike} style={{ borderBottom: '1px solid #21262d' }}>
                          <td style={{ padding: '9px 16px', fontSize: 13, fontWeight: 500 }}>{fmtN(r.strike)}</td>
                          <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 13 }}>{fmtOI(r.putOI)}</td>
                          <td style={{ padding: '9px 16px', textAlign: 'right', fontSize: 12, color: r.putChng >= 0 ? '#00C076' : '#f85149' }}>
                            {r.putChng >= 0 ? '+' : ''}{fmtOI(r.putChng)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Timestamp */}
            <div style={{ fontSize: 12, color: '#8b949e', textAlign: 'center' }}>
              NSE data as of: {data.timestamp} · Fetched: {lastFetched?.toLocaleTimeString('en-IN')} · Refreshes every 3 min
            </div>
          </>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8b949e' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
            <div>Fetching live data from NSE...</div>
          </div>
        )}

        <div style={{ marginTop: 32, background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.7 }}>
            <strong style={{ color: '#00C076' }}>How to use max pain:</strong> Check it on Monday for context, and again on Wednesday evening.
            When {symbol} is significantly above max pain heading into Thursday, there is gravitational pull downward — option writers will defend.
            When below max pain, there is pull upward. It is a probability tool, not a certainty.
            Combine with PCR and top OI strikes for your complete pre-trade picture.
            Practice acting on this data on <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
