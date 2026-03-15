'use client';

import { useState } from 'react';
import Link from 'next/link';

const LOT_SIZES: Record<string, number> = {
  NIFTY: 75, BANKNIFTY: 35, FINNIFTY: 65, MIDCPNIFTY: 75,
};

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');
const pct = (n: number, total: number) => total > 0 ? ((n / total) * 100).toFixed(1) + '%' : '0%';

export default function PositionSizingCalculator() {
  const [accountSize, setAccountSize] = useState('100000');
  const [riskPct, setRiskPct] = useState('2');
  const [instrument, setInstrument] = useState('NIFTY');
  const [premium, setPremium] = useState('100');
  const [customLot, setCustomLot] = useState('');

  const account = parseFloat(accountSize) || 0;
  const risk = parseFloat(riskPct) || 0;
  const prem = parseFloat(premium) || 0;
  const lotSize = parseFloat(customLot) || LOT_SIZES[instrument] || 75;

  const maxLossRupees = account * (risk / 100);
  const costPerLot = prem * lotSize;
  const maxLots = costPerLot > 0 ? Math.floor(maxLossRupees / costPerLot) : 0;
  const actualRisk = maxLots * costPerLot;
  const remainingCapital = account - actualRisk;
  const marginUsedPct = account > 0 ? (actualRisk / account) * 100 : 0;

  // Risk levels
  const levels = [
    { label: 'Conservative (1%)', lots: Math.floor((account * 0.01) / costPerLot) },
    { label: 'Moderate (2%)', lots: Math.floor((account * 0.02) / costPerLot) },
    { label: 'Aggressive (5%)', lots: Math.floor((account * 0.05) / costPerLot) },
  ];

  const inputStyle: React.CSSProperties = {
    background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
    color: '#e6edf3', padding: '10px 14px', fontSize: 15, width: '100%', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#8b949e', marginBottom: 4, display: 'block' };

  const barWidth = Math.min(marginUsedPct, 100);
  const barColor = marginUsedPct > 10 ? '#f85149' : marginUsedPct > 5 ? '#f0883e' : '#00C076';

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>Position Sizing Calculator</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link href="/brokerage-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Brokerage</Link>
          <Link href="/options-pl-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Options P&amp;L</Link>
          <Link href="/events" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Events</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Position Sizing Calculator</h1>
          <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
            Stop guessing how many lots to trade. This calculator tells you the exact size based on your account and risk tolerance — the single most important number in trading.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Inputs */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Your Details</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Total Account Size (₹)</label>
              <input type="number" value={accountSize} onChange={e => setAccountSize(e.target.value)} style={inputStyle} min="0" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Risk Per Trade (%)</label>
              <input type="number" value={riskPct} onChange={e => setRiskPct(e.target.value)} style={inputStyle} min="0.1" max="100" step="0.5" />
              <div style={{ fontSize: 12, color: riskPct > '5' ? '#f85149' : '#8b949e', marginTop: 4 }}>
                {riskPct > '5' ? '⚠ High risk — professional traders use 1–2%' : 'Recommended: 1–2% per trade'}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Instrument</label>
              <select value={instrument} onChange={e => { setInstrument(e.target.value); setCustomLot(''); }} style={inputStyle}>
                {Object.entries(LOT_SIZES).map(([k]) => <option key={k} value={k}>{k}</option>)}
                <option value="CUSTOM">Custom / Stock</option>
              </select>
            </div>

            {instrument === 'CUSTOM' && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Custom Lot Size (units)</label>
                <input type="number" value={customLot} onChange={e => setCustomLot(e.target.value)} style={inputStyle} min="1" placeholder="e.g. 250" />
              </div>
            )}

            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Option Premium (₹ per unit)</label>
              <input type="number" value={premium} onChange={e => setPremium(e.target.value)} style={inputStyle} min="0" step="0.5" />
              <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>
                1 lot = {lotSize} units × ₹{premium} = {fmt(costPerLot)}
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Main result */}
            <div style={{
              background: 'rgba(0,192,118,0.08)', border: '1px solid rgba(0,192,118,0.3)',
              borderRadius: 12, padding: 24, textAlign: 'center',
            }}>
              <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 8 }}>Maximum Lots to Trade</div>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#00C076', lineHeight: 1 }}>{maxLots}</div>
              <div style={{ fontSize: 13, color: '#8b949e', marginTop: 8 }}>lots of {instrument}</div>
            </div>

            {/* Stats */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              {[
                ['Max loss per trade', fmt(maxLossRupees)],
                ['Capital at risk', fmt(actualRisk)],
                ['Capital untouched', fmt(remainingCapital)],
                ['% of account risked', pct(actualRisk, account)],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #21262d' }}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e6edf3' }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Risk bar */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#8b949e' }}>Account risk level</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: barColor }}>{marginUsedPct.toFixed(1)}%</span>
              </div>
              <div style={{ background: '#21262d', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'all 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color: barColor, marginTop: 6 }}>
                {marginUsedPct <= 2 ? '✓ Safe — good position sizing' :
                  marginUsedPct <= 5 ? '⚡ Moderate risk' : '⚠ High risk — reduce lots'}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div style={{ marginTop: 24, background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 600 }}>Risk Level Comparison</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {levels.map(({ label, lots: l }) => (
              <div key={label} style={{
                background: '#0D1117', borderRadius: 8, padding: 16, textAlign: 'center',
                border: `1px solid ${l === maxLots ? '#00C076' : '#21262d'}`,
              }}>
                <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: l === maxLots ? '#00C076' : '#e6edf3' }}>{l > 0 ? l : 0}</div>
                <div style={{ fontSize: 12, color: '#8b949e' }}>lots</div>
                <div style={{ fontSize: 11, color: '#8b949e', marginTop: 4 }}>{l > 0 ? fmt(l * costPerLot) : '—'} max loss</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 24, background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.6 }}>
            <strong style={{ color: '#00C076' }}>The 2% rule:</strong> Risk no more than 2% of your account per trade. On ₹1 lakh, that is ₹2,000 max loss per trade.
            This keeps you in the game long enough to develop skill. Most traders who blow accounts are risking 20–40% per trade without realising it.
            Practice sizing trades correctly on{' '}
            <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link> before real money is involved.
          </p>
        </div>
      </div>
    </div>
  );
}
