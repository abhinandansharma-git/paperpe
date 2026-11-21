'use client';

import Link from 'next/link';
import { Calendar, Sun, Cloud, CloudRain, Zap, AlertTriangle, CheckCircle, XCircle, Clock, TrendingUp, BarChart2, Shield } from 'lucide-react';

const todayScore = 78; // 0-100
const todayVerdict = 'Good'; // Great, Good, Okay, Risky, Avoid

const factors = [
  { name: 'Day of Week', value: 'Monday', score: 65, icon: Calendar, note: 'Mondays can be choppy after weekend gap' },
  { name: 'Volatility (VIX)', value: '14.2 (Low)', score: 85, icon: BarChart2, note: 'Low VIX = smooth trends, good for directional' },
  { name: 'Global Cues', value: 'Positive', score: 90, icon: TrendingUp, note: 'US markets closed green, Asia positive' },
  { name: 'FII Activity', value: 'Buying', score: 80, icon: Zap, note: 'FIIs net buyers = bullish undertone' },
  { name: 'Major Events', value: 'None', score: 95, icon: Shield, note: 'No RBI, no expiry, no major news' },
  { name: 'Gap Opening', value: '0.3% Up', score: 75, icon: Sun, note: 'Small gap = tradeable, not too volatile' },
];

const weekOutlook = [
  { day: 'Mon', date: '2 Mar', score: 78, verdict: 'Good', events: [] },
  { day: 'Tue', date: '3 Mar', score: 82, verdict: 'Good', events: [] },
  { day: 'Wed', date: '4 Mar', score: 60, verdict: 'Okay', events: ['RBI Minutes'] },
  { day: 'Thu', date: '5 Mar', score: 45, verdict: 'Risky', events: ['Weekly Expiry'] },
  { day: 'Fri', date: '6 Mar', score: 70, verdict: 'Good', events: [] },
];

const tips = [
  { type: 'do', text: 'Trade with trend - momentum is strong' },
  { type: 'do', text: 'Use tight stop losses - low VIX means small moves' },
  { type: 'do', text: 'Focus on Bank Nifty - FII buying in banking' },
  { type: 'dont', text: 'Avoid overnight positions before Wednesday RBI' },
  { type: 'dont', text: 'Skip trading Thursday expiry unless experienced' },
];

const getVerdictStyle = (verdict: string) => {
  switch(verdict) {
    case 'Great': return { bg: 'bg-[#00C076]/100', text: 'text-[#00C076]', icon: '☀️' };
    case 'Good': return { bg: 'bg-lime-500', text: 'text-lime-500', icon: '🌤️' };
    case 'Okay': return { bg: 'bg-yellow-500/100', text: 'text-yellow-500', icon: '⛅' };
    case 'Risky': return { bg: 'bg-[#00C076]', text: 'text-[#00C076]', icon: '🌧️' };
    case 'Avoid': return { bg: 'bg-red-500/100', text: 'text-red-500', icon: '⛈️' };
    default: return { bg: 'bg-slate-500', text: 'text-neutral-500', icon: '❓' };
  }
};

const style = getVerdictStyle(todayVerdict);

export default function TodayPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="text-neutral-500 text-sm">Monday, March 2, 2026</div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mt-2">Should You Trade Today?</h1>
        </div>

        {/* Main Verdict Card */}
        <div className="bg-neutral-50 rounded-2xl p-8 border border-neutral-200 mb-8 text-center">
          <div className="text-7xl mb-4">{style.icon}</div>
          <div className={`text-6xl font-bold ${style.text} mb-2`}>{todayScore}</div>
          <div className={`text-3xl font-semibold ${style.text} mb-4`}>{todayVerdict} Day to Trade</div>
          <p className="text-neutral-500 max-w-lg mx-auto">Markets are favorable today. Low volatility, positive global cues, and no major events make this a good day for directional trades.</p>
          
          <div className="flex justify-center gap-8 mt-8">
            <div className="text-center"><div className="text-2xl font-bold text-neutral-900">9:15 AM</div><div className="text-xs text-neutral-500">Market Opens</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-[#00C076]">Bullish</div><div className="text-xs text-neutral-500">Expected Bias</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-neutral-900">Low</div><div className="text-xs text-neutral-500">Risk Level</div></div>
          </div>
        </div>

        {/* Factors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {factors.map((factor, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <factor.icon className="w-5 h-5 text-neutral-500" />
                  <span className="text-sm text-neutral-500">{factor.name}</span>
                </div>
                <span className={`text-sm font-bold ${factor.score >= 70 ? 'text-[#00C076]' : factor.score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{factor.score}</span>
              </div>
              <div className="text-xl font-semibold text-neutral-900 mb-2">{factor.value}</div>
              <div className="text-xs text-neutral-500">{factor.note}</div>
              <div className="mt-3 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${factor.score >= 70 ? 'bg-[#00C076]/100' : factor.score >= 50 ? 'bg-yellow-500/100' : 'bg-red-500/100'}`} style={{ width: `${factor.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Week Outlook */}
        <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 mb-8">
          <h3 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#00C076]" />This Week's Outlook</h3>
          <div className="grid grid-cols-5 gap-3">
            {weekOutlook.map((day, i) => {
              const dayStyle = getVerdictStyle(day.verdict);
              return (
                <div key={i} className={`p-4 rounded-xl text-center ${i === 0 ? 'bg-neutral-100 ring-2 ring-white/20' : 'bg-neutral-100'}`}>
                  <div className="text-xs text-neutral-500">{day.day}</div>
                  <div className="text-sm text-neutral-500 mb-2">{day.date}</div>
                  <div className="text-2xl mb-1">{dayStyle.icon}</div>
                  <div className={`text-lg font-bold ${dayStyle.text}`}>{day.score}</div>
                  <div className={`text-xs ${dayStyle.text}`}>{day.verdict}</div>
                  {day.events.length > 0 && <div className="text-xs text-orange-400 mt-2">{day.events[0]}</div>}
                </div>
              );
            })}          </div>
        </div>

        {/* Tips */}
        <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-4">Today's Trading Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-[#00C076] text-sm font-medium mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" />DO</div>
              <div className="space-y-2">
                {tips.filter(t => t.type === 'do').map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm"><span className="text-[#00C076] mt-1">✓</span><span className="text-neutral-600">{tip.text}</span></div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-red-400 text-sm font-medium mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" />DON'T</div>
              <div className="space-y-2">
                {tips.filter(t => t.type === 'dont').map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm"><span className="text-red-400 mt-1">✗</span><span className="text-neutral-600">{tip.text}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
