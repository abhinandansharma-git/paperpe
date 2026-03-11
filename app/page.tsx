'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, X, Sparkles, TrendingUp, Shield, BarChart3, Calculator, ChevronRight, ChevronDown, Play, Zap, Target, Award, Users, Clock, IndianRupee, LineChart, CandlestickChart, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  
  return { count, ref };
}

const tools = [
  { name: 'Option Calculator', desc: 'Greeks, P&L, breakeven analysis', href: '/calculator', icon: Calculator, color: 'from-violet-500 to-purple-500' },
  { name: 'Position Sizing', desc: 'Risk-based lot calculator', href: '/tools/position-size', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
  { name: 'Brokerage Calculator', desc: 'Compare broker charges', href: '/tools/brokerage', icon: BarChart3, color: 'from-emerald-500 to-green-500' },
  { name: 'Margin Calculator', desc: 'F&O margin requirements', href: '/tools/margin', icon: Shield, color: 'from-orange-500 to-amber-500' },
];

const testimonials = [
  { name: 'Rahul M.', role: 'Options Trader', text: 'Finally a platform that lets me practice without burning money. Lost Rs 50K learning on real markets before this.', avatar: '👨‍💼' },
  { name: 'Priya S.', role: 'Swing Trader', text: 'The indicators are game-changing. ARIA SUPREME paid for itself in the first week.', avatar: '👩‍💻' },
  { name: 'Amit K.', role: 'Day Trader', text: 'Been paper trading for 2 months. My win rate went from 40% to 65% before going live.', avatar: '👨‍🎓' },
];

const faqs = [
  { q: 'Is paper trading really free?', a: 'Yes! Paper trading with Rs 10 Lakh virtual capital is completely free. No credit card required.' },
  { q: 'What markets can I trade?', a: 'NIFTY, BANKNIFTY, FINNIFTY options, and MCX commodities (Gold, Crude, Silver, Natural Gas).' },
  { q: 'Is the data real-time?', a: 'Yes, we use live market data with minimal delay. Your paper trades execute at real market prices.' },
  { q: 'Can I use the indicators without paper trading?', a: 'Absolutely! Our TradingView indicators work independently on any TradingView chart.' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const stat1 = useCounter(10, 1500);
  const stat2 = useCounter(500, 2000);
  const stat3 = useCounter(4, 1000);
  const stat4 = useCounter(65, 1800);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) setSubmitted(true);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-xl z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-blue-500/30">P</motion.div>
            <span className="font-semibold text-xl">PaperPe</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <Link href="/calculator" className="hover:text-blue-500 transition-colors">Tools</Link>
            <Link href="/indicators" className="hover:text-blue-500 transition-colors">Indicators</Link>
            <Link href="/blog" className="hover:text-blue-500 transition-colors">Learn</Link>
            <Link href="/brokers" className="hover:text-blue-500 transition-colors">Brokers</Link>
          </div>
          <Link href="/indicators" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-shadow">Get Indicators</Link>
        </div>
      </motion.nav>

      {/* Hero with Platform Preview */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium">
                  <Sparkles className="w-4 h-4" /> Platform Launching Soon
                </span>
              </motion.div>
              
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Learn to trade
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> without losing money</span>
              </motion.h1>
              
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-gray-500 mb-8 leading-relaxed">
                Practice NIFTY, BANKNIFTY & MCX options with Rs 10 Lakh virtual capital. Make mistakes. Learn. Then go live.
              </motion.p>
              
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                      className="flex-1 px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                    <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className="px-7 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2">
                      {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Join Waitlist <ArrowRight className="w-4 h-4" /></>}
                    </motion.button>
                  </form>
                ) : (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-green-600 text-lg font-medium">
                    <CheckCircle className="w-6 h-6" /> You are on the list!
                  </motion.div>
                )}
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-6 mt-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Free forever</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Real-time data</span>
              </motion.div>
            </div>
            
            {/* Platform Preview */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="relative">
              <div className="bg-[#131722] rounded-2xl p-4 shadow-2xl border border-gray-800">
                {/* Mock trading interface */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-400 text-xs">NIFTY 24,850.25</span>
                </div>
                {/* Fake chart */}
                <div className="h-48 relative mb-4">
                  <svg viewBox="0 0 400 150" className="w-full h-full">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,100 Q50,80 100,90 T200,60 T300,70 T400,30" fill="none" stroke="#22c55e" strokeWidth="2" />
                    <path d="M0,100 Q50,80 100,90 T200,60 T300,70 T400,30 V150 H0 Z" fill="url(#chartGradient)" />
                  </svg>
                  <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +1.25%
                  </div>
                </div>
                {/* Order panel */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium text-sm transition-colors">BUY CE</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium text-sm transition-colors">BUY PE</button>
                </div>
                <div className="mt-3 text-center text-gray-500 text-xs">Paper Trading Mode • Rs 10,00,000 Virtual Capital</div>
              </div>
              {/* Floating badge */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Today P&L</div>
                    <div className="text-sm font-bold text-green-600">+Rs 12,450</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div ref={stat1.ref} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900">Rs {stat1.count}L+</div>
              <div className="text-gray-500 mt-2">Virtual Capital</div>
            </div>
            <div ref={stat2.ref} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900">{stat2.count}+</div>
              <div className="text-gray-500 mt-2">Traders Waiting</div>
            </div>
            <div ref={stat3.ref} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900">{stat3.count}</div>
              <div className="text-gray-500 mt-2">Free Tools</div>
            </div>
            <div ref={stat4.ref} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900">{stat4.count}%</div>
              <div className="text-gray-500 mt-2">Avg. Win Rate Improvement</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-bold">Start in 3 Simple Steps</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Sign Up Free', desc: 'Create your account in 30 seconds. No credit card or KYC required.', icon: Zap },
              { step: '02', title: 'Get Virtual Capital', desc: 'Receive Rs 10 Lakh virtual money to practice trading NIFTY, BANKNIFTY & MCX.', icon: IndianRupee },
              { step: '03', title: 'Trade & Learn', desc: 'Execute trades, track P&L, learn from mistakes - all without risking real money.', icon: Target },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow h-full">
                  <span className="text-6xl font-bold text-gray-100 absolute top-4 right-6">{item.step}</span>
                  <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-300"><ArrowRight /></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">Why Paper Trade?</p>
            <h2 className="text-4xl md:text-5xl font-bold">Learn Without The Pain</h2>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xl">
            <div className="grid grid-cols-3 text-center border-b border-gray-100">
              <div className="p-6"></div>
              <div className="p-6 bg-red-50 border-x border-gray-100">
                <div className="text-red-600 font-bold">Real Trading</div>
                <div className="text-red-400 text-sm">Learning the hard way</div>
              </div>
              <div className="p-6 bg-green-50">
                <div className="text-green-600 font-bold">PaperPe</div>
                <div className="text-green-400 text-sm">Smart way to learn</div>
              </div>
            </div>
            {[
              { feature: 'Cost of mistakes', real: 'Rs 10K - Rs 1L+', paper: 'Rs 0' },
              { feature: 'Emotional stress', real: 'Very High', paper: 'None' },
              { feature: 'Learning speed', real: 'Slow (fear of loss)', paper: 'Fast (freedom to experiment)' },
              { feature: 'Risk of ruin', real: 'Real possibility', paper: 'Zero' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 text-center border-b border-gray-100 last:border-0">
                <div className="p-5 text-gray-700 font-medium text-left pl-8">{row.feature}</div>
                <div className="p-5 text-red-600 border-x border-gray-100 bg-red-50/50">{row.real}</div>
                <div className="p-5 text-green-600 font-medium bg-green-50/50">{row.paper}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">Available Now</p>
            <h2 className="text-4xl md:text-5xl font-bold">Free Trading Tools</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {tools.map((tool, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={tool.href}>
                  <motion.div whileHover={{ y: -8 }} className="group h-full bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{tool.name}</h3>
                    <p className="text-gray-500 text-sm">{tool.desc}</p>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold">Traders Love PaperPe</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{t.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Indicators */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">Premium</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">TradingView Indicators</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">Professional indicators built for Indian markets. Clear signals, no confusion.</p>
              <ul className="space-y-4 mb-8">
                {['ARIA SUPREME - 7 powerful modules', 'Score-based signals (0-100)', 'India market session awareness', 'Works on NIFTY, BANKNIFTY, MCX'].map((f, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-3 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-green-500" />{f}
                  </motion.li>
                ))}
              </ul>
              <Link href="/indicators" className="inline-flex items-center gap-2 text-blue-500 font-semibold group">View all indicators <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Link>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
              <motion.div whileHover={{ y: -5 }} className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-bold text-xl">ARIA SUPREME</span>
                  <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1.5 rounded-full">Flagship</span>
                </div>
                <div className="text-5xl font-bold">Rs 2,999</div>
                <div className="text-gray-400 line-through">Rs 5,999</div>
                <div className="inline-block bg-green-50 text-green-600 text-sm px-3 py-1.5 rounded-full mt-3 font-medium">50% off - Launch Price</div>
                <Link href="/indicators" className="mt-8 block w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-shadow">Buy Now</Link>
                <p className="text-center text-gray-400 text-sm mt-4">One-time payment • Lifetime access</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <p className="text-blue-500 font-semibold text-sm mb-3 tracking-widest uppercase">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold">Common Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full p-6 text-left flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to start?</h2>
          <p className="text-gray-500 text-xl mb-10">Join 500+ traders learning to trade the smart way.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/indicators" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/30">Get Indicators <ArrowRight className="w-5 h-5" /></Link>
            </motion.div>
            <Link href="/calculator" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">Try free tools <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/25">P</div>
                <span className="font-semibold text-lg">PaperPe</span>
              </div>
              <p className="text-gray-500 text-sm">India paper trading platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Tools</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <Link href="/calculator" className="block hover:text-blue-500">Option Calculator</Link>
                <Link href="/tools/position-size" className="block hover:text-blue-500">Position Size</Link>
                <Link href="/tools/brokerage" className="block hover:text-blue-500">Brokerage</Link>
                <Link href="/tools/margin" className="block hover:text-blue-500">Margin</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Learn</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <Link href="/blog" className="block hover:text-blue-500">Blog</Link>
                <Link href="/blog/nifty-options-trading" className="block hover:text-blue-500">Options Guide</Link>
                <Link href="/blog/mcx-trading-beginners" className="block hover:text-blue-500">MCX Guide</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <div className="space-y-3 text-sm text-gray-500">
                <Link href="/indicators" className="block hover:text-blue-500">Indicators</Link>
                <Link href="/brokers" className="block hover:text-blue-500">Brokers</Link>
                <a href="mailto:support@paperpe.in" className="block hover:text-blue-500">Contact</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-400 text-sm">© 2026 PaperPe. Made with love in India</div>
        </div>
      </footer>

      {/* Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed bottom-6 right-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm">
              <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              <div className="flex gap-4">
                <span className="text-4xl">🎯</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">50% Launch Discount!</h3>
                  <p className="text-gray-500 text-sm mb-3">Get ARIA SUPREME at Rs 2,999</p>
                  <Link href="/indicators" onClick={() => setShowPopup(false)} className="text-blue-500 font-semibold text-sm">View indicators →</Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
