'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gauge, TrendingUp, TrendingDown, Activity, BarChart2, Users, Zap, AlertTriangle, Shield } from 'lucide-react';

const moodScore = 68; // 0-100 scale
const moodHistory = [45, 52, 48, 55, 62, 58, 65, 68];

const indicators = [
  { name: 'VIX (Fear Index)', value: 14.2, signal: 'Greed', score: 75, desc: 'Low volatility = Complacency' },
  { name: 'Put/Call Ratio', value: 0.82, signal: 'Neutral', score: 55, desc: 'Slightly more calls than puts' },
  { name: 'FII Flow', value: '+₹3,530 Cr', signal: 'Greed', score: 80, desc: 'Strong foreign buying' },
  { name: 'Advance/Decline', value: '1,245 / 756', signal: 'Greed', score: 70, desc: 'More stocks advancing' },
  { name: 'New Highs/Lows', value: '89 / 12', signal: 'Greed', score: 85, desc: 'Many stocks at 52-week highs' },
  { name: 'Market Breadth', value: '62%', signal: 'Greed', score: 65, desc: 'Majority above 200 DMA' },
  { name: 'Sector Momentum', value: '5/7 Green', signal: 'Greed', score: 72, desc: '5 sectors positive' },
];

const getMoodLabel = (score: number) => {
  if (score <= 20) return { label: 'Extreme Fear', color: 'text-red-500', bg: 'bg-red-500/100' };
  if (score <= 40) return { label: 'Fear', color: 'text-[#00C076]', bg: 'bg-[#00C076]' };
  if (score <= 60) return { label: 'Neutral', color: 'text-yellow-500', bg: 'bg-yellow-500/100' };
  if (score <= 80) return { label: 'Greed', color: 'text-lime-500', bg: 'bg-lime-500' };
  return { label: 'Extreme Greed', color: 'text-[#00C076]', bg: 'bg-[#00C076]/100' };
};

const mood = getMoodLabel(moodScore);

export default function MoodPage() {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(moodScore), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/mood" className="text-white font-medium">Market Mood</Link>
              <Link href="/news" className="text-slate-400 hover:text-white">News</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-3"><Gauge className="w-8 h-8 text-[#00C076]" />Market Mood Meter</h1>
          <p className="text-slate-400 mt-1">Real-time sentiment analysis of Indian markets</p>
        </div>

        <div className="bg-[#141820] rounded-2xl p-8 border border-white/5 mb-8">
          <div className="flex flex-col items-center">
            {/* Gauge */}
            <div className="relative w-72 h-40 mb-6">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                {/* Background arc */}
                <path d="M 20 90 A 70 70 0 0 1 180 90" fill="none" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
                {/* Gradient arc segments */}
                <path d="M 20 90 A 70 70 0 0 1 52 35" fill="none" stroke="#ef4444" strokeWidth="16" strokeLinecap="round" />
                <path d="M 52 35 A 70 70 0 0 1 100 20" fill="none" stroke="#f97316" strokeWidth="16" strokeLinecap="round" />
                <path d="M 100 20 A 70 70 0 0 1 148 35" fill="none" stroke="#eab308" strokeWidth="16" strokeLinecap="round" />
                <path d="M 148 35 A 70 70 0 0 1 180 90" fill="none" stroke="#22c55e" strokeWidth="16" strokeLinecap="round" />
                {/* Needle */}
                <line 
                  x1="100" y1="90" 
                  x2={100 + 55 * Math.cos((180 - animatedScore * 1.8) * Math.PI / 180)} 
                  y2={90 - 55 * Math.sin((180 - animatedScore * 1.8) * Math.PI / 180)} 
                  stroke="white" strokeWidth="3" strokeLinecap="round"
                  style={{ transition: 'all 1s ease-out' }}
                />
                <circle cx="100" cy="90" r="8" fill="white" />
              </svg>
              <div className="absolute bottom-0 left-0 text-xs text-red-500">Fear</div>
              <div className="absolute bottom-0 right-0 text-xs text-[#00C076]">Greed</div>
            </div>

            <div className={`text-5xl font-bold ${mood.color} mb-2`}>{moodScore}</div>
            <div className={`text-2xl font-semibold ${mood.color}`}>{mood.label}</div>
            <div className="text-slate-500 text-sm mt-2">Updated: 2 min ago</div>
          </div>

          <div className="grid grid-cols-5 gap-4 mt-8 text-center text-xs">
            {['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'].map((label, i) => (
              <div key={i}>
                <div className={`h-2 rounded-full mb-1 ${['bg-red-500/100', 'bg-[#00C076]', 'bg-yellow-500/100', 'bg-lime-500', 'bg-[#00C076]/100'][i]}`}></div>
                <span className="text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-[#00C076]" />Mood History (7 Days)</h3>
            <div className="flex items-end justify-between h-32 gap-2">
              {moodHistory.map((score, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className={`w-full rounded-t ${getMoodLabel(score).bg}`} style={{ height: `${score}%` }}></div>
                  <span className="text-xs text-slate-500 mt-1">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" />What This Means</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3"><Shield className="w-5 h-5 text-lime-500 mt-0.5" /><div><span className="text-white font-medium">Greed Territory</span><p className="text-slate-400">Markets are optimistic. Consider taking profits on winners.</p></div></div>
              <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" /><div><span className="text-white font-medium">Caution</span><p className="text-slate-400">When everyone is greedy, smart money starts selling.</p></div></div>
              <div className="flex items-start gap-3"><TrendingUp className="w-5 h-5 text-[#00C076] mt-0.5" /><div><span className="text-white font-medium">Trend</span><p className="text-slate-400">Mood rising for 5 days. Watch for reversal signs.</p></div></div>
            </div>
          </div>
        </div>

        <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
          <div className="p-4 border-b border-white/5"><h3 className="font-semibold text-white flex items-center gap-2"><BarChart2 className="w-5 h-5 text-purple-400" />Contributing Indicators</h3></div>
          <div className="divide-y divide-white/5">
            {indicators.map((ind, i) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-[#0D1117]/5">
                <div className="flex-1">
                  <div className="font-medium text-white">{ind.name}</div>
                  <div className="text-sm text-slate-500">{ind.desc}</div>
                </div>
                <div className="text-right mr-6">
                  <div className="text-white font-semibold">{ind.value}</div>
                  <div className={`text-sm ${ind.signal === 'Greed' ? 'text-[#00C076]' : ind.signal === 'Fear' ? 'text-red-400' : 'text-yellow-400'}`}>{ind.signal}</div>
                </div>
                <div className="w-32">
                  <div className="h-2 bg-[#0D1117]/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${getMoodLabel(ind.score).bg}`} style={{ width: `${ind.score}%` }}></div>
                  </div>
                  <div className="text-xs text-slate-500 text-right mt-1">{ind.score}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
