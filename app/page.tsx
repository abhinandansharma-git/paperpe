'use client';

import Link from 'next/link';
import { motion, useInView, animate, useScroll, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const NAV = [
  { href: '/indicators', label: 'Indicators' },
  { href: '/tools', label: 'Tools' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About' },
];

function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, to, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
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

const screens = [
  {
    id: 'portfolio',
    title: 'Portfolio',
    content: (
      <div className="p-6 text-left">
        <p className="text-xs text-neutral-400">Portfolio Value</p>
        <p className="mt-1 text-3xl font-medium tracking-tight">₹9,87,450</p>
        <p className="mt-1 text-sm text-[#00C805]">+₹12,680 ↑ 1.30%</p>
        <div className="mt-6 h-24 rounded-xl bg-gradient-to-t from-emerald-50 to-transparent" />
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span>NIFTY</span>
            <span className="text-emerald-600">+₹6,240</span>
          </div>
          <div className="flex justify-between">
            <span>GOLDM</span>
            <span className="text-emerald-600">+₹6,440</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'positions',
    title: 'Open Positions',
    content: (
      <div className="p-6 text-left">
        <p className="text-sm font-medium">Open Positions</p>
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-neutral-100 p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">NIFTY 50</span>
              <span className="text-emerald-600">+₹6,240</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">BUY · 1 lot</p>
          </div>
          <div className="rounded-xl border border-neutral-100 p-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">GOLDM</span>
              <span className="text-emerald-600">+₹6,440</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">BUY · 1 lot</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'journal',
    title: 'Trade Journal',
    content: (
      <div className="p-6 text-left">
        <p className="text-sm font-medium">Performance</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-500 text-lg font-medium">
            68%
          </div>
          <div>
            <p className="text-xs text-neutral-400">Win Rate</p>
            <p className="text-sm">84 winning trades</p>
          </div>
        </div>
        <p className="mt-6 text-xs text-neutral-400">Total trades: 124</p>
      </div>
    ),
  },
];

function StickyPhone() {
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

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="relative">
          <div className="relative h-[640px] w-[300px] overflow-hidden rounded-[2.8rem] border-[10px] border-neutral-900 bg-white shadow-2xl">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-neutral-900" />

            <AnimatePresence mode="wait">
              <motion.div
                key={screens[active].id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="h-full pt-8"
              >
                {screens[active].content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute -right-36 top-1/2 hidden -translate-y-1/2 space-y-3 lg:block">
            {screens.map((s, i) => (
              <p
                key={s.id}
                className={`text-sm transition-colors ${
                  i === active ? 'font-medium text-black' : 'text-neutral-400'
                }`}
              >
                {s.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaperPeHome() {
  return (
    <main className="bg-white text-neutral-900">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="text-[17px] font-semibold tracking-tight">
            PaperPe
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-neutral-900">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden px-3 py-2 text-sm font-medium sm:inline">
              Log in
            </Link>
            <Link href="/signup" className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,200,5,0.06),transparent_50%)]" />

        <div className="mx-auto max-w-6xl px-6 py-32 md:py-40">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-sm font-medium uppercase tracking-wider text-emerald-600">
                Paper Trade. Real Skills.
              </p>
              <h1 className="mt-4 text-6xl font-medium leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
                Trade smarter.
                <br />
                Risk nothing.
              </h1>
              <p className="mt-6 max-w-md text-lg text-neutral-500">
                ₹10 Lakh virtual capital. Real MCX & F&O prices. Real P&L. Zero real money at risk.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <Link href="/signup" className="rounded-full bg-black px-7 py-3.5 text-sm font-medium text-white">
                  Start paper trading
                </Link>
                <Link href="/indicators" className="text-sm font-medium underline underline-offset-4">
                  Explore platform
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2rem] border border-neutral-200/80 bg-white/90 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] backdrop-blur-xl"
              style={{ transformPerspective: 1200 }}
            >
              <div className="flex items-center justify-between text-sm text-neutral-400">
                <span>Portfolio Value</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs text-emerald-700">Virtual</span>
              </div>

              <p className="mt-4 text-5xl font-medium tracking-tight">
                ₹<CountUp to={987450} />
              </p>

              <p className="mt-2 text-xl font-medium text-[#00C805]">
                +₹<CountUp to={12680} /> <span className="text-sm font-normal">↑ 1.30%</span>
              </p>

              <div className="relative mt-8 h-32">
                <motion.svg viewBox="0 0 400 120" className="h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C805" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00C805" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d="M0 90 C60 85, 100 70, 160 65 C220 60, 260 40, 320 28 C360 20, 380 18, 400 12"
                    fill="none"
                    stroke="#00C805"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    style={{ filter: 'drop-shadow(0 0 8px rgba(0,200,5,0.4))' }}
                  />
                  <motion.path
                    d="M0 90 C60 85, 100 70, 160 65 C220 60, 260 40, 320 28 C360 20, 380 18, 400 12 V120 H0 Z"
                    fill="url(#glow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1 }}
                  />
                </motion.svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <StickyPhone />
    </main>
  );
}
