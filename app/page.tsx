'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Calculator, Shield, BarChart3, TrendingUp, ChevronDown, IndianRupee, Zap, Target, X } from 'lucide-react';

// ── Candlestick canvas background ─────────────────────────────────────────────
function CandlestickBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const numCandles = 16;
    const candles = Array.from({ length: numCandles }, (_, i) => {
      const open = 80 + Math.random() * 200;
      const close = 80 + Math.random() * 200;
      return {
        x: (canvas.width / numCandles) * i + (canvas.width / numCandles) / 2,
        open, close,
        high: Math.max(open, close) + 15 + Math.random() * 50,
        low: Math.min(open, close) - 15 - Math.random() * 50,
        width: 14,
        delay: i * 0.07,
      };
    });

    let startTime: number | null = null;
    let raf: number;

    const draw = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = (ts - startTime) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      candles.forEach(c => {
        const p = Math.min(1, Math.max(0, (elapsed - c.delay) / 1.5));
        if (p <= 0) return;
        const isGreen = c.close >= c.open;
        const scale = 0.5;
        const baseY = canvas.height * 0.72;
        const bodyTop = Math.min(c.open, c.close);
        const bodyBot = Math.max(c.open, c.close);

        ctx.strokeStyle = isGreen ? 'rgba(0,192,118,0.14)' : 'rgba(255,77,77,0.11)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.x, baseY - c.high * scale);
        ctx.lineTo(c.x, baseY - c.low * scale);
        ctx.stroke();

        ctx.fillStyle = isGreen ? 'rgba(0,192,118,0.12)' : 'rgba(255,77,77,0.09)';
        const bh = (bodyBot - bodyTop) * p * scale;
        ctx.fillRect(c.x - c.width / 2, baseY - bodyBot * scale, c.width, bh);
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.9 }} />
  );
}

// ── Floating ambient particles ─────────────────────────────────────────────────
const PARTICLES = [
  { t: '₹', x: 6, dur: 22, delay: 0, op: 0.09, sz: 14, green: true },
  { t: 'NIFTY', x: 13, dur: 27, delay: 4, op: 0.06, sz: 10, green: false },
  { t: '+0.4%', x: 20, dur: 19, delay: 7, op: 0.07, sz: 10, green: true },
  { t: '₹', x: 28, dur: 24, delay: 1, op: 0.10, sz: 13, green: true },
  { t: 'BANKNIFTY', x: 36, dur: 30, delay: 5, op: 0.05, sz: 9, green: false },
  { t: '+182', x: 44, dur: 21, delay: 9, op: 0.07, sz: 11, green: true },
  { t: '%', x: 52, dur: 18, delay: 2, op: 0.09, sz: 14, green: false },
  { t: '22,450', x: 60, dur: 25, delay: 8, op: 0.06, sz: 10, green: false },
  { t: '₹', x: 68, dur: 28, delay: 3, op: 0.09, sz: 15, green: true },
  { t: '-0.6%', x: 76, dur: 20, delay: 10, op: 0.07, sz: 10, green: false },
  { t: 'GOLDM', x: 83, dur: 23, delay: 12, op: 0.06, sz: 10, green: false },
  { t: '+₹2,340', x: 91, dur: 26, delay: 14, op: 0.05, sz: 9, green: true },
];

function FloatingParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {PARTICLES.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${p.x}%`,
          bottom: '-30px',
          color: p.green ? '#00C076' : '#475569',
          opacity: p.op,
          fontSize: p.sz,
          fontFamily: 'monospace',
          fontWeight: 600,
          animation: `floatUp ${p.dur}s ${p.delay}s linear infinite`,
          whiteSpace: 'nowrap',
        }}>
          {p.t}
        </div>
      ))}
    </div>
  );
}

// ── Animated counter ───────────────────────────────────────────────────────────
function useCounter(end: number, duration = 1800, startDelay = 400) {
  const [count, setCount] = useState(end); // start at end to avoid zero flash
  useEffect(() => {
    setCount(0);
    const timeout = setTimeout(() => {
      let cur = 0;
      const inc = end / (duration / 16);
      const t = setInterval(() => {
        cur += inc;
        if (cur >= end) { setCount(end); clearInterval(t); }
        else setCount(Math.floor(cur));
      }, 16);
      return () => clearInterval(t);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [end, duration, startDelay]);
  return count;
}

// ── Live trade notifications ───────────────────────────────────────────────────
const TRADE_NOTIFICATIONS = [
  { name: 'Rahul K.', city: 'Mumbai', instrument: 'GOLDM', pnl: '+₹4,200', emoji: '🔥' },
  { name: 'Priya S.', city: 'Pune', instrument: 'BANKNIFTY', pnl: '+₹8,900', emoji: '📈' },
  { name: 'Arjun M.', city: 'Delhi', instrument: 'CRUDEOILM', pnl: '+₹2,640', emoji: '⚡' },
  { name: 'Sneha R.', city: 'Bangalore', instrument: 'NIFTY50', pnl: '+₹3,150', emoji: '🎯' },
  { name: 'Vikram P.', city: 'Hyderabad', instrument: 'SILVERM', pnl: '+₹1,890', emoji: '💰' },
  { name: 'Anita D.', city: 'Chennai', instrument: 'GOLDM', pnl: '+₹5,600', emoji: '🚀' },
];

function LiveTradeToasts() {
  const [visible, setVisible] = useState<{ id: number; trade: typeof TRADE_NOTIFICATIONS[0] } | null>(null);
  const indexRef = useRef(0);
  const counterRef = useRef(0);

  useEffect(() => {
    const show = () => {
      const trade = TRADE_NOTIFICATIONS[indexRef.current % TRADE_NOTIFICATIONS.length];
      const id = ++counterRef.current;
      setVisible({ id, trade });
      indexRef.current++;
      setTimeout(() => setVisible(v => v?.id === id ? null : v), 3200);
    };
    const t = setTimeout(show, 2500);
    const interval = setInterval(show, 6000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  if (!visible) return null;
  const { trade } = visible;

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: 24, zIndex: 200,
      background: '#111827', border: '1px solid rgba(0,192,118,0.2)',
      borderRadius: 14, padding: '12px 16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      animation: 'toastIn 0.35s ease',
      maxWidth: 240,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>{trade.emoji}</span>
        <div>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{trade.name} · {trade.city}</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>
            <span style={{ color: '#00C076' }}>{trade.pnl}</span>
            <span style={{ color: '#475569', fontWeight: 400 }}> on {trade.instrument}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Live price mini-cards ──────────────────────────────────────────────────────
function LivePriceBar({ tickers }: { tickers: { sym: string; price: number; chg: number }[] }) {
  const items = tickers.slice(0, 3);
  const sparkPaths = [
    'M0,30 L10,26 L20,28 L30,18 L40,22 L50,12 L60,8 L70,4',
    'M0,28 L10,32 L20,24 L30,30 L40,20 L50,24 L60,16 L70,10',
    'M0,32 L10,28 L20,34 L30,22 L40,26 L50,18 L60,22 L70,12',
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
      {items.map((tk, i) => {
        const up = tk.chg >= 0;
        return (
          <div key={tk.sym} style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: '10px 14px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          }}>
            <div>
              <div style={{ fontSize: 10, color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{tk.sym}</div>
              <div style={{ fontWeight: 700, fontSize: 13 }}>₹{tk.price.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: up ? '#00C076' : '#FF4D4D', marginTop: 2 }}>{up ? '▲' : '▼'} {Math.abs(tk.chg)}%</div>
            </div>
            <svg viewBox="0 0 70 40" width={55} height={28} style={{ opacity: 0.8, flexShrink: 0 }}>
              <path d={sparkPaths[i]} fill="none" stroke={up ? '#00C076' : '#FF4D4D'} strokeWidth="1.5" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ── Ticker data ────────────────────────────────────────────────────────────────
const TICKERS = [
  { sym: 'NIFTY 50', price: 24352, chg: -2.1 },
  { sym: 'BANKNIFTY', price: 52180, chg: -1.8 },
  { sym: 'GOLDM', price: 78450, chg: +1.2 },
  { sym: 'SILVERM', price: 89200, chg: -0.8 },
  { sym: 'CRUDEOILM', price: 6890, chg: +3.5 },
  { sym: 'NATURALGAS', price: 245, chg: +0.4 },
  { sym: 'COPPER', price: 785, chg: -1.1 },
  { sym: 'FINNIFTY', price: 23150, chg: -1.5 },
];

const TOOLS = [
  { name: 'Options P&L Calculator', desc: 'P&L at expiry for any strike, long or short', href: '/options-pl-calculator', icon: Calculator, color: '#7c3aed' },
  { name: 'Position Sizing', desc: 'Risk-based lot calculator — how many lots you can take', href: '/position-sizing-calculator', icon: TrendingUp, color: '#0891b2' },
  { name: 'Brokerage Calculator', desc: 'Exact charges: STT, GST, exchange + net P&L', href: '/brokerage-calculator', icon: BarChart3, color: '#059669' },
  { name: 'Max Pain Calculator', desc: 'Live NIFTY/BANKNIFTY max pain from NSE option chain', href: '/max-pain', icon: Target, color: '#f0883e' },
  { name: 'PCR Tracker', desc: 'Put-Call Ratio with live sentiment gauge', href: '/pcr', icon: Zap, color: '#58a6ff' },
  { name: 'Events Calendar', desc: 'RBI, FOMC, expiry dates — never miss a key event', href: '/events', icon: Shield, color: '#ea580c' },
];

const FAQS = [
  { q: 'Is paper trading really free?', a: 'Yes — ₹10 Lakh virtual capital, no credit card needed. Free forever.' },
  { q: 'What markets can I trade?', a: 'NIFTY, BANKNIFTY, FINNIFTY options + MCX commodities (Gold, Silver, Crude Oil, Natural Gas).' },
  { q: 'Is the data real-time?', a: 'Yes. Live market data during NSE/MCX trading hours. Paper trades execute at actual market prices.' },
  { q: 'Can I use the indicators without paper trading?', a: 'Absolutely. Our TradingView indicators work on any chart, independent of the paper trading platform.' },
  { q: 'When does the platform go live?', a: 'Very soon — join the waitlist to get early access + a launch discount.' },
];

// ── Page ───────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tickers, setTickers] = useState(TICKERS);

  const stat1 = useCounter(10, 1500, 400);
  const stat2 = useCounter(500, 2000, 500);
  const stat3 = useCounter(4, 1000, 300);
  const stat4 = useCounter(65, 1800, 600);

  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 10000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTickers(prev => prev.map(tk => ({
        ...tk,
        price: Math.round(tk.price * (1 + (Math.random() - 0.497) * 0.001)),
        chg: Math.round((tk.chg + (Math.random() - 0.5) * 0.05) * 100) / 100,
      })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) setSubmitted(true);
    } catch { /* noop */ }
    setLoading(false);
  };

  const tickerHtml = [...tickers, ...tickers].map(tk => {
    const up = tk.chg >= 0;
    return `<span style="display:inline-flex;align-items:center;gap:6px;padding:0 22px;font-size:12px;white-space:nowrap;font-family:monospace">
      <span style="font-weight:600;color:#94a3b8">${tk.sym}</span>
      <span style="color:#e2e8f0">₹${tk.price.toLocaleString('en-IN')}</span>
      <span style="color:${up ? '#00C076' : '#FF4D4D'};font-size:10px">${up ? '▲' : '▼'} ${Math.abs(tk.chg)}%</span>
      <span style="color:#1e293b">·</span>
    </span>`;
  }).join('');

  return (
    <div style={{ background: '#0D1117', color: '#e2e8f0', overflowX: 'hidden' }}>

      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes floatUp { 0%{transform:translateY(0);opacity:0} 8%{opacity:1} 85%{opacity:0.8} 100%{transform:translateY(-90vh);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 30px rgba(0,192,118,0.25)} 50%{box-shadow:0 0 60px rgba(0,192,118,0.45)} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        
        .w0{animation:fadeUp 0.5s 0.00s both;display:inline-block}
        .w1{animation:fadeUp 0.5s 0.09s both;display:inline-block}
        .w2{animation:fadeUp 0.5s 0.18s both;display:inline-block}
        .w3{animation:fadeUp 0.5s 0.27s both;display:inline-block}
        .w4{animation:fadeUp 0.5s 0.36s both;display:inline-block}
        .w5{animation:fadeUp 0.5s 0.45s both;display:inline-block}
        .w6{animation:fadeUp 0.5s 0.54s both;display:inline-block}
        
        .fu0{animation:fadeUp 0.7s 0.00s both}
        .fu1{animation:fadeUp 0.7s 0.15s both}
        .fu2{animation:fadeUp 0.7s 0.30s both}
        .fu3{animation:fadeUp 0.7s 0.45s both}
        .fu4{animation:fadeUp 0.7s 0.60s both}
        
        .card{background:#161B22;border:1px solid #21262D;border-radius:18px;transition:all 0.25s}
        .card:hover{border-color:rgba(0,192,118,0.28);transform:translateY(-3px);box-shadow:0 16px 48px rgba(0,0,0,0.4)}
        
        .cta-btn{background:#00C076;color:#0D1117;font-weight:900;border:none;cursor:pointer;border-radius:14px;transition:all 0.2s;padding:16px 32px;font-size:16px;display:inline-flex;align-items:center;gap:8px}
        .cta-btn:hover{background:#00a865;transform:translateY(-2px);box-shadow:0 0 40px rgba(0,192,118,0.45)}
        
        input{background:rgba(255,255,255,0.04);border:1px solid #21262D;color:#e2e8f0;outline:none;transition:all 0.2s}
        input:focus{border-color:#00C076;box-shadow:0 0 0 3px rgba(0,192,118,0.12)}
        input::placeholder{color:#475569}
        
        .slabel{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#00C076}
        
        .ping-dot{position:relative;display:inline-flex;width:8px;height:8px}
        .ping-dot::before{content:'';position:absolute;inset:0;border-radius:50%;background:#00C076;opacity:0.7;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite}
        .ping-dot::after{content:'';width:8px;height:8px;border-radius:50%;background:#00C076;display:block}
        
        @media(max-width:768px){
          .hero-h1{font-size:44px !important}
          .two-col{grid-template-columns:1fr !important}
          .four-col{grid-template-columns:repeat(2,1fr) !important}
          .three-col{grid-template-columns:1fr !important}
          .nav-mid{display:none !important}
          .nav-cta-btn{display:none !important}
          .cmp-row{grid-template-columns:1fr !important}
          .stat-grid{grid-template-columns:repeat(2,1fr) !important}
        }
      `}</style>

      {/* ── Live Ticker ──────────────────────────────── */}
      <div style={{ background: '#0a0e15', borderBottom: '1px solid #1a2232', padding: '8px 0', overflow: 'hidden' }}>
        <div style={{ display: 'inline-flex', animation: 'ticker 38s linear infinite', whiteSpace: 'nowrap' }}
          dangerouslySetInnerHTML={{ __html: tickerHtml }} />
      </div>

      {/* ── Navbar ──────────────────────────────────── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(13,17,23,0.88)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '13px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
              <div style={{ width: 34, height: 34, background: '#00C076', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0D1117', fontSize: 16, boxShadow: '0 0 16px rgba(0,192,118,0.35)' }}>P</div>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#e2e8f0' }}>Paper<span style={{ color: '#00C076' }}>Pe</span></span>
            </Link>
            <div className="nav-mid" style={{ display: 'flex', gap: 2 }}>
              {[['Tools', '/calculator'], ['Indicators', '/indicators'], ['Blog', '/blog'], ['Brokers', '/brokers']].map(([l, h]) => (
                <Link key={h} href={h} style={{ padding: '6px 13px', borderRadius: 8, color: '#64748b', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.18s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}>
                  {l}
                </Link>
              ))}
            </div>
          </div>
          <Link className="nav-cta-btn" href="/indicators" style={{ background: '#00C076', color: '#0D1117', padding: '9px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', boxShadow: '0 0 20px rgba(0,192,118,0.25)' }}>
            Get Indicators
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '80px 24px 60px' }}>
        <CandlestickBg />
        <FloatingParticles />

        {/* Center radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,192,118,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to bottom, transparent, #0D1117)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 780, width: '100%', textAlign: 'center' }}>

          {/* Live badge */}
          <div className="fu0" style={{ marginBottom: 30, display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 18px', borderRadius: 999, background: 'rgba(0,192,118,0.07)', border: '1px solid rgba(0,192,118,0.18)', fontSize: 12, fontFamily: 'monospace' }}>
              <span className="ping-dot" />
              <span style={{ color: '#00C076', fontWeight: 700, letterSpacing: '0.1em' }}>LIVE</span>
              <span style={{ color: '#1e293b' }}>|</span>
              <span style={{ color: '#475569' }}>Now in Public Beta · MCX &amp; F&amp;O</span>
            </div>
          </div>

          {/* Headline — word by word */}
          <h1 className="hero-h1" style={{ fontSize: 70, fontWeight: 800, lineHeight: 1.05, marginBottom: 22, letterSpacing: '-0.03em' }}>
            <span className="w0" style={{ marginRight: 18 }}>Trade</span>
            <span className="w1" style={{ marginRight: 18 }}>Gold,</span>
            <span className="w2" style={{ marginRight: 18 }}>Nifty</span>
            <span className="w3" style={{ marginRight: 18 }}>&amp;</span>
            <br />
            <span className="w4" style={{ marginRight: 18 }}>Crude</span>
            <span className="w5" style={{ marginRight: 18 }}>Oil</span>
            <span className="w6" style={{ background: 'linear-gradient(135deg,#00C076 0%,#00ccff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Risk Free.</span>
          </h1>

          {/* Sub */}
          <p className="fu2" style={{ fontSize: 19, color: '#64748b', lineHeight: 1.75, marginBottom: 40, maxWidth: 540, margin: '0 auto 40px' }}>
            Practice with ₹10 Lakh virtual capital. Real MCX &amp; F&amp;O prices, real P&amp;L tracking — zero real money at risk.
          </p>

          {/* Email form */}
          {!submitted ? (
            <form className="fu3" onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, maxWidth: 460, margin: '0 auto 22px' }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required
                style={{ flex: 1, padding: '15px 20px', borderRadius: 14, fontSize: 15 }} />
              <button type="submit" disabled={loading} className="cta-btn"
                style={{ padding: '15px 26px', fontSize: 15, opacity: loading ? 0.7 : 1, boxShadow: '0 0 32px rgba(0,192,118,0.35)' }}>
                {loading ? '…' : <><span>Join Waitlist</span><ArrowRight size={16} /></>}
              </button>
            </form>
          ) : (
            <div className="fu3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: '#00C076', fontSize: 18, fontWeight: 700, marginBottom: 22 }}>
              <CheckCircle size={22} /> You&apos;re on the list! 🎉
            </div>
          )}

          {/* Trust */}
          <div className="fu4" style={{ display: 'flex', justifyContent: 'center', gap: 28, fontSize: 13, color: '#374151', flexWrap: 'wrap', marginBottom: 40 }}>
            {['Free forever', 'No credit card', 'Real-time prices'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <CheckCircle size={13} color="#00C076" /> {t}
              </span>
            ))}
          </div>

          {/* Live price mini cards */}
          <div className="fu4">
            <LivePriceBar tickers={tickers} />
          </div>
        </div>

        {/* Live trade toasts */}
        <LiveTradeToasts />
      </section>

      {/* ── Dashboard Showcase ───────────────────────── */}
      <section style={{ padding: '0 24px 90px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ background: '#0a0e15', border: '1px solid rgba(0,192,118,0.12)', borderRadius: 26, overflow: 'hidden', boxShadow: '0 60px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,192,118,0.04)', animation: 'float 4s ease-in-out infinite' }}>
          {/* Mac-style bar */}
          <div style={{ background: '#111827', padding: '13px 20px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['#FF5F57', '#FFBD2E', '#28CA42'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
            <span style={{ color: '#374151', fontSize: 12, marginLeft: 10, fontFamily: 'monospace' }}>PaperPe Dashboard</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#00C076', fontFamily: 'monospace' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C076', display: 'inline-block' }} />LIVE
            </div>
          </div>
          <div style={{ padding: 24 }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[{ l: 'Capital', v: '₹9,87,450', c: '#e2e8f0' }, { l: "Today P&L", v: '+₹12,680', c: '#00C076' }, { l: 'Win Rate', v: '68%', c: '#e2e8f0' }].map(s => (
                <div key={s.l} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.l}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
            {/* Positions */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 10, color: '#374151', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Open Positions</div>
              {[
                { sym: 'GOLDM', side: 'BUY', lots: '2', pnl: '+₹2,340', up: true },
                { sym: 'BANKNIFTY', side: 'SELL', lots: '1', pnl: '+₹8,900', up: true },
                { sym: 'CRUDEOILM', side: 'BUY', lots: '5', pnl: '-₹1,560', up: false },
              ].map((p, i) => (
                <div key={p.sym} style={{ padding: '11px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none', fontSize: 13 }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{p.sym}</span>
                    <span style={{ color: '#374151', marginLeft: 8 }}>{p.lots} lots · {p.side}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: p.up ? '#00C076' : '#FF4D4D' }}>{p.pnl}</span>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                <span style={{ fontWeight: 700 }}>GOLDM</span>
                <span style={{ color: '#00C076', fontWeight: 700 }}>₹78,920 <span style={{ color: '#374151', fontWeight: 400 }}>+1.2%</span></span>
              </div>
              <svg viewBox="0 0 400 56" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none" height={56}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C076" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#00C076" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,52 L50,46 L100,48 L150,36 L200,40 L250,24 L300,18 L350,8 L400,4" fill="none" stroke="#00C076" strokeWidth="2" />
                <path d="M0,52 L50,46 L100,48 L150,36 L200,40 L250,24 L300,18 L350,8 L400,4 L400,56 L0,56Z" fill="url(#cg)" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '60px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(0,192,118,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="stat-grid" style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, textAlign: 'center', position: 'relative' }}>
          {[
            { v: `₹${stat1}L+`, l: 'Starting Capital', glow: true },
            { v: `${stat2}+`, l: 'On Waitlist', glow: false },
            { v: String(stat3), l: 'Free Tools', glow: false },
            { v: `${stat4}%`, l: 'Win Rate Boost', glow: true },
          ].map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 48, fontWeight: 800, color: s.glow ? '#00C076' : '#e2e8f0', marginBottom: 8, letterSpacing: '-0.02em', ...(s.glow ? { textShadow: '0 0 32px rgba(0,192,118,0.55)' } : {}) }}>
                {s.v}
              </div>
              <div style={{ fontSize: 11, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ────────────────────────────── */}
      <section style={{ padding: '96px 24px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <p className="slabel" style={{ marginBottom: 14 }}>Simple Setup</p>
          <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 14, letterSpacing: '-0.02em' }}>Start in 2 minutes</h2>
          <p style={{ color: '#475569', fontSize: 16, maxWidth: 460, margin: '0 auto' }}>No documents. No KYC. No broker account needed.</p>
        </div>
        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
          {[
            { n: '01', title: 'Create Free Account', desc: 'Sign up with email. Get ₹10 Lakh virtual capital credited instantly. No credit card required.', icon: Zap },
            { n: '02', title: 'Pick Your Instrument', desc: 'NIFTY/BANKNIFTY F&O options or MCX Gold, Crude, Silver. Live prices, real lot sizes.', icon: Target },
            { n: '03', title: 'Trade & Build Confidence', desc: "Place trades, track P&L, study your win rate. Go live only when your stats say you're ready.", icon: IndianRupee },
          ].map((step, i) => (
            <div key={i} className="card" style={{ padding: 32, position: 'relative', overflow: 'hidden' }}>
              <span style={{ position: 'absolute', top: 10, right: 18, fontSize: 60, fontWeight: 900, color: 'rgba(255,255,255,0.025)', fontFamily: 'monospace', lineHeight: 1 }}>{step.n}</span>
              <div style={{ width: 48, height: 48, background: 'rgba(0,192,118,0.08)', border: '1px solid rgba(0,192,118,0.18)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <step.icon size={22} color="#00C076" />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.75 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison ──────────────────────────────── */}
      <section style={{ padding: '0 24px 96px', maxWidth: 840, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="slabel" style={{ marginBottom: 14 }}>Why Paper Trade?</p>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>Learn Without The Pain</h2>
        </div>
        <div style={{ background: '#161B22', border: '1px solid #21262D', borderRadius: 22, overflow: 'hidden' }}>
          <div className="cmp-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', textAlign: 'center', borderBottom: '1px solid #21262D' }}>
            <div style={{ padding: '20px 24px' }} />
            <div style={{ padding: '20px 24px', background: 'rgba(255,77,77,0.04)', borderLeft: '1px solid #21262D', borderRight: '1px solid #21262D' }}>
              <div style={{ fontWeight: 700, color: '#FF4D4D', marginBottom: 3 }}>Real Trading</div>
              <div style={{ fontSize: 12, color: '#374151' }}>Learning the hard way</div>
            </div>
            <div style={{ padding: '20px 24px', background: 'rgba(0,192,118,0.04)' }}>
              <div style={{ fontWeight: 700, color: '#00C076', marginBottom: 3 }}>PaperPe</div>
              <div style={{ fontSize: 12, color: '#374151' }}>Smart way to learn</div>
            </div>
          </div>
          {[
            ['Cost of mistakes', '₹10K – ₹1L+', '₹0'],
            ['Emotional pressure', 'Extreme', 'None'],
            ['Learning speed', 'Slow (fear inhibits)', 'Fast (experiment freely)'],
            ['Risk of blowup', 'Very real', 'Zero'],
          ].map(([feat, real, paper], i, arr) => (
            <div key={i} className="cmp-row" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', borderBottom: i < arr.length - 1 ? '1px solid #21262D' : 'none' }}>
              <div style={{ padding: '15px 24px', fontWeight: 500, fontSize: 14, color: '#94a3b8' }}>{feat}</div>
              <div style={{ padding: '15px 24px', textAlign: 'center', color: '#FF4D4D', fontSize: 14, borderLeft: '1px solid #21262D', borderRight: '1px solid #21262D', background: 'rgba(255,77,77,0.02)' }}>{real}</div>
              <div style={{ padding: '15px 24px', textAlign: 'center', color: '#00C076', fontSize: 14, fontWeight: 600, background: 'rgba(0,192,118,0.02)' }}>{paper}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free Tools ──────────────────────────────── */}
      <section style={{ padding: '0 24px 96px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="slabel" style={{ marginBottom: 14 }}>Available Now · Free</p>
          <h2 style={{ fontSize: 44, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.02em' }}>Trading Tools</h2>
          <p style={{ color: '#475569', fontSize: 16 }}>No signup required. Open and use instantly.</p>
        </div>
        <div className="four-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {TOOLS.map((tool, i) => (
            <Link key={i} href={tool.href} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card" style={{ padding: 28, cursor: 'pointer', height: '100%' }}>
                <div style={{ width: 50, height: 50, background: `${tool.color}18`, border: `1px solid ${tool.color}35`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <tool.icon size={22} color={tool.color} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{tool.name}</h3>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Indicators ──────────────────────────────── */}
      <section style={{ padding: '0 24px 96px', maxWidth: 1080, margin: '0 auto' }}>
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <p className="slabel" style={{ marginBottom: 16 }}>Premium · TradingView</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 18, letterSpacing: '-0.02em', lineHeight: 1.15 }}>Indicators Built for Indian Markets</h2>
            <p style={{ color: '#475569', fontSize: 16, marginBottom: 28, lineHeight: 1.8 }}>Clear signals, not noise. Tested on NIFTY, BANKNIFTY, and MCX — not generic global data.</p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32 }}>
              {['ARIA SUPREME — 7 powerful modules in one', 'Score-based signals (0–100 scale)', 'India session awareness built-in', 'Works on weekly & monthly expiry charts'].map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: 15, color: '#cbd5e1' }}>
                  <CheckCircle size={16} color="#00C076" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/indicators" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#00C076', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
              View all indicators <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ background: '#111827', border: '1.5px solid rgba(0,192,118,0.2)', borderRadius: 28, padding: 36, boxShadow: '0 0 80px rgba(0,192,118,0.07)', animation: 'glowPulse 4s ease-in-out infinite' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontWeight: 800, fontSize: 20 }}>ARIA SUPREME</span>
              <span style={{ background: 'linear-gradient(135deg,#00C076,#0099ff)', color: '#0D1117', padding: '4px 14px', borderRadius: 999, fontSize: 11, fontWeight: 800 }}>Flagship</span>
            </div>
            <div style={{ fontSize: 52, fontWeight: 800, marginBottom: 4, letterSpacing: '-0.02em' }}>₹2,999</div>
            <div style={{ textDecoration: 'line-through', color: '#374151', marginBottom: 8, fontSize: 16 }}>₹5,999</div>
            <div style={{ display: 'inline-block', background: 'rgba(0,192,118,0.1)', color: '#00C076', padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 28 }}>
              50% off — Launch Price
            </div>
            <Link href="/indicators" style={{ display: 'block', textAlign: 'center', background: '#00C076', color: '#0D1117', padding: '17px', borderRadius: 16, fontWeight: 900, fontSize: 16, textDecoration: 'none', boxShadow: '0 0 40px rgba(0,192,118,0.3)', marginBottom: 12 }}>
              Buy Now →
            </Link>
            <p style={{ textAlign: 'center', fontSize: 12, color: '#374151' }}>One-time payment · Lifetime access</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────── */}
      <section style={{ padding: '0 24px 96px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p className="slabel" style={{ marginBottom: 14 }}>FAQ</p>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.02em' }}>Common Questions</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <div key={i} className="card" style={{ overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 600, fontSize: 15 }}>{faq.q}</span>
                <ChevronDown size={17} color="#475569" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: '0.2s', flexShrink: 0 }} />
              </div>
              {openFaq === i && (
                <div style={{ padding: '0 22px 18px', color: '#94a3b8', fontSize: 14, lineHeight: 1.8 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────── */}
      <section style={{ padding: '0 24px 100px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(0,192,118,0.05) 0%, rgba(0,153,255,0.03) 100%)', border: '1px solid rgba(0,192,118,0.12)', borderRadius: 32, padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(0,192,118,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <p className="slabel" style={{ marginBottom: 18, position: 'relative' }}>Ready?</p>
          <h2 style={{ fontSize: 48, fontWeight: 800, marginBottom: 18, letterSpacing: '-0.02em', lineHeight: 1.15, position: 'relative' }}>
            Stop losing money<br />learning to trade.
          </h2>
          <p style={{ color: '#475569', fontSize: 18, marginBottom: 40, lineHeight: 1.7, position: 'relative' }}>
            Practice first. Go live only when your P&amp;L says you&apos;re ready.
          </p>
          <Link href="#" onClick={e => { e.preventDefault(); document.querySelector('input[type=email]')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 10, background: '#00C076', color: '#0D1117', padding: '18px 44px', borderRadius: 18, fontWeight: 900, fontSize: 18, textDecoration: 'none', boxShadow: '0 0 60px rgba(0,192,118,0.4)' }}>
            Join Waitlist — It&apos;s Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '56px 24px 40px', background: '#0a0e15' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, background: '#00C076', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#0D1117', fontSize: 14 }}>P</div>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Paper<span style={{ color: '#00C076' }}>Pe</span></span>
              </div>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.7, maxWidth: 240 }}>India&apos;s paper trading platform for MCX commodities and F&amp;O options.</p>
            </div>
            {[
              { title: 'Product', links: [['Tools', '/calculator'], ['Indicators', '/indicators'], ['Leaderboard', '/leaderboard'], ['Blog', '/blog']] },
              { title: 'Learn', links: [['Options Guide', '/blog/nifty-options-trading'], ['MCX Guide', '/blog/mcx-trading-beginners'], ['Greeks', '/blog/options-greeks'], ['Brokers', '/brokers']] },
              { title: 'Legal', links: [['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund'], ['Contact', '/contact']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight: 700, fontSize: 11, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map(([label, href]) => (
                    <li key={href} style={{ marginBottom: 10 }}>
                      <Link href={href} style={{ color: '#374151', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#374151'; }}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#1e293b' }}>© 2026 PaperPe. For educational purposes only. Not SEBI registered.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="https://twitter.com/paperpe_in" style={{ color: '#1e293b', fontSize: 12, textDecoration: 'none' }}>Twitter</a>
              <a href="https://reddit.com/u/Paperpe_in" style={{ color: '#1e293b', fontSize: 12, textDecoration: 'none' }}>Reddit</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Popup ───────────────────────────────────── */}
      {showPopup && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 100, background: '#111827', border: '1px solid rgba(0,192,118,0.18)', borderRadius: 22, padding: 24, maxWidth: 310, boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
          <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: 14, right: 14, background: 'none', border: 'none', color: '#374151', cursor: 'pointer' }}>
            <X size={15} />
          </button>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 30 }}>🎯</span>
            <div>
              <h3 style={{ fontWeight: 800, marginBottom: 5, fontSize: 14 }}>50% Launch Discount!</h3>
              <p style={{ color: '#475569', fontSize: 12, marginBottom: 12, lineHeight: 1.5 }}>Get ARIA SUPREME at ₹2,999</p>
              <Link href="/indicators" onClick={() => setShowPopup(false)} style={{ color: '#00C076', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                View indicators <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
