'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface NSEData {
  symbol: string; underlyingValue: number; timestamp: string;
  nearestExpiry: string; pcr: number;
  totalCallOI: number; totalPutOI: number; maxPainStrike: number;
  strikeData: { strike: number; callOI: number; putOI: number; callChng: number; putChng: number }[];
}

const SYMBOLS = ['NIFTY', 'BANKNIFTY', 'FINNIFTY'];
const fmtOI = (n: number) => {
  if (n >= 10_000_000) return (n / 10_000_000).toFixed(2) + 'Cr';
  if (n >= 100_000)   return (n / 100_000).toFixed(2) + 'L';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return String(n);
};
const fmtN = (n: number) => n.toLocaleString('en-IN');

function getSentiment(pcr: number): { label: string; color: string; bg: string; desc: string; emoji: string } {
  if (pcr >= 1.4) return { label: 'Extremely Bearish (Contrarian Bullish)', color: '#f85149', bg: 'rgba(248,81,73,0.1)', desc: 'Too many puts — market may be oversold. Watch for reversal.', emoji: '🔴' };
  if (pcr >= 1.2) return { label: 'Bearish', color: '#f0883e', bg: 'rgba(240,136,62,0.1)', desc: 'More protective puts than calls. Institutions hedging downside.', emoji: '🟠' };
  if (pcr >= 0.8) return { label: 'Neutral', color: '#e6edf3', bg: 'rgba(139,148,158,0.1)', desc: 'Balanced positioning. No strong directional bias.', emoji: '⚪' };
  if (pcr >= 0.6) return { label: 'Bullish', color: '#00C076', bg: 'rgba(0,192,118,0.1)', desc: 'More calls than puts. Market leaning optimistic.', emoji: '🟢' };
  return { label: 'Extremely Bullish (Contrarian Bearish)', color: '#00C076', bg: 'rgba(0,192,118,0.1)', desc: 'Very few puts — market may be overconfident. Watch for pullback.', emoji: '🟢' };
}

