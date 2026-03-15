'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

const LOTS: Record<string, { lotSize: number; label: string }> = {
  NIFTY:       { lotSize: 75,  label: 'NIFTY 50' },
  BANKNIFTY:   { lotSize: 35,  label: 'BANKNIFTY' },
  FINNIFTY:    { lotSize: 65,  label: 'FINNIFTY' },
  MIDCPNIFTY:  { lotSize: 75,  label: 'MIDCPNIFTY' },
  STOCK:       { lotSize: 1,   label: 'Stock Options' },
};

function calcBrokerage(instrument: string, type: 'options' | 'futures', buyPrice: number, sellPrice: number, lots: number) {
  const lotSize = LOTS[instrument]?.lotSize ?? 75;
  const qty = lots * lotSize;
  const buyTurnover  = buyPrice  * qty;
  const sellTurnover = sellPrice * qty;
  const totalTurnover = buyTurnover + sellTurnover;

  const brokerage = 20 * 2; // ₹20 per order × 2

  // STT — sell side only
  const sttRate = type === 'options' ? 0.000625 : 0.0001; // 0.0625% options, 0.01% futures
  const stt = sttRate * sellTurnover;

  // NSE transaction charges
  const exchangeRate = type === 'options' ? 0.0000535 : 0.0000019;
  const exchangeCharges = exchangeRate * totalTurnover;

  // GST 18% on brokerage + exchange
  const gst = 0.18 * (brokerage + exchangeCharges);

  // SEBI ₹10 per crore
  const sebi = (totalTurnover / 10_000_000) * 10;

  // Stamp duty 0.003% on buy side
  const stampDuty = 0.00003 * buyTurnover;

  const total = brokerage + stt + exchangeCharges + gst + sebi + stampDuty;
  const pnl = (sellPrice - buyPrice) * qty;
  const netPnl = pnl - total;
  const breakeven = buyPrice + (total / qty);

  return {
    brokerage, stt, exchangeCharges, gst, sebi, stampDuty,
    total, pnl, netPnl, breakeven, qty, buyTurnover, sellTurnover,
  };
}

const fmt = (n: number) => '₹' + Math.abs(n).toFixed(2);
const fmtN = (n: number, dec = 2) => n.toFixed(dec);

export default function BrokerageCalculator() {
  const [instrument, setInstrument] = useState('NIFTY');
  const [type, setType] = useState<'options' | 'futures'>('options');
  const [buyPrice, setBuyPrice] = useState('100');
  const [sellPrice, setSellPrice] = useState('150');
  const [lots, setLots] = useState('1');

  const result = useCallback(() => {
    const b = parseFloat(buyPrice) || 0;
    const s = parseFloat(sellPrice) || 0;
    const l = parseInt(lots) || 1;
    return calcBrokerage(instrument, type, b, s, l);
  }, [instrument, type, buyPrice, sellPrice, lots])();

  const inputStyle: React.CSSProperties = {
    background: '#161b22', border: '1px solid #30363d', borderRadius: 8,
    color: '#e6edf3', padding: '10px 14px', fontSize: 15, width: '100%',
    outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: '#8b949e', marginBottom: 4, display: 'block' };
  const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #21262d' };

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>Brokerage Calculator</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link href="/position-sizing-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Position Sizing</Link>
          <Link href="/options-pl-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Options P&amp;L</Link>
          <Link href="/events" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Events Calendar</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>F&amp;O Brokerage Calculator</h1>
          <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
            Exact all-in cost per trade — brokerage, STT, exchange charges, GST, SEBI, stamp duty. Most traders underestimate this by 40%.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Inputs */}
          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 20px', color: '#e6edf3' }}>Trade Details</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Instrument</label>
              <select value={instrument} onChange={e => setInstrument(e.target.value)} style={inputStyle}>
                {Object.entries(LOTS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Trade Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['options', 'futures'] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '9px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                    background: type === t ? '#00C076' : '#0D1117',
                    color: type === t ? '#000' : '#8b949e',
                    border: type === t ? '1px solid #00C076' : '1px solid #30363d',
                  }}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Buy Price (₹)</label>
              <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} style={inputStyle} min="0" step="0.05" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Sell Price (₹)</label>
              <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} style={inputStyle} min="0" step="0.05" />
            </div>

            <div style={{ marginBottom: 0 }}>
              <label style={labelStyle}>Number of Lots</label>
              <input type="number" value={lots} onChange={e => setLots(e.target.value)} style={inputStyle} min="1" step="1" />
              <div style={{ fontSize: 12, color: '#8b949e', marginTop: 4 }}>
                {LOTS[instrument]?.lotSize} units/lot × {lots} = {result.qty} units
              </div>
            </div>
          </div>

          {/* Results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* P&L Summary */}
            <div style={{
              background: result.netPnl >= 0 ? 'rgba(0,192,118,0.08)' : 'rgba(248,81,73,0.08)',
              border: `1px solid ${result.netPnl >= 0 ? 'rgba(0,192,118,0.3)' : 'rgba(248,81,73,0.3)'}`,
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Net P&amp;L (after all charges)</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: result.netPnl >= 0 ? '#00C076' : '#f85149' }}>
                {result.netPnl >= 0 ? '+' : ''}{fmt(result.netPnl)}
              </div>
              <div style={{ fontSize: 13, color: '#8b949e', marginTop: 4 }}>
                Gross P&amp;L: {result.pnl >= 0 ? '+' : ''}{fmt(result.pnl)} — Charges: {fmt(result.total)}
              </div>
            </div>

            {/* Breakeven */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#8b949e', marginBottom: 4 }}>Breakeven Price</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>₹{fmtN(result.breakeven, 2)}</div>
              <div style={{ fontSize: 13, color: '#8b949e' }}>
                Need {fmtN(result.breakeven - (parseFloat(buyPrice)||0), 2)} pts move just to cover charges
              </div>
            </div>

            {/* Charges breakdown */}
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#e6edf3' }}>Charges Breakdown</div>
              {[
                ['Brokerage (₹20×2)', result.brokerage],
                ['STT', result.stt],
                ['Exchange charges', result.exchangeCharges],
                ['GST (18%)', result.gst],
                ['SEBI charges', result.sebi],
                ['Stamp duty', result.stampDuty],
              ].map(([label, val]) => (
                <div key={label as string} style={rowStyle}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{label as string}</span>
                  <span style={{ fontSize: 13, color: '#e6edf3', fontWeight: 500 }}>{fmt(val as number)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>Total Charges</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f85149' }}>{fmt(result.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div style={{ marginTop: 24, background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.6 }}>
            <strong style={{ color: '#00C076' }}>Why this matters:</strong> On a ₹7,500 options position, you pay ~₹55 just to enter and exit.
            That is 0.7% cost before a single rupee of profit. Trade 10 times a day and you need ₹550 in profits just to break even on costs alone.
            Fewer, higher-conviction trades win. Practice finding those setups on{' '}
            <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link> — free paper trading with real market data.
          </p>
        </div>
      </div>
    </div>
  );
}
