'use client';

import Link from 'next/link';
import { motion, useInView, animate, useScroll, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

const TAPE = 'NIFTY 50  24,352  −2.1%    ·    BANKNIFTY  52,180  −1.8%    ·    GOLDM  78,450  +1.2%    ·    SILVERM  89,200  −0.8%    ·    CRUDEOILM  6,890  +3.5%    ·    ';

const CHAPTERS = [
  {
    id: 'portfolio',
    kicker: 'Portfolio',
    title: 'A full book. None of it is real money.',
    body: 'You start with ₹10 lakh virtual capital. The P&L updates like a live account, so you can see what a NIFTY or gold session actually does to the book before you ever fund one.',
  },
  {
    id: 'positions',
    kicker: 'Open positions',
    title: 'Real lots. Real instruments.',
    body: 'Practice NIFTY and BANKNIFTY F&O beside MCX gold, silver, and crude. Lot size and price format match the market you will eventually trade.',
  },
  {
    id: 'journal',
    kicker: 'Trade journal',
    title: 'Know your win rate before you go live.',
    body: 'Every paper trade lands in a journal. Win rate, trade count, and P&L stay attached to the account, so “I am ready” is a number, not a feeling.',
  },
];

const HOLDINGS = [
  { name: 'NIFTY', px: '24,263', chg: '+0.34%', up: true },
  { name: 'BANKNIFTY', px: '51,840', chg: '−0.22%', up: false },
  { name: 'GOLDM', px: '78,450', chg: '+1.20%', up: true },
  { name: 'CRUDEOILM', px: '6,890', chg: '+3.50%', up: true },
];

const POSITIONS = [
  { name: 'NIFTY 24NOV FUT', side: 'BUY · 1 lot', meta: 'Entry 24,180 · LTP 24,263', pnl: '+₹6,240', up: true, fill: '72%' },
  { name: 'BANKNIFTY 24NOV', side: 'SELL · 1 lot', meta: 'Entry 52,040 · LTP 51,840', pnl: '+₹3,100', up: true, fill: '58%' },
  { name: 'GOLDM', side: 'BUY · 1 lot', meta: 'Entry 77,620 · LTP 78,450', pnl: '+₹6,440', up: true, fill: '80%' },
  { name: 'CRUDEOILM', side: 'BUY · 1 lot', meta: 'Entry 6,940 · LTP 6,890', pnl: '−₹1,100', up: false, fill: '34%' },
];

const JOURNAL_ROWS = [
  { when: '09:24', name: 'NIFTY', note: 'Closed long', pnl: '+₹1,840', up: true },
  { when: '10:06', name: 'GOLDM', note: 'Closed long', pnl: '+₹2,210', up: true },
  { when: '11:18', name: 'BANKNIFTY', note: 'Stopped', pnl: '−₹980', up: false },
  { when: '13:42', name: 'CRUDEOILM', note: 'Closed long', pnl: '+₹640', up: true },
  { when: '14:55', name: 'SILVERM', note: 'Closed short', pnl: '+₹1,120', up: true },
];

function PhoneStatus() {
  return (
    <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400">
      <span>9:21</span>
      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">Sample</span>
    </div>
  );
}

function PortfolioScreen() {
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-9 text-left">
      <PhoneStatus />
      <p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-neutral-400">Portfolio value</p>
      <p className="mt-1 text-[28px] font-medium leading-none tracking-tight">₹9,87,450</p>
      <p className="mt-1.5 text-xs font-medium text-[#00C076]">+₹12,680 · 1.30% today</p>
      <svg viewBox="0 0 260 86" className="mt-3 h-[86px] w-full">
        <defs>
          <linearGradient id="phoneFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00C076" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#00C076" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 62 C28 60, 46 48, 72 50 C104 52, 118 28, 150 30 C178 32, 196 18, 222 16 C236 15, 248 12, 260 8 V86 H0 Z" fill="url(#phoneFill)" />
        <path d="M0 62 C28 60, 46 48, 72 50 C104 52, 118 28, 150 30 C178 32, 196 18, 222 16 C236 15, 248 12, 260 8" fill="none" stroke="#00C076" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="260" cy="8" r="3.5" fill="#00C076" />
      </svg>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {['1D', '1W', '1M', '3M'].map((label, i) => (
          <span key={label} className={`rounded-full py-1 text-center text-[10px] ${i === 0 ? 'bg-white text-neutral-900 shadow-sm' : 'bg-neutral-100 text-neutral-500'}`}>{label}</span>
        ))}
      </div>
      <div className="mt-3 flex-1 space-y-1.5">
        {HOLDINGS.map((row) => (
          <div key={row.name} className="flex items-center justify-between rounded-xl bg-neutral-50 px-2.5 py-2">
            <div>
              <p className="text-xs font-medium">{row.name}</p>
              <p className="text-[10px] text-neutral-400">{row.px}</p>
            </div>
            <span className={`text-[11px] font-medium ${row.up ? 'text-emerald-600' : 'text-rose-500'}`}>{row.chg}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2.5">
        <div>
          <p className="text-[10px] text-neutral-400">Available</p>
          <p className="text-sm font-medium">₹4,62,110</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-neutral-400">Used margin</p>
          <p className="text-sm font-medium">54%</p>
        </div>
      </div>
    </div>
  );
}

function PositionsScreen() {
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-9 text-left">
      <PhoneStatus />
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium">Open positions</p>
          <p className="text-[10px] text-neutral-400">4 contracts · virtual</p>
        </div>
        <p className="text-xs font-medium text-[#00C076]">+₹14,680</p>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-[10px] text-neutral-400">
          <span>Margin used</span>
          <span>₹5,25,340</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full w-[54%] rounded-full bg-emerald-500" />
        </div>
      </div>
      <div className="mt-3 flex-1 space-y-2">
        {POSITIONS.map((row) => (
          <div key={row.name} className="rounded-2xl border border-neutral-100 px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium leading-4">{row.name}</p>
              <p className={`text-xs font-medium ${row.up ? 'text-emerald-600' : 'text-rose-500'}`}>{row.pnl}</p>
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-neutral-400">
              <span>{row.side}</span>
              <span>{row.meta}</span>
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
              <div className={`h-full rounded-full ${row.up ? 'bg-emerald-500' : 'bg-rose-400'}`} style={{ width: row.fill }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JournalScreen() {
  return (
    <div className="flex h-full flex-col px-4 pb-5 pt-9 text-left">
      <PhoneStatus />
      <p className="mt-4 text-sm font-medium">Performance</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0">
          <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
            <circle cx="36" cy="36" r="28" fill="none" stroke="#f5f5f5" strokeWidth="7" />
            <circle cx="36" cy="36" r="28" fill="none" stroke="#00C076" strokeWidth="7" strokeLinecap="round" strokeDasharray="176" strokeDashoffset="56" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">68%</span>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-neutral-400">Win rate · sample</p>
          <p className="text-sm font-medium">84 of 124 trades</p>
          <p className="mt-1 text-[11px] text-neutral-500">Profit factor 1.82</p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {[
          ['Avg win', '₹2,140'],
          ['Avg loss', '₹980'],
          ['Best day', '+₹8,420'],
          ['Worst day', '−₹3,160'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-neutral-50 px-2.5 py-2">
            <p className="text-[10px] text-neutral-400">{label}</p>
            <p className="text-xs font-medium">{value}</p>
          </div>
        ))}
      </div>
      <p className="mb-1.5 mt-3 text-[10px] uppercase tracking-wider text-neutral-400">Today</p>
      <div className="flex-1 space-y-1.5">
        {JOURNAL_ROWS.map((row) => (
          <div key={row.when + row.name} className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium">{row.name}</p>
              <p className="text-[10px] text-neutral-400">{row.when} · {row.note}</p>
            </div>
            <span className={`text-[11px] font-medium ${row.up ? 'text-emerald-600' : 'text-rose-500'}`}>{row.pnl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const screens = [
  { id: 'portfolio', content: <PortfolioScreen /> },
  { id: 'positions', content: <PositionsScreen /> },
  { id: 'journal', content: <JournalScreen /> },
];

const INSTRUMENTS = [
  { name: 'NIFTY', market: 'NSE F&O', note: 'Index futures and options. The contract most Indian traders learn on.' },
  { name: 'BANKNIFTY', market: 'NSE F&O', note: 'Faster index. Useful once NIFTY position sizing feels automatic.' },
  { name: 'GOLDM', market: 'MCX', note: 'Gold mini. A different session, a different kind of move.' },
  { name: 'SILVERM', market: 'MCX', note: 'Silver mini. Wider ranges than gold, same virtual capital.' },
  { name: 'CRUDEOILM', market: 'MCX', note: 'Crude mini. Practice the night session without funding it.' },
];

const INDICATORS = [
  { name: 'ARIA SUPREME', price: '₹2,999', badge: 'Flagship', detail: 'Seven modules. Score-based signals, trend, smart money, and regime, built for the Indian session.' },
  { name: 'OI Pulse', price: '₹999', badge: 'Popular', detail: 'Open interest, put-call ratio, and max pain so you can see where size is building.' },
  { name: 'Fear & Greed', price: '₹499', badge: 'Starter', detail: 'A sentiment gauge for entries. Extreme fear and extreme greed, on any timeframe.' },
  { name: 'Smart S/R', price: '₹999', badge: 'Essential', detail: 'Support and resistance that update as price moves, with a strength score on each level.' },
];

const TOOLS = [
  { name: 'Option Calculator', href: '/calculator', detail: 'Black-Scholes price, Greeks, breakeven, and P&L scenarios.' },
  { name: 'Position Size', href: '/tools/position-size', detail: 'Lots from your risk, stop, and account size.' },
  { name: 'Brokerage Calculator', href: '/tools/brokerage', detail: 'Zerodha, Groww, Angel One, Upstox. STT, GST, stamp, net P&L.' },
  { name: 'Margin Calculator', href: '/tools/margin', detail: 'SPAN plus exposure for index, stock, and MCX F&O.' },
  { name: 'Max Pain', href: '/max-pain', detail: 'Where the option chain hurts writers the most.' },
  { name: 'PCR Tracker', href: '/pcr', detail: 'Put-call ratio without opening a brokerage terminal.' },
];

const STEPS = [
  { step: '01', title: 'Create a free account', desc: 'Email sign-up. ₹10 lakh virtual capital is the practice book. No KYC and no broker.' },
  { step: '02', title: 'Pick the instrument', desc: 'NIFTY, BANKNIFTY, gold, silver, or crude. Prices and lot sizes follow the real contract.' },
  { step: '03', title: 'Journal the result', desc: 'Track P&L and win rate on paper. Move to a funded account when the journal says so.' },
];

const FAQS = [
  { q: 'Is any real money at risk?', a: 'No. PaperPe is a practice book. The capital is virtual. You cannot withdraw it, and a losing paper trade does not touch a bank account.' },
  { q: 'Do I need a broker or KYC?', a: 'No. Sign-up is an email account. A broker is only needed later, if you decide to trade live somewhere else.' },
  { q: 'Which markets can I practice?', a: 'NSE index F&O, including NIFTY and BANKNIFTY, and MCX commodities, including gold, silver, and crude.' },
  { q: 'Are the indicators included free?', a: 'The calculators are free and do not need an account. The TradingView indicators are separate one-time purchases: ARIA SUPREME ₹2,999, OI Pulse ₹999, Fear & Greed ₹499, Smart S/R ₹999. The complete bundle is ₹3,999.' },
  { q: 'Where do I write if something breaks?', a: 'hello@paperpe.in. Refunds are covered on the refund page.' },
];

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [isInView, to]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString('en-IN')}
    </span>
  );
}

function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StickyStory() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const [active, setActive] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      if (v < 0.33) setActive(0);
      else if (v < 0.66) setActive(1);
      else setActive(2);
    });
  }, [scrollYProgress]);

  const chapter = CHAPTERS[active];

  return (
    <div ref={containerRef} className="relative h-[280vh] border-y border-neutral-200/80 bg-white">
      <div className="sticky top-[4.25rem] flex h-[calc(100vh-4.25rem)] items-center">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-emerald-600">{chapter.kicker}</p>
                <h2 className="mt-4 max-w-xl text-4xl font-medium leading-[1] tracking-[-0.03em] md:text-5xl">{chapter.title}</h2>
                <p className="mt-5 max-w-md text-[17px] font-normal leading-7 text-neutral-500">{chapter.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">
              {CHAPTERS.map((item, i) => (
                <span key={item.id} className={`h-1.5 rounded-full transition-all ${i === active ? 'w-8 bg-neutral-900' : 'w-3 bg-neutral-200'}`} />
              ))}
            </div>
          </div>

          <div className="relative mx-auto h-[660px] w-[340px] [perspective:1600px]">
            <motion.div
              animate={{ rotateY: active === 0 ? -14 : active === 1 ? -6 : 10, rotateX: 6 }}
              transition={{ type: 'spring', stiffness: 48, damping: 18 }}
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute left-5 top-5 h-[620px] w-[290px] rounded-[2.9rem] bg-neutral-300/80" style={{ transform: 'translateZ(-28px)' }} />
              <div className="relative h-[620px] w-[290px] overflow-hidden rounded-[2.6rem] border-[10px] border-neutral-900 bg-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_30px_70px_-28px_rgba(0,0,0,0.45)]">
                <div className="absolute left-1/2 top-2.5 z-10 h-[18px] w-[92px] -translate-x-1/2 rounded-full bg-neutral-950" />
                <div className="absolute -left-[12px] top-28 h-8 w-[3px] rounded-l bg-neutral-700" />
                <div className="absolute -right-[12px] top-36 h-14 w-[3px] rounded-r bg-neutral-700" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screens[active].id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="h-full"
                  >
                    {screens[active].content}
                  </motion.div>
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.35),transparent_26%,transparent_70%,rgba(255,255,255,0.06))]" />
                <div className="absolute bottom-2 left-1/2 z-10 h-1 w-24 -translate-x-1/2 rounded-full bg-neutral-900/80" />
              </div>
              <div className="absolute -bottom-3 left-10 h-8 w-[220px] rounded-full bg-neutral-900/15 blur-2xl" style={{ transform: 'translateZ(-40px)' }} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqList() {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-neutral-200 border-y border-neutral-200">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <button
            key={item.q}
            type="button"
            onClick={() => setOpen(isOpen ? -1 : i)}
            className="block w-full py-5 text-left transition-colors hover:text-neutral-600"
          >
            <span className="flex items-center justify-between gap-6 text-lg font-medium">
              {item.q}
              <span className="text-neutral-400">{isOpen ? '−' : '+'}</span>
            </span>
            {isOpen && <span className="mt-3 block max-w-2xl text-base font-normal text-neutral-500">{item.a}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function PaperPeHome() {
  return (
    <main className="bg-white text-neutral-900">
      <div className="overflow-hidden border-b border-neutral-100 bg-neutral-50 py-2 text-xs text-neutral-500">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          className="flex w-max whitespace-nowrap"
        >
          <span>{TAPE}{TAPE}</span>
          <span>{TAPE}{TAPE}</span>
        </motion.div>
      </div>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,192,118,0.07),transparent_50%)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-emerald-600">Paper trade. Real skills.</p>
              <h1 className="mt-5 text-5xl font-medium leading-[0.96] tracking-[-0.035em] text-neutral-950 md:text-6xl lg:text-[4.6rem]">
                Trade Gold, Nifty & Crude Oil risk free.
              </h1>
              <p className="mt-6 max-w-md text-[17px] font-normal leading-7 text-neutral-500">
                Practice with ₹10 lakh virtual capital. MCX and F&O prices, a real P&L, and no money leaving your account.
              </p>
              <div className="mt-9 flex items-center gap-6">
                <Link href="/signup" className="inline-flex items-center rounded-full bg-neutral-950 px-7 py-3.5 text-sm font-medium tracking-tight text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-800">Start paper trading</Link>
                <Link href="/indicators" className="text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-900">Explore platform</Link>
              </div>
              <p className="mt-5 text-xs tracking-wide text-neutral-400">Free practice account · Calculators need no login · Indicator prices are listed below</p>
            </motion.div>

            <div className="[perspective:1400px]">
            <motion.div
              initial={{ opacity: 0, y: 56, rotateX: 16, rotateY: -18 }}
              animate={{ opacity: 1, y: 0, rotateX: 7, rotateY: -12 }}
              transition={{ duration: 1.15, delay: 0.15, ease: EASE }}
              className="relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute -bottom-8 left-8 right-8 h-16 rounded-full bg-neutral-900/10 blur-2xl" />
              <div className="relative rounded-[1.75rem] border border-neutral-200/90 bg-white p-8 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_28px_70px_-32px_rgba(0,0,0,0.28)] md:p-9">
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.7),transparent_42%)]" />
              <div className="relative flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Portfolio value</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium tracking-wide text-emerald-700">Sample</span>
              </div>
              <p className="relative mt-4 text-5xl font-medium leading-none tracking-[-0.04em] text-neutral-950">₹<CountUp to={987450} /></p>
              <p className="relative mt-3 text-lg font-medium tracking-tight text-[#00C076]">+₹<CountUp to={12680} /> <span className="text-sm font-normal text-emerald-700/80">↑ 1.30%</span></p>
              <div className="relative mt-8 h-28">
                <motion.svg viewBox="0 0 400 100" className="h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C076" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00C076" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 75 C60 72, 100 58, 160 54 C220 50, 260 32, 320 22 C360 16, 380 14, 400 10"
                    fill="none" stroke="#00C076" strokeWidth="2.5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ duration: 2.2, delay: 0.5, ease: EASE }}
                    style={{ filter: 'drop-shadow(0 0 6px rgba(0,192,118,0.35))' }}
                  />
                  <motion.path
                    d="M0 75 C60 72, 100 58, 160 54 C220 50, 260 32, 320 22 C360 16, 380 14, 400 10 V100 H0 Z"
                    fill="url(#glow)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                  />
                </motion.svg>
              </div>
              <div className="relative mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">NIFTY</p>
                  <p className="mt-1 font-medium tracking-tight text-emerald-600">+₹6,240</p>
                </div>
                <div className="rounded-2xl bg-neutral-50 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-neutral-400">GOLDM</p>
                  <p className="mt-1 font-medium tracking-tight text-emerald-600">+₹6,440</p>
                </div>
              </div>
              </div>
            </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200/80 bg-[#f7f7f8] py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 px-6 md:grid-cols-4">
          {[
            { value: '₹10L', label: 'Virtual starting capital' },
            { value: 'NSE + MCX', label: 'Index F&O and commodities' },
            { value: '4', label: 'TradingView indicators' },
            { value: '6', label: 'Free calculators' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-medium leading-none tracking-[-0.03em] text-neutral-950">{stat.value}</p>
              <p className="mt-2 text-sm leading-5 text-neutral-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <StickyStory />

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-emerald-600">Markets</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-medium leading-[1] tracking-[-0.03em] md:text-5xl">The contracts Indian traders actually lose money on.</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-7 text-neutral-500">Practice them here first. Same names, same lot language, virtual capital.</p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {INSTRUMENTS.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <div className="h-full rounded-3xl border border-neutral-200/90 bg-white p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)]">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400">{item.market}</p>
                <h3 className="mt-3 text-3xl font-medium leading-none tracking-[-0.03em]">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-500">{item.note}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.2}>
            <Link href="/signup" className="flex h-full flex-col justify-between rounded-3xl border border-neutral-200 bg-[#f7f7f8] p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.25)]">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-600">Practice book</p>
              <div>
                <h3 className="text-3xl font-medium leading-none tracking-[-0.03em]">Open the account.</h3>
                <p className="mt-3 text-sm text-neutral-500">₹10 lakh to lose on paper, and a journal that remembers it.</p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f7f7f8] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-emerald-600">TradingView</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-medium leading-[1] tracking-[-0.03em] md:text-5xl">Indicators for the session you already trade.</h2>
            <p className="mt-4 max-w-xl text-[17px] leading-7 text-neutral-500">One-time purchase. Built for NIFTY, BANKNIFTY, stocks, and MCX. The complete bundle is ₹3,999 instead of ₹5,496.</p>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {INDICATORS.map((item) => (
              <Link key={item.name} href="/indicators" className="rounded-3xl border border-neutral-200/90 bg-white p-6 shadow-[0_1px_1px_rgba(0,0,0,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-emerald-600">{item.badge}</p>
                    <h3 className="mt-2 text-2xl font-medium">{item.name}</h3>
                  </div>
                  <p className="text-2xl font-medium">{item.price}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-500">{item.detail}</p>
              </Link>
            ))}
          </div>
          <Link href="/indicators" className="mt-8 inline-block text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-900">See indicator details</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-emerald-600">Free tools</p>
          <h2 className="mt-4 text-4xl font-medium leading-[1] tracking-[-0.03em] md:text-5xl">Open a calculator. No account.</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-7 text-neutral-500">Pricing, size, brokerage, margin, max pain, and PCR. Use them before the paper trade, or instead of one.</p>
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link key={tool.href} href={tool.href} className="rounded-3xl border border-neutral-200/90 p-6 transition duration-200 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.2)]">
              <h3 className="text-xl font-medium tracking-[-0.02em]">{tool.name}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-500">{tool.detail}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f7f8] py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="text-4xl font-medium leading-[1] tracking-[-0.03em] md:text-5xl">Start in a few minutes.</h2>
            <p className="mt-4 text-[17px] leading-7 text-neutral-500">No documents. No KYC. No broker account.</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.06}>
                <div className="h-full rounded-3xl border border-neutral-200/90 bg-white p-7 shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
                  <p className="text-[13px] font-medium tracking-[0.14em] text-emerald-600">{item.step}</p>
                  <h3 className="mt-4 text-2xl font-medium leading-none tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-500">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <h2 className="text-4xl font-medium leading-[1] tracking-[-0.03em]">Questions</h2>
        <div className="mt-8">
          <FaqList />
        </div>
      </section>

      <section className="bg-[#f7f7f8] px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-4xl">
        <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.035em] md:text-6xl">Learn the market before it charges you for the lesson.</h2>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-7 text-neutral-500">Practice first. Fund a real account when the paper journal is the reason, not the hope.</p>
        <div className="mt-9 flex items-center justify-center gap-6">
          <Link href="/signup" className="inline-flex items-center rounded-full bg-neutral-950 px-8 py-3.5 text-sm font-medium tracking-tight text-white shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] transition duration-200 hover:-translate-y-0.5 hover:bg-neutral-800">Start paper trading</Link>
          <Link href="/learn" className="text-sm font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-950 hover:decoration-neutral-900">Read the lessons</Link>
        </div>
        </div>
      </section>
    </main>
  );
}