export default function PCRPage() {
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

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const id = setInterval(() => fetchData(symbol), 3 * 60 * 1000);
    return () => clearInterval(id);
  }, [symbol, fetchData]);

  const sentiment = data ? getSentiment(data.pcr) : null;
  const totalOI = data ? data.totalCallOI + data.totalPutOI : 0;
  const callPct = totalOI > 0 ? (data!.totalCallOI / totalOI) * 100 : 50;
  const putPct  = totalOI > 0 ? (data!.totalPutOI  / totalOI) * 100 : 50;

  // PCR gauge — map 0.3 to 2.0 range onto 0-100%
  const gaugeMin = 0.3, gaugeMax = 2.0;
  const gaugePct = data ? Math.min(100, Math.max(0, ((data.pcr - gaugeMin) / (gaugeMax - gaugeMin)) * 100)) : 50;

  // Top OI changes (biggest builds today)
  const topBuildup = data
    ? [...data.strikeData]
        .sort((a, b) => (b.callChng + b.putChng) - (a.callChng + a.putChng))
        .slice(0, 5)
    : [];

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>PCR Tracker</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/max-pain" style={{ color: '#00C076', fontSize: 13, textDecoration: 'none' }}>Max Pain</Link>
          <Link href="/brokerage-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Brokerage</Link>
          <Link href="/events" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Events</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Put-Call Ratio (PCR) Tracker</h1>
            <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
              Live PCR from NSE option chain. Auto-refreshes every 3 minutes. Check this before every trade session.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {SYMBOLS.map(s => (
              <button key={s} onClick={() => setSymbol(s)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                background: symbol === s ? 'rgba(0,192,118,0.15)' : '#161b22',
                color: symbol === s ? '#00C076' : '#8b949e',
                border: `1px solid ${symbol === s ? 'rgba(0,192,118,0.4)' : '#30363d'}`,
              }}>{s}</button>
            ))}
            <button onClick={() => fetchData(symbol)} disabled={loading} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
              background: '#161b22', color: loading ? '#8b949e' : '#e6edf3', border: '1px solid #30363d',
            }}>{loading ? '⟳' : '↻'}</button>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
            <div style={{ color: '#f85149', fontWeight: 600, marginBottom: 4 }}>Unable to load live data</div>
            <div style={{ color: '#8b949e', fontSize: 14 }}>{error}</div>
            <div style={{ color: '#8b949e', fontSize: 13, marginTop: 6 }}>NSE sometimes blocks automated requests. Refreshing in a moment...</div>
          </div>
        )}

        {data && data.underlyingValue === 0 && !loading && (
          <div style={{ background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
            <div style={{ color: '#f85149', fontWeight: 600, fontSize: 15, marginBottom: 8 }}>⚠ NSE returned empty data</div>
            <div style={{ color: '#8b949e', fontSize: 14, lineHeight: 1.7 }}>
              NSE often restricts API access outside trading hours (9:15 AM – 3:30 PM IST, Mon–Fri) and sometimes blocks server IPs.
              <br />Try refreshing during market hours, or check the <a href="https://www.nseindia.com/option-chain" target="_blank" rel="noreferrer" style={{ color: '#00C076' }}>NSE option chain directly</a>.
            </div>
          </div>
        )}

        {data && data.underlyingValue > 0 && sentiment && (
          <>
            {/* Big PCR card */}
            <div style={{ background: sentiment.bg, border: `1px solid ${sentiment.color}30`, borderRadius: 16, padding: 32, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>Put-Call Ratio — {symbol} ({data.nearestExpiry})</div>
                <div style={{ fontSize: 72, fontWeight: 900, color: sentiment.color, lineHeight: 1 }}>{data.pcr.toFixed(2)}</div>
                <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 6, background: sentiment.bg, border: `1px solid ${sentiment.color}50`, borderRadius: 8, padding: '4px 12px' }}>
                  <span style={{ fontSize: 14 }}>{sentiment.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: sentiment.color }}>{sentiment.label}</span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ fontSize: 14, color: '#8b949e', marginBottom: 16 }}>{sentiment.desc}</div>

                {/* Gauge */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#8b949e', marginBottom: 4 }}>
                    <span>0.3 Very Bullish</span>
                    <span>1.0 Neutral</span>
                    <span>2.0 Very Bearish</span>
                  </div>
                  <div style={{ position: 'relative', height: 12, background: 'linear-gradient(to right, #00C076, #e6edf3, #f85149)', borderRadius: 6 }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: `${gaugePct}%`, transform: 'translate(-50%, -50%)',
                      width: 20, height: 20, borderRadius: '50%', background: '#0D1117',
                      border: `3px solid ${sentiment.color}`, boxShadow: `0 0 8px ${sentiment.color}`,
                    }} />
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>
                  {symbol} at <strong style={{ color: '#e6edf3' }}>{fmtN(data.underlyingValue)}</strong> · Max Pain <strong style={{ color: '#f0883e' }}>{fmtN(data.maxPainStrike)}</strong>
                </div>
              </div>
            </div>

            {/* OI split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#f85149', fontWeight: 600, marginBottom: 8 }}>TOTAL CALL OI</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f85149', marginBottom: 4 }}>{fmtOI(data.totalCallOI)}</div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>{callPct.toFixed(1)}% of total OI</div>
                <div style={{ marginTop: 12, height: 6, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${callPct}%`, height: '100%', background: '#f85149', borderRadius: 3 }} />
                </div>
              </div>
              <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
                <div style={{ fontSize: 12, color: '#00C076', fontWeight: 600, marginBottom: 8 }}>TOTAL PUT OI</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#00C076', marginBottom: 4 }}>{fmtOI(data.totalPutOI)}</div>
                <div style={{ fontSize: 13, color: '#8b949e' }}>{putPct.toFixed(1)}% of total OI</div>
                <div style={{ marginTop: 12, height: 6, background: '#21262d', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${putPct}%`, height: '100%', background: '#00C076', borderRadius: 3 }} />
                </div>
              </div>
            </div>

            {/* PCR interpretation guide */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>How to Read PCR</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { range: 'Above 1.4', sentiment: 'Bearish / Contrarian Bullish', color: '#f85149', note: 'Too many puts. Can signal capitulation and reversal.' },
                  { range: '1.2 – 1.4', sentiment: 'Bearish', color: '#f0883e', note: 'More hedging. Institutions protecting downside.' },
                  { range: '0.8 – 1.2', sentiment: 'Neutral', color: '#e6edf3', note: 'Balanced. No strong bias either way.' },
                  { range: '0.6 – 0.8', sentiment: 'Bullish', color: '#00C076', note: 'More calls. Market leaning optimistic.' },
                  { range: 'Below 0.6', sentiment: 'Extremely Bullish / Contrarian Bearish', color: '#00C076', note: 'Overconfidence. Watch for pullbacks.' },
                ].map(({ range, sentiment: s, color, note }) => (
                  <div key={range} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                    background: data.pcr >= parseFloat(range.split(' ')[0]) || range.includes('Below') ?
                      (range === '0.8 – 1.2' && data.pcr >= 0.8 && data.pcr <= 1.2 ? 'rgba(139,148,158,0.08)' :
                       range === '1.2 – 1.4' && data.pcr >= 1.2 && data.pcr <= 1.4 ? 'rgba(240,136,62,0.08)' :
                       range === 'Above 1.4' && data.pcr > 1.4 ? 'rgba(248,81,73,0.08)' :
                       range === '0.6 – 0.8' && data.pcr >= 0.6 && data.pcr < 0.8 ? 'rgba(0,192,118,0.08)' :
                       range === 'Below 0.6' && data.pcr < 0.6 ? 'rgba(0,192,118,0.08)' : 'transparent') : 'transparent',
                    borderRadius: 8, border: '1px solid transparent',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color, marginRight: 8 }}>{range}</span>
                      <span style={{ fontSize: 13, color: '#8b949e' }}>— {s}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#8b949e', maxWidth: 220, textAlign: 'right' }}>{note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Biggest OI builds today */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262d' }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Biggest OI Build-ups Today</span>
                <span style={{ fontSize: 12, color: '#8b949e', marginLeft: 8 }}>Where fresh money is entering</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#0D1117' }}>
                  <th style={{ padding: '8px 20px', textAlign: 'left', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Strike</th>
                  <th style={{ padding: '8px 20px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Call OI</th>
                  <th style={{ padding: '8px 20px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Call Chng</th>
                  <th style={{ padding: '8px 20px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Put OI</th>
                  <th style={{ padding: '8px 20px', textAlign: 'right', fontSize: 11, color: '#8b949e', fontWeight: 500 }}>Put Chng</th>
                </tr></thead>
                <tbody>
                  {topBuildup.map(r => (
                    <tr key={r.strike} style={{ borderBottom: '1px solid #21262d' }}>
                      <td style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600 }}>{fmtN(r.strike)}</td>
                      <td style={{ padding: '10px 20px', textAlign: 'right', fontSize: 13 }}>{fmtOI(r.callOI)}</td>
                      <td style={{ padding: '10px 20px', textAlign: 'right', fontSize: 13, color: r.callChng >= 0 ? '#00C076' : '#f85149' }}>
                        {r.callChng >= 0 ? '+' : ''}{fmtOI(r.callChng)}
                      </td>
                      <td style={{ padding: '10px 20px', textAlign: 'right', fontSize: 13 }}>{fmtOI(r.putOI)}</td>
                      <td style={{ padding: '10px 20px', textAlign: 'right', fontSize: 13, color: r.putChng >= 0 ? '#00C076' : '#f85149' }}>
                        {r.putChng >= 0 ? '+' : ''}{fmtOI(r.putChng)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ fontSize: 12, color: '#8b949e', textAlign: 'center', marginBottom: 24 }}>
              NSE data: {data.timestamp} · Fetched: {lastFetched?.toLocaleTimeString('en-IN')} · Auto-refreshes every 3 min
            </div>
          </>
        )}

        {loading && !data && (
          <div style={{ textAlign: 'center', padding: 60, color: '#8b949e' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⟳</div>
            <div>Fetching live PCR data from NSE...</div>
          </div>
        )}

        <div style={{ background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.7 }}>
            <strong style={{ color: '#00C076' }}>Important caveat:</strong> PCR is a sentiment gauge, not a trade signal.
            Use it as context — a PCR above 1.3 tells you fear is elevated, not that the market will definitely go up.
            Combine PCR with <Link href="/max-pain" style={{ color: '#00C076' }}>max pain level</Link>,
            top OI strikes, and India VIX for a complete picture before your trade.
            Practice your PCR-based strategy with real option chain data on <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
