'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const LOT_SIZES: Record<string, number> = {
  NIFTY: 75, BANKNIFTY: 35, FINNIFTY: 65, MIDCPNIFTY: 75,
};

const fmt = (n: number) => {
  const abs = Math.abs(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  return (n >= 0 ? '+₹' : '-₹') + abs;
};

export default function OptionsPLCalculator() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [optionType, setOptionType] = useState<'call' | 'put'>('call');
  const [instrument, setInstrument] = useState('NIFTY');
  const [strike, setStrike] = useState('22500');
  const [premium, setPremium] = useState('100');
  const [lots, setLots] = useState('1');
  const [currentPrice, setCurrentPrice] = useState('22500');

  const lotSize = LOT_SIZES[instrument] || 75;
  const strikeN = parseFloat(strike) || 0;
  const premiumN = parseFloat(premium) || 0;
  const lotsN = parseInt(lots) || 1;
  const currentN = parseFloat(currentPrice) || strikeN;
  const qty = lotsN * lotSize;

  const calcPnl = (niftyLevel: number): number => {
    let intrinsic = 0;
    if (optionType === 'call') intrinsic = Math.max(0, niftyLevel - strikeN);
    else intrinsic = Math.max(0, strikeN - niftyLevel);

    const pnlPerUnit = tradeType === 'buy'
      ? intrinsic - premiumN
      : premiumN - intrinsic;
    return pnlPerUnit * qty;
  };

  const breakeven = optionType === 'call'
    ? strikeN + premiumN
    : strikeN - premiumN;

  const liveColor = calcPnl(currentN) >= 0 ? '#00C076' : '#f85149';

  // Table rows: range around strike
  const step = instrument === 'BANKNIFTY' ? 200 : 100;
  const rows = useMemo(() => {
    const points: number[] = [];
    for (let i = -10; i <= 10; i++) points.push(strikeN + i * step);
    return points;
  }, [strikeN, step]);

  const inputStyle: React.CSSProperties = {
    background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
    color: '#e6edf3', padding: '10px 14px', fontSize: 15, width: '100%', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#8b949e', marginBottom: 4, display: 'block' };

  const toggleBtn = (active: boolean, danger?: boolean): React.CSSProperties => ({
    flex: 1, padding: '9px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
    background: active ? (danger ? 'rgba(248,81,73,0.15)' : 'rgba(0,192,118,0.15)') : '#0D1117',
    color: active ? (danger ? '#f85149' : '#00C076') : '#8b949e',
    border: active ? `1px solid ${danger ? '#f85149' : '#00C076'}` : '1px solid #30363d',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>Options P&amp;L Calculator</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link href="/brokerage-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Brokerage</Link>
          <Link href="/position-sizing-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Position Sizing</Link>
          <Link href="/events" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Events</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>Options P&amp;L Calculator</h1>
          <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
            See your exact profit or loss at every NIFTY level before you place the trade. Know your worst case, breakeven, and best case upfront.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
          {/* Inputs */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24, height: 'fit-content' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 20px' }}>Trade Setup</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>You Are</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setTradeType('buy')} style={toggleBtn(tradeType === 'buy')}>Buying</button>
                <button onClick={() => setTradeType('sell')} style={toggleBtn(tradeType === 'sell', true)}>Selling</button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Option Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setOptionType('call')} style={toggleBtn(optionType === 'call')}>Call (CE)</button>
                <button onClick={() => setOptionType('put')} style={toggleBtn(optionType === 'put')}>Put (PE)</button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Instrument</label>
              <select value={instrument} onChange={e => setInstrument(e.target.value)} style={inputStyle}>
                {Object.keys(LOT_SIZES).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Strike Price</label>
              <input type="number" value={strike} onChange={e => setStrike(e.target.value)} style={inputStyle} step="50" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Premium (₹ per unit)</label>
              <input type="number" value={premium} onChange={e => setPremium(e.target.value)} style={inputStyle} min="0" step="0.5" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Number of Lots</label>
              <input type="number" value={lots} onChange={e => setLots(e.target.value)} style={inputStyle} min="1" />
              <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>
                {lotSize} units/lot × {lotsN} = {qty} units | Capital: ₹{(premiumN * qty).toLocaleString('en-IN')}
              </div>
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Current {instrument} Price</label>
              <input type="number" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} style={inputStyle} step="50" />
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Live P&L */}
            <div style={{
              background: calcPnl(currentN) >= 0 ? 'rgba(0,192,118,0.08)' : 'rgba(248,81,73,0.08)',
              border: `1px solid ${calcPnl(currentN) >= 0 ? 'rgba(0,192,118,0.3)' : 'rgba(248,81,73,0.3)'}`,
              borderRadius: 12, padding: 24,
            }}>
              <div style={{ fontSize: 13, color: '#8b949e', marginBottom: 4 }}>
                P&amp;L if {instrument} expires at {currentN.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: liveColor }}>
                {fmt(calcPnl(currentN))}
              </div>
              <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>Breakeven</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3' }}>
                    {breakeven.toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>Max Loss</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#f85149' }}>
                    {tradeType === 'buy' ? fmt(-premiumN * qty) : 'Unlimited'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>Max Profit</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#00C076' }}>
                    {tradeType === 'sell' ? fmt(premiumN * qty) : 'Unlimited'}
                  </div>
                </div>
              </div>
            </div>

            {/* P&L Table */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #21262d', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>P&amp;L at Expiry</span>
                <span style={{ fontSize: 12, color: '#8b949e' }}>{instrument} level → your outcome</span>
              </div>
              <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#0D1117' }}>
                      <th style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, color: '#8b949e', fontWeight: 500 }}>{instrument} Level</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 12, color: '#8b949e', fontWeight: 500 }}>P&amp;L</th>
                      <th style={{ padding: '10px 20px', textAlign: 'right', fontSize: 12, color: '#8b949e', fontWeight: 500 }}>Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(level => {
                      const pnl = calcPnl(level);
                      const isBreakeven = Math.abs(level - breakeven) < (step / 2);
                      const isCurrent = level === Math.round(currentN / step) * step;
                      const capital = premiumN * qty;
                      const ret = capital > 0 ? (pnl / capital) * 100 : 0;
                      const rowBg = isBreakeven ? 'rgba(240,136,62,0.08)' :
                        isCurrent ? 'rgba(0,192,118,0.05)' : 'transparent';
                      return (
                        <tr key={level} style={{ background: rowBg, borderBottom: '1px solid #21262d' }}>
                          <td style={{ padding: '9px 20px', fontSize: 13 }}>
                            {level.toLocaleString('en-IN')}
                            {isBreakeven && <span style={{ marginLeft: 8, fontSize: 11, color: '#f0883e', background: 'rgba(240,136,62,0.15)', padding: '1px 6px', borderRadius: 4 }}>Breakeven</span>}
                            {isCurrent && !isBreakeven && <span style={{ marginLeft: 8, fontSize: 11, color: '#00C076', background: 'rgba(0,192,118,0.15)', padding: '1px 6px', borderRadius: 4 }}>Current</span>}
                          </td>
                          <td style={{ padding: '9px 20px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: pnl >= 0 ? '#00C076' : '#f85149' }}>
                            {fmt(pnl)}
                          </td>
                          <td style={{ padding: '9px 20px', textAlign: 'right', fontSize: 12, color: pnl >= 0 ? '#00C076' : '#f85149' }}>
                            {pnl >= 0 ? '+' : ''}{ret.toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.6 }}>
            <strong style={{ color: '#00C076' }}>Before every trade:</strong> Know your worst case, breakeven, and realistic target.
            Most traders skip this step and are surprised when they see the numbers live.
            Once you know your P&amp;L profile, practice executing the trade with real market prices on{' '}
            <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link> — free, no real money needed.
          </p>
        </div>
      </div>
    </div>
  );
}
