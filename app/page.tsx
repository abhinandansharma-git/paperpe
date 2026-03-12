'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, TrendingUp, TrendingDown, Calculator, Shield, BarChart3, ChevronDown, Star, Zap, Target, IndianRupee, X } from 'lucide-react';

// ── Animated counter ──────────────────────────────────────────────────────────
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const inc = end / (duration / 16);
        const t = setInterval(() => {
          start += inc;
          if (start >= end) { setCount(end); clearInterval(t); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return { count, ref };
}

// ── Ticker data ───────────────────────────────────────────────────────────────
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

const tools = [
  { name: 'Option Calculator', desc: 'Greeks, P&L, breakeven analysis', href: '/calculator', icon: Calculator, color: 'from-violet-500 to-purple-600' },
  { name: 'Position Sizing', desc: 'Risk-based lot calculator', href: '/tools/position-size', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { name: 'Brokerage Calculator', desc: 'Compare broker charges', href: '/tools/brokerage', icon: BarChart3, color: 'from-emerald-500 to-green-500' },
  { name: 'Margin Calculator', desc: 'F&O margin requirements', href: '/tools/margin', icon: Shield, color: 'from-orange-500 to-amber-500' },
];

const faqs = [
  { q: 'Is paper trading really free?', a: 'Yes — ₹10 Lakh virtual capital, no credit card needed. Free forever.' },
  { q: 'What markets can I trade?', a: 'NIFTY, BANKNIFTY, FINNIFTY options + MCX commodities (Gold, Silver, Crude Oil, Natural Gas).' },
  { q: 'Is the data real-time?', a: 'Yes. Live market data during NSE/MCX trading hours. Paper trades execute at actual market prices.' },
  { q: 'Can I use the indicators without paper trading?', a: 'Absolutely. Our TradingView indicators work on any chart, independent of the paper trading platform.' },
  { q: 'When does the platform go live?', a: 'Very soon — join the waitlist to get early access + a launch discount.' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [tickers, setTickers] = useState(TICKERS);

  const stat1 = useCounter(10, 1500);
  const stat2 = useCounter(500, 2000);
  const stat3 = useCounter(4, 1000);
  const stat4 = useCounter(65, 1800);

  // Popup after 10s
  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 10000);
    return () => clearTimeout(t);
  }, []);

  // Tick prices
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
    } catch {}
    setLoading(false);
  };

  const tickerHtml = [...tickers, ...tickers].map(tk => {
    const up = tk.chg >= 0;
    return `<span style="display:inline-flex;align-items:center;gap:6px;padding:0 20px;font-size:13px;white-space:nowrap">
      <span style="font-weight:600;color:#e2e8f0">${tk.sym}</span>
      <span style="color:#e2e8f0">₹${tk.price.toLocaleString('en-IN')}</span>
      <span style="color:${up ? '#00C076' : '#FF4D4D'}">${up ? '▲' : '▼'} ${Math.abs(tk.chg)}%</span>
      <span style="color:#334155">|</span>
    </span>`;
  }).join('');

  return (
    <div style={{ background: '#0D1117', color: '#e2e8f0', fontFamily: 'Outfit, sans-serif', overflowX: 'hidden' }}>

      {/* ── Ticker ─────────────────────────────────────── */}
      <div style={{ background: '#161B22', borderBottom: '1px solid #21262D', padding: '8px 0', overflow: 'hidden' }}>
        <div
          style={{ display: 'inline-flex', animation: 'ticker 35s linear infinite', whiteSpace: 'nowrap' }}
          dangerouslySetInnerHTML={{ __html: tickerHtml }}
        />
      </div>

      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.6s 0.1s ease both; }
        .fade-up-2 { animation: fadeUp 0.6s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
        .fade-up-4 { animation: fadeUp 0.6s 0.4s ease both; }
        .card { background:#161B22; border:1px solid #21262D; border-radius:16px; transition:all 0.2s; }
        .card:hover { border-color:rgba(0,192,118,0.3); transform:translateY(-2px); }
        .btn-primary { background:#00C076; color:#0D1117; font-weight:700; border:none; cursor:pointer; transition:all 0.2s; }
        .btn-primary:hover { background:#00a865; transform:translateY(-1px); }
        .btn-ghost { background:transparent; border:1px solid #21262D; color:#94a3b8; cursor:pointer; transition:all 0.2s; }
        .btn-ghost:hover { border-color:#00C076; color:#00C076; }
        .up { color: #00C076; }
        .down { color: #FF4D4D; }
        input { background:#0D1117; border:1px solid #21262D; color:#e2e8f0; outline:none; transition:border 0.2s; }
        input:focus { border-color:#00C076; }
        input::placeholder { color:#475569; }
        .pill { display:inline-flex;align-items:center;gap:6px;padding:6px 14px;background:rgba(0,192,118,0.1);border:1px solid rgba(0,192,118,0.2);color:#00C076;border-radius:999px;font-size:13px;font-weight:500; }
        .blink { animation: blink 1.5s ease infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .section-label { font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#00C076; }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav style={{ position:'sticky', top:0, zIndex:50, background:'rgba(13,17,23,0.9)', backdropFilter:'blur(16px)', borderBottom:'1px solid #21262D', padding:'14px 24px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <Link href="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
              <div style={{ width:34, height:34, background:'#00C076', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#0D1117', fontSize:16 }}>P</div>
              <span style={{ fontWeight:700, fontSize:18, color:'#e2e8f0' }}>Paper<span style={{ color:'#00C076' }}>Pe</span></span>
            </Link>
            <div style={{ display:'flex', gap:4 }}>
              {[['Tools','/calculator'],['Indicators','/indicators'],['Blog','/blog'],['Brokers','/brokers']].map(([label, href]) => (
                <Link key={href} href={href} style={{ padding:'6px 12px', borderRadius:8, color:'#94a3b8', textDecoration:'none', fontSize:14, fontWeight:500, transition:'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color='#e2e8f0', e.currentTarget.style.background='#21262D')}
                  onMouseLeave={e => (e.currentTarget.style.color='#94a3b8', e.currentTarget.style.background='transparent')}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/indicators" style={{ background:'#00C076', color:'#0D1117', padding:'8px 20px', borderRadius:10, fontWeight:700, fontSize:14, textDecoration:'none', boxShadow:'0 0 20px rgba(0,192,118,0.25)' }}>
            Get Indicators
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section style={{ padding:'80px 24px 100px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          {/* Left */}
          <div>
            <div className="pill fade-up" style={{ marginBottom:24 }}>
              <span className="blink" style={{ width:8, height:8, background:'#00C076', borderRadius:'50%', display:'inline-block' }}></span>
              Live paper trading · MCX & F&amp;O
            </div>
            <h1 className="fade-up-1" style={{ fontSize:56, fontWeight:700, lineHeight:1.1, marginBottom:20, letterSpacing:'-0.02em' }}>
              Trade Gold, Nifty &amp;<br />
              <span style={{ background:'linear-gradient(135deg,#00C076,#00a8ff)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Crude Oil — Risk Free
              </span>
            </h1>
            <p className="fade-up-2" style={{ fontSize:18, color:'#94a3b8', lineHeight:1.7, marginBottom:32, maxWidth:480 }}>
              Practice with ₹10 Lakh virtual capital. Real MCX & F&O prices, real P&L tracking — zero real money at risk.
            </p>

            {!submitted ? (
              <form className="fade-up-3" onSubmit={handleSubmit} style={{ display:'flex', gap:10, maxWidth:440, marginBottom:24 }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address" required
                  style={{ flex:1, padding:'14px 18px', borderRadius:12, fontSize:15 }}
                />
                <button type="submit" disabled={loading} className="btn-primary"
                  style={{ padding:'14px 24px', borderRadius:12, fontSize:15, whiteSpace:'nowrap', opacity:loading ? 0.6 : 1, display:'flex', alignItems:'center', gap:8 }}>
                  {loading ? '...' : <>Join Waitlist <ArrowRight size={16} /></>}
                </button>
              </form>
            ) : (
              <div className="fade-up-3" style={{ display:'flex', alignItems:'center', gap:10, color:'#00C076', fontSize:18, fontWeight:600, marginBottom:24 }}>
                <CheckCircle size={22} /> You&apos;re on the list!
              </div>
            )}

            <div className="fade-up-4" style={{ display:'flex', gap:20, fontSize:13, color:'#64748b' }}>
              {['Free forever', 'No credit card', 'Real-time prices'].map(t => (
                <span key={t} style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <CheckCircle size={14} color="#00C076" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Terminal mockup */}
          <div style={{ position:'relative', animation:'float 3s ease-in-out infinite' }}>
            <div style={{ background:'#0D1117', border:'1px solid #21262D', borderRadius:16, overflow:'hidden', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
              {/* Terminal bar */}
              <div style={{ background:'#161B22', padding:'12px 16px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #21262D' }}>
                {['#FF5F57','#FFBD2E','#28CA42'].map(c => <div key={c} style={{ width:12, height:12, borderRadius:'50%', background:c }} />)}
                <span style={{ color:'#475569', fontSize:12, marginLeft:8 }}>PaperPe Dashboard</span>
              </div>
              <div style={{ padding:16 }}>
                {/* Stats */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:14 }}>
                  {[
                    { label:'Capital', val:'₹9,87,450', color:'#e2e8f0' },
                    { label:"Today P&L", val:'+₹12,680', color:'#00C076' },
                    { label:'Win Rate', val:'68%', color:'#e2e8f0' },
                  ].map(s => (
                    <div key={s.label} style={{ background:'#161B22', border:'1px solid #21262D', borderRadius:10, padding:'10px 12px' }}>
                      <div style={{ fontSize:11, color:'#64748b', marginBottom:4 }}>{s.label}</div>
                      <div style={{ fontWeight:700, fontSize:13, color:s.color }}>{s.val}</div>
                    </div>
                  ))}
                </div>
                {/* Positions */}
                <div style={{ background:'#161B22', border:'1px solid #21262D', borderRadius:10, overflow:'hidden', marginBottom:12 }}>
                  <div style={{ padding:'8px 12px', borderBottom:'1px solid #21262D', fontSize:11, color:'#64748b', fontWeight:600 }}>OPEN POSITIONS</div>
                  {[
                    { sym:'GOLDM', side:'BUY', lots:'2', pnl:'+₹2,340', up:true },
                    { sym:'BANKNIFTY', side:'SELL', lots:'1', pnl:'+₹8,900', up:true },
                    { sym:'CRUDEOILM', side:'BUY', lots:'5', pnl:'-₹1,560', up:false },
                  ].map(p => (
                    <div key={p.sym} style={{ padding:'8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #21262D', fontSize:12 }}>
                      <div>
                        <span style={{ fontWeight:600 }}>{p.sym}</span>
                        <span style={{ color:'#64748b', marginLeft:8 }}>{p.lots} lots · {p.side}</span>
                      </div>
                      <span style={{ fontWeight:700, color:p.up ? '#00C076' : '#FF4D4D' }}>{p.pnl}</span>
                    </div>
                  ))}
                </div>
                {/* Mini chart */}
                <div style={{ background:'#161B22', border:'1px solid #21262D', borderRadius:10, padding:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:12 }}>
                    <span style={{ fontWeight:600 }}>GOLDM</span>
                    <span className="up">₹78,920 <span style={{ color:'#64748b' }}>+1.2%</span></span>
                  </div>
                  <svg viewBox="0 0 280 50" style={{ width:'100%', display:'block' }} preserveAspectRatio="none" height={50}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00C076" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#00C076" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,45 L35,40 L70,42 L105,32 L140,35 L175,22 L210,18 L245,10 L280,6" fill="none" stroke="#00C076" strokeWidth="2"/>
                    <path d="M0,45 L35,40 L70,42 L105,32 L140,35 L175,22 L210,18 L245,10 L280,6 L280,50 L0,50 Z" fill="url(#g1)"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div style={{ position:'absolute', bottom:-16, left:-16, background:'#161B22', border:'1px solid #21262D', borderRadius:14, padding:'12px 16px', boxShadow:'0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize:11, color:'#64748b', marginBottom:2 }}>Best Trade Today</div>
              <div style={{ fontWeight:700, color:'#00C076', fontSize:14 }}>+₹12,450 on GOLDM</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────── */}
      <div style={{ background:'#161B22', borderTop:'1px solid #21262D', borderBottom:'1px solid #21262D', padding:'48px 24px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:32, textAlign:'center' }}>
          {[
            { ref: stat1.ref, val: `₹${stat1.count}L+`, label:'Starting Virtual Capital', color:'#00C076' },
            { ref: stat2.ref, val: `${stat2.count}+`, label:'Traders on Waitlist', color:'#e2e8f0' },
            { ref: stat3.ref, val: `${stat3.count}`, label:'Free Tools Available', color:'#e2e8f0' },
            { ref: stat4.ref, val: `${stat4.count}%`, label:'Avg Win Rate Improvement', color:'#00C076' },
          ].map(s => (
            <div key={s.label} ref={s.ref as React.RefObject<HTMLDivElement>}>
              <div style={{ fontSize:42, fontWeight:700, color:s.color, marginBottom:6 }}>{s.val}</div>
              <div style={{ fontSize:13, color:'#64748b' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ───────────────────────────────── */}
      <section style={{ padding:'96px 24px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p className="section-label" style={{ marginBottom:12 }}>Simple Setup</p>
          <h2 style={{ fontSize:40, fontWeight:700, marginBottom:12 }}>Start in 2 minutes</h2>
          <p style={{ color:'#64748b', fontSize:16, maxWidth:480, margin:'0 auto' }}>No documents, no KYC, no broker account needed.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {[
            { n:'01', title:'Create Free Account', desc:'Sign up with email. Get ₹10 Lakh virtual capital credited instantly. No credit card required.', icon:Zap },
            { n:'02', title:'Pick Your Instrument', desc:'NIFTY/BANKNIFTY F&O options or MCX Gold, Crude, Silver. Live prices, real lot sizes.', icon:Target },
            { n:'03', title:'Trade & Build Confidence', desc:'Place trades, track P&L, study your win rate. Go live only when your stats say you\'re ready.', icon:IndianRupee },
          ].map((step, i) => (
            <div key={i} className="card" style={{ padding:28, position:'relative' }}>
              <span style={{ position:'absolute', top:16, right:20, fontSize:48, fontWeight:700, color:'#1e293b' }}>{step.n}</span>
              <div style={{ width:44, height:44, background:'rgba(0,192,118,0.1)', border:'1px solid rgba(0,192,118,0.2)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                <step.icon size={20} color="#00C076" />
              </div>
              <h3 style={{ fontSize:17, fontWeight:700, marginBottom:8 }}>{step.title}</h3>
              <p style={{ fontSize:14, color:'#64748b', lineHeight:1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comparison ─────────────────────────────────── */}
      <section style={{ padding:'0 24px 96px', maxWidth:900, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p className="section-label" style={{ marginBottom:12 }}>Why Paper Trade?</p>
          <h2 style={{ fontSize:40, fontWeight:700 }}>Learn Without The Pain</h2>
        </div>
        <div style={{ background:'#161B22', border:'1px solid #21262D', borderRadius:20, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', textAlign:'center', borderBottom:'1px solid #21262D' }}>
            <div style={{ padding:'18px 24px' }}></div>
            <div style={{ padding:'18px 24px', background:'rgba(255,77,77,0.05)', borderLeft:'1px solid #21262D', borderRight:'1px solid #21262D' }}>
              <div style={{ fontWeight:700, color:'#FF4D4D', marginBottom:2 }}>Real Trading</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Learning the hard way</div>
            </div>
            <div style={{ padding:'18px 24px', background:'rgba(0,192,118,0.05)' }}>
              <div style={{ fontWeight:700, color:'#00C076', marginBottom:2 }}>PaperPe</div>
              <div style={{ fontSize:12, color:'#64748b' }}>Smart way to learn</div>
            </div>
          </div>
          {[
            ['Cost of mistakes', '₹10K – ₹1L+', '₹0'],
            ['Emotional pressure', 'Extreme (real money)', 'None'],
            ['Learning speed', 'Slow (fear inhibits)', 'Fast (experiment freely)'],
            ['Risk of blowup', 'Very real', 'Zero'],
          ].map(([feat, real, paper], i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', borderBottom: i < 3 ? '1px solid #21262D' : 'none' }}>
              <div style={{ padding:'14px 24px', fontWeight:500, fontSize:14 }}>{feat}</div>
              <div style={{ padding:'14px 24px', textAlign:'center', color:'#FF4D4D', fontSize:14, borderLeft:'1px solid #21262D', borderRight:'1px solid #21262D', background:'rgba(255,77,77,0.03)' }}>{real}</div>
              <div style={{ padding:'14px 24px', textAlign:'center', color:'#00C076', fontSize:14, fontWeight:600, background:'rgba(0,192,118,0.03)' }}>{paper}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Free Tools ─────────────────────────────────── */}
      <section style={{ padding:'0 24px 96px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p className="section-label" style={{ marginBottom:12 }}>Available Now · Free</p>
          <h2 style={{ fontSize:40, fontWeight:700, marginBottom:12 }}>Trading Tools</h2>
          <p style={{ color:'#64748b', fontSize:16 }}>No signup required. Open and use instantly.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {tools.map((tool, i) => (
            <Link key={i} href={tool.href} style={{ textDecoration:'none', color:'inherit' }}>
              <div className="card" style={{ padding:24, cursor:'pointer' }}>
                <div style={{ width:48, height:48, background:`linear-gradient(135deg, var(--tw-gradient-stops))`, borderRadius:14, marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center' }}
                  className={`bg-gradient-to-br ${tool.color}`}>
                  <tool.icon size={22} color="white" />
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>{tool.name}</h3>
                <p style={{ fontSize:13, color:'#64748b', lineHeight:1.5 }}>{tool.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Indicators ─────────────────────────────────── */}
      <section style={{ padding:'0 24px 96px', maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
          <div>
            <p className="section-label" style={{ marginBottom:12 }}>Premium · TradingView</p>
            <h2 style={{ fontSize:40, fontWeight:700, marginBottom:16 }}>Indicators Built for Indian Markets</h2>
            <p style={{ color:'#64748b', fontSize:16, marginBottom:24, lineHeight:1.7 }}>Clear signals, not noise. Tested on NIFTY, BANKNIFTY, and MCX commodities — not generic global data.</p>
            <ul style={{ listStyle:'none', padding:0, marginBottom:28 }}>
              {['ARIA SUPREME — 7 powerful modules in one', 'Score-based signals (0–100 scale)', 'India session awareness built-in', 'Works on weekly & monthly expiry charts'].map((f, i) => (
                <li key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, fontSize:14, color:'#cbd5e1' }}>
                  <CheckCircle size={16} color="#00C076" /> {f}
                </li>
              ))}
            </ul>
            <Link href="/indicators" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#00C076', fontWeight:600, fontSize:15, textDecoration:'none' }}>
              View all indicators <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ background:'#161B22', border:'2px solid rgba(0,192,118,0.2)', borderRadius:24, padding:32, boxShadow:'0 0 60px rgba(0,192,118,0.1)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <span style={{ fontWeight:800, fontSize:20 }}>ARIA SUPREME</span>
              <span style={{ background:'linear-gradient(135deg,#00C076,#0099ff)', color:'#0D1117', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:700 }}>Flagship</span>
            </div>
            <div style={{ fontSize:48, fontWeight:700, marginBottom:4 }}>₹2,999</div>
            <div style={{ textDecoration:'line-through', color:'#475569', marginBottom:8 }}>₹5,999</div>
            <div style={{ display:'inline-block', background:'rgba(0,192,118,0.1)', color:'#00C076', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600, marginBottom:24 }}>
              50% off — Launch Price
            </div>
            <Link href="/indicators" style={{ display:'block', textAlign:'center', background:'#00C076', color:'#0D1117', padding:'16px', borderRadius:14, fontWeight:800, fontSize:16, textDecoration:'none', boxShadow:'0 0 30px rgba(0,192,118,0.3)', marginBottom:12 }}>
              Buy Now
            </Link>
            <p style={{ textAlign:'center', fontSize:12, color:'#475569' }}>One-time payment · Lifetime access</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────── */}
      <section style={{ padding:'0 24px 96px', maxWidth:720, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p className="section-label" style={{ marginBottom:12 }}>FAQ</p>
          <h2 style={{ fontSize:40, fontWeight:700 }}>Common Questions</h2>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="card" style={{ overflow:'hidden', cursor:'pointer' }} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:600, fontSize:15 }}>{faq.q}</span>
                <ChevronDown size={18} color="#64748b" style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition:'0.2s' }} />
              </div>
              {openFaq === i && (
                <div style={{ padding:'0 20px 16px', color:'#94a3b8', fontSize:14, lineHeight:1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────── */}
      <section style={{ padding:'0 24px 96px', maxWidth:700, margin:'0 auto', textAlign:'center' }}>
        <h2 style={{ fontSize:44, fontWeight:700, marginBottom:12, lineHeight:1.2 }}>Stop losing money learning to trade.</h2>
        <p style={{ color:'#64748b', fontSize:18, marginBottom:32 }}>Practice first. Go live only when your P&L says you're ready.</p>
        <Link href="#" onClick={e => { e.preventDefault(); document.querySelector('input[type=email]')?.scrollIntoView({ behavior:'smooth' }); }}
          style={{ display:'inline-block', background:'#00C076', color:'#0D1117', padding:'16px 40px', borderRadius:16, fontWeight:900, fontSize:18, textDecoration:'none', boxShadow:'0 0 40px rgba(0,192,118,0.3)' }}>
          Join Waitlist — It&apos;s Free →
        </Link>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer style={{ borderTop:'1px solid #21262D', padding:'48px 24px', background:'#161B22' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:40 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <div style={{ width:30, height:30, background:'#00C076', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#0D1117', fontSize:14 }}>P</div>
                <span style={{ fontWeight:700, fontSize:16 }}>Paper<span style={{ color:'#00C076' }}>Pe</span></span>
              </div>
              <p style={{ fontSize:13, color:'#475569', lineHeight:1.6, maxWidth:240 }}>India&apos;s paper trading platform for MCX commodities and F&O options.</p>
            </div>
            {[
              { title:'Product', links:[['Tools','/calculator'],['Indicators','/indicators'],['Leaderboard','/leaderboard'],['Blog','/blog']] },
              { title:'Learn', links:[['Options Guide','/blog/nifty-options-trading'],['MCX Guide','/blog/mcx-trading-beginners'],['Greeks','/blog/options-greeks'],['Brokers','/brokers']] },
              { title:'Legal', links:[['Privacy','/privacy'],['Terms','/terms'],['Refund','/refund'],['Contact','/contact']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontWeight:700, fontSize:13, color:'#94a3b8', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.05em' }}>{col.title}</h4>
                <ul style={{ listStyle:'none', padding:0 }}>
                  {col.links.map(([label, href]) => (
                    <li key={href} style={{ marginBottom:8 }}>
                      <Link href={href} style={{ color:'#475569', fontSize:13, textDecoration:'none', transition:'color 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color='#94a3b8')}
                        onMouseLeave={e => (e.currentTarget.style.color='#475569')}>
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid #21262D', paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <p style={{ fontSize:12, color:'#334155' }}>© 2026 PaperPe. For educational purposes only. Not SEBI registered.</p>
            <div style={{ display:'flex', gap:16 }}>
              <a href="https://twitter.com/paperpe_in" style={{ color:'#334155', fontSize:12, textDecoration:'none' }}>Twitter</a>
              <a href="https://reddit.com/u/Paperpe_in" style={{ color:'#334155', fontSize:12, textDecoration:'none' }}>Reddit</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Popup ──────────────────────────────────────── */}
      {showPopup && (
        <div style={{ position:'fixed', bottom:24, right:24, zIndex:100, background:'#161B22', border:'1px solid #21262D', borderRadius:20, padding:24, maxWidth:320, boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
          <button onClick={() => setShowPopup(false)} style={{ position:'absolute', top:12, right:12, background:'none', border:'none', color:'#475569', cursor:'pointer' }}>
            <X size={18} />
          </button>
          <div style={{ display:'flex', gap:14 }}>
            <span style={{ fontSize:36 }}>🎯</span>
            <div>
              <h3 style={{ fontWeight:800, marginBottom:4, fontSize:15 }}>50% Launch Discount!</h3>
              <p style={{ color:'#64748b', fontSize:13, marginBottom:10 }}>Get ARIA SUPREME at ₹2,999</p>
              <Link href="/indicators" onClick={() => setShowPopup(false)} style={{ color:'#00C076', fontWeight:700, fontSize:13, textDecoration:'none' }}>
                View indicators →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
