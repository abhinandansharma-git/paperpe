'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CalEvent {
  date: string;
  label: string;
  type: 'rbi' | 'fomc' | 'expiry' | 'budget' | 'other';
  impact: 'high' | 'medium' | 'low';
  note?: string;
}

const EVENTS: CalEvent[] = [
  // RBI 2026
  { date: '2026-04-09', label: 'RBI Monetary Policy', type: 'rbi', impact: 'high', note: 'Repo rate decision at 10:00 AM IST' },
  { date: '2026-06-06', label: 'RBI Monetary Policy', type: 'rbi', impact: 'high', note: 'Repo rate decision at 10:00 AM IST' },
  { date: '2026-08-08', label: 'RBI Monetary Policy', type: 'rbi', impact: 'high', note: 'Repo rate decision at 10:00 AM IST' },
  { date: '2026-10-08', label: 'RBI Monetary Policy', type: 'rbi', impact: 'high', note: 'Repo rate decision at 10:00 AM IST' },
  { date: '2026-12-05', label: 'RBI Monetary Policy', type: 'rbi', impact: 'high', note: 'Repo rate decision at 10:00 AM IST' },
  // FOMC 2026
  { date: '2026-03-19', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-05-07', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-06-18', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-07-30', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-09-17', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-10-29', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  { date: '2026-12-17', label: 'US FOMC Meeting', type: 'fomc', impact: 'high', note: 'Fed rate decision ~2:00 AM IST next day' },
  // NIFTY Monthly expiry (last Thursday)
  { date: '2026-03-26', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-04-30', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-05-28', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-06-25', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-07-30', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-08-27', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-09-24', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-10-29', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-11-26', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  { date: '2026-12-31', label: 'NIFTY Monthly Expiry', type: 'expiry', impact: 'medium', note: 'Max OI positions close — expect higher volatility' },
  // Budget
  { date: '2027-02-01', label: 'Union Budget 2027-28', type: 'budget', impact: 'high', note: 'Finance Minister speech starts ~11:00 AM IST' },
  // Other
  { date: '2026-04-01', label: 'New Financial Year', type: 'other', impact: 'low', note: 'FII/DII repositioning, can cause gap opens' },
  { date: '2026-03-21', label: 'Holi (Market Holiday)', type: 'other', impact: 'low', note: 'NSE/BSE closed — no trading' },
  { date: '2026-04-14', label: 'Dr Ambedkar Jayanti (Market Holiday)', type: 'other', impact: 'low', note: 'NSE/BSE closed' },
  { date: '2026-04-17', label: 'Good Friday (Market Holiday)', type: 'other', impact: 'low', note: 'NSE/BSE closed' },
  { date: '2026-05-01', label: 'Maharashtra Day (Market Holiday)', type: 'other', impact: 'low', note: 'NSE/BSE closed' },
];

const TYPE_CONFIG = {
  rbi:    { color: '#00C076', bg: 'rgba(0,192,118,0.12)',    label: 'RBI' },
  fomc:   { color: '#58a6ff', bg: 'rgba(88,166,255,0.12)',  label: 'FOMC' },
  expiry: { color: '#f0883e', bg: 'rgba(240,136,62,0.12)',  label: 'Expiry' },
  budget: { color: '#bc8cff', bg: 'rgba(188,140,255,0.12)', label: 'Budget' },
  other:  { color: '#8b949e', bg: 'rgba(139,148,158,0.12)', label: 'Holiday' },
};

const IMPACT_COLOR = { high: '#f85149', medium: '#f0883e', low: '#8b949e' };

const today = new Date().toISOString().split('T')[0];

function daysFromNow(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

export default function EventsCalendar() {
  const [filter, setFilter] = useState<'all' | 'rbi' | 'fomc' | 'expiry' | 'budget'>('all');

  const upcoming = EVENTS
    .filter(e => e.date >= today)
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date));

  const next5 = EVENTS
    .filter(e => e.date >= today && e.impact === 'high')
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const filterBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    background: active ? 'rgba(0,192,118,0.15)' : '#161b22',
    color: active ? '#00C076' : '#8b949e',
    border: active ? '1px solid rgba(0,192,118,0.4)' : '1px solid #30363d',
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0D1117', color: '#e6edf3', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <nav style={{ borderBottom: '1px solid #21262d', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ color: '#00C076', fontWeight: 700, fontSize: 18, textDecoration: 'none' }}>PaperPe</Link>
        <span style={{ color: '#30363d' }}>›</span>
        <span style={{ color: '#8b949e', fontSize: 14 }}>F&amp;O Events Calendar</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <Link href="/brokerage-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Brokerage</Link>
          <Link href="/position-sizing-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Position Sizing</Link>
          <Link href="/options-pl-calculator" style={{ color: '#8b949e', fontSize: 13, textDecoration: 'none' }}>Options P&amp;L</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px' }}>F&amp;O Events Calendar 2026</h1>
          <p style={{ color: '#8b949e', margin: 0, fontSize: 15 }}>
            RBI policy dates, FOMC meetings, monthly expiries, and market holidays. Bookmark this page — check it before every trade.
          </p>
        </div>

        {/* Upcoming high-impact events */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: '#8b949e' }}>⚡ Next High-Impact Events</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {next5.map(e => {
              const days = daysFromNow(e.date);
              const cfg = TYPE_CONFIG[e.type];
              return (
                <div key={e.date + e.label} style={{ background: cfg.bg, border: `1px solid ${cfg.color}40`, borderRadius: 12, padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: `${cfg.color}20`, padding: '2px 8px', borderRadius: 4 }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: 11, color: days <= 7 ? '#f85149' : '#8b949e' }}>
                      {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{e.label}</div>
                  <div style={{ fontSize: 12, color: '#8b949e' }}>{formatDate(e.date)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {(['all', 'rbi', 'fomc', 'expiry', 'budget'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={filterBtnStyle(filter === f)}>
              {f === 'all' ? 'All Events' : f === 'rbi' ? '🟢 RBI Policy' : f === 'fomc' ? '🔵 FOMC' : f === 'expiry' ? '🟠 Monthly Expiry' : '🟣 Budget'}
            </button>
          ))}
        </div>

        {/* Events list */}
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, overflow: 'hidden' }}>
          {upcoming.length === 0 && (
            <div style={{ padding: 32, textAlign: 'center', color: '#8b949e' }}>No upcoming events in this category</div>
          )}
          {upcoming.map((e, i) => {
            const days = daysFromNow(e.date);
            const cfg = TYPE_CONFIG[e.type];
            const isSoon = days <= 7;
            return (
              <div key={e.date + e.label} style={{
                padding: '16px 24px',
                borderBottom: i < upcoming.length - 1 ? '1px solid #21262d' : 'none',
                background: isSoon ? 'rgba(248,81,73,0.03)' : 'transparent',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                {/* Date */}
                <div style={{ minWidth: 80, textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: isSoon ? '#f85149' : '#e6edf3' }}>
                    {new Date(e.date).getDate()}
                  </div>
                  <div style={{ fontSize: 11, color: '#8b949e' }}>
                    {new Date(e.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {/* Tag */}
                <div style={{ minWidth: 80 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: cfg.color, background: cfg.bg, padding: '3px 10px', borderRadius: 6 }}>
                    {cfg.label}
                  </span>
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{e.label}</div>
                  {e.note && <div style={{ fontSize: 12, color: '#8b949e' }}>{e.note}</div>}
                </div>

                {/* Impact + days */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: IMPACT_COLOR[e.impact], background: `${IMPACT_COLOR[e.impact]}15`, padding: '2px 8px', borderRadius: 4, marginBottom: 4, display: 'inline-block' }}>
                    {e.impact} impact
                  </div>
                  <div style={{ fontSize: 12, color: isSoon ? '#f85149' : '#8b949e', display: 'block' }}>
                    {days === 0 ? '🔴 Today' : days === 1 ? '🟡 Tomorrow' : `${days}d away`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div style={{ marginTop: 24, background: 'rgba(0,192,118,0.05)', border: '1px solid rgba(0,192,118,0.15)', borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 600, color: '#00C076' }}>Why event dates matter more than most traders realise</h3>
          <p style={{ margin: 0, fontSize: 14, color: '#8b949e', lineHeight: 1.7 }}>
            RBI and FOMC events cause IV spikes before the announcement and IV crush immediately after.
            Options bought the day before at elevated IV often lose value even when the market moves your way.
            The traders who profit on event days are usually the ones who planned 3–5 days in advance — not the ones reacting on the day.
            Simulate event trades on <Link href="/" style={{ color: '#00C076' }}>PaperPe</Link> to build your event playbook before real money is at stake.
          </p>
        </div>
      </div>
    </div>
  );
}
