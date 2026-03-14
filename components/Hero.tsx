'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, type Variants, type Easing } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// ── Floating ambient particles ──
const PARTICLES = [
  '₹', '%', 'NIFTY', '+0.4%', '22,450', 'BANKNIFTY', '+182', '-0.6%',
  '₹', 'F&O', '+1.2%', '48,200', '₹', 'MCX', '-0.3%', 'GOLD',
  '+0.8%', '₹', 'CRUDE', '22,180', '+240', '₹', '%', 'NSE',
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((text, i) => (
        <motion.span
          key={i}
          className="absolute text-xs font-mono select-none"
          style={{
            left: `${(i * 4.1 + 2) % 96}%`,
            color: i % 3 === 0 ? '#00C076' : '#475569',
            opacity: 0.07 + (i % 4) * 0.02,
            fontSize: i % 5 === 0 ? '11px' : '10px',
          }}
          initial={{ y: '110vh' }}
          animate={{ y: '-10vh' }}
          transition={{
            duration: 18 + (i % 14),
            repeat: Infinity,
            delay: (i * 1.3) % 16,
            ease: 'linear',
          }}
        >
          {text}
        </motion.span>
      ))}
    </div>
  );
}

// ── Candlestick canvas background ──
function CandlestickCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const candles = Array.from({ length: 14 }, (_, i) => ({
      x: (canvas.width / 14) * i + 30,
      open: 120 + Math.random() * 200,
      close: 120 + Math.random() * 200,
      high: 0,
      low: 0,
      width: 18,
      progress: 0,
      delay: i * 0.08,
    })).map(c => ({
      ...c,
      high: Math.max(c.open, c.close) + 20 + Math.random() * 40,
      low: Math.min(c.open, c.close) - 20 - Math.random() * 40,
    }));

    let startTime: number | null = null;
    let raf: number;

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      candles.forEach(c => {
        const p = Math.min(1, Math.max(0, (elapsed - c.delay) / 1.2));
        if (p <= 0) return;

        const isGreen = c.close >= c.open;
        const color = isGreen ? 'rgba(0,192,118,0.18)' : 'rgba(255,68,68,0.14)';
        const wickColor = isGreen ? 'rgba(0,192,118,0.12)' : 'rgba(255,68,68,0.10)';
        const top = Math.min(c.open, c.close);
        const bottom = Math.max(c.open, c.close);
        const bodyH = (bottom - top) * p;

        // wick
        ctx.strokeStyle = wickColor;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(c.x + c.width / 2, canvas.height - c.high * 0.6);
        ctx.lineTo(c.x + c.width / 2, canvas.height - c.low * 0.6);
        ctx.stroke();

        // body
        ctx.fillStyle = color;
        ctx.fillRect(
          c.x,
          canvas.height - (top + bottom - top * (1 - p)) * 0.6,
          c.width,
          bodyH * 0.6
        );
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}

// ── Animated counter ──
function Counter({ target, prefix = '', suffix = '' }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const steps = 40;
    const inc = target / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(cur));
    }, 40);
    return () => clearInterval(timer);
  }, [target]);
  return <>{prefix}{count.toLocaleString('en-IN')}{suffix}</>;
}

// ── Word-by-word animation ──
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' as Easing },
  }),
};

function AnimatedHeadline() {
  const line1 = ['Test', 'your', 'algos.'];
  const line2 = ['Not', 'your', 'savings.'];

  return (
    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
      <div className="flex flex-wrap justify-center gap-x-4 mb-2">
        {line1.map((word, i) => (
          <motion.span key={word} custom={i} initial="hidden" animate="visible" variants={wordVariants}>
            {word}
          </motion.span>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-x-4">
        {line2.map((word, i) => (
          <motion.span
            key={word}
            custom={line1.length + i}
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </h1>
  );
}

// ── Main Hero ──
export default function Hero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center overflow-hidden">
      {/* Candlestick bg */}
      <CandlestickCanvas />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Gradient overlay — bottom fade */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0D1117]" />

      <div className="max-w-6xl mx-auto w-full relative z-10">

        {/* Ticker-style badge */}
        <motion.div
          className="flex justify-center mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C076] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C076]" />
            </span>
            <span className="text-[#00C076] tracking-widest font-semibold">LIVE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Now in Public Beta</span>
          </div>
        </motion.div>

        {/* Headline */}
        <div className="text-center mb-12 space-y-6">
          <AnimatedHeadline />
          <motion.p
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Paper trade with real market data. Perfect your strategy before risking real capital.
          </motion.p>
        </div>

        {/* Email form */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-xl glass focus:glass-strong focus:outline-none focus:ring-2 focus:ring-[#00C076]/40 transition-all duration-200 text-white placeholder:text-slate-500 disabled:opacity-50"
                required
              />
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(0,192,118,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-[#00C076] hover:bg-[#00a866] rounded-xl font-semibold flex items-center gap-2 transition-colors duration-200 disabled:opacity-50 text-black"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Start Free <ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </div>

            {message && (
              <div className={`mt-3 flex items-center justify-center gap-2 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {status === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message}
              </div>
            )}
            {!message && (
              <p className="text-sm text-slate-500 mt-3 text-center">No credit card required. Start in 60 seconds.</p>
            )}
          </form>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="flex justify-center gap-0 mt-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          {[
            { label: 'Capital Saved', value: 1000000, prefix: '₹', suffix: '+' },
            { label: 'Traders', value: 500, prefix: '', suffix: '+' },
            { label: 'Avg Win Rate', value: 65, prefix: '', suffix: '%' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-stretch">
              {i > 0 && <div className="w-px bg-white/10 mx-8 self-stretch" />}
              <div className="text-center">
                <div className="text-2xl font-bold text-white tabular-nums">
                  <Counter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-slate-500 mt-1 tracking-wide uppercase">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
