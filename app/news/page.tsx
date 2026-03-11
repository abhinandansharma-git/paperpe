'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Clock, TrendingUp, TrendingDown, AlertTriangle, Zap, Globe, Building2, BarChart2 } from 'lucide-react';

const marketBrief = {
  nifty: { value: 22340, change: 0.85, trend: 'up' },
  banknifty: { value: 47650, change: -0.32, trend: 'down' },
  sensex: { value: 73450, change: 0.72, trend: 'up' },
  vix: { value: 14.2, change: -5.2, trend: 'down' },
};

const topNews = [
  { id: 1, time: '2 min ago', title: 'RBI keeps repo rate unchanged at 6.5% for 6th time', source: 'ET', impact: 'positive', sector: 'Banking', summary: 'The central bank maintained status quo on rates, citing inflation concerns. Banking stocks rallied post announcement.' },
  { id: 2, time: '15 min ago', title: 'Reliance announces Q4 results date: April 12', source: 'CNBC', impact: 'neutral', sector: 'Energy', summary: 'Markets await quarterly numbers. Analysts expect strong Jio growth.' },
  { id: 3, time: '32 min ago', title: 'US markets close at record highs overnight', source: 'Bloomberg', impact: 'positive', sector: 'Global', summary: 'S&P 500 up 1.2%, Nasdaq gains 1.5%. Positive cues for Indian markets.' },
  { id: 4, time: '1 hr ago', title: 'IT stocks under pressure as rupee strengthens', source: 'Mint', impact: 'negative', sector: 'IT', summary: 'TCS, Infosys, Wipro down 1-2% as rupee hits 2-month high against dollar.' },
  { id: 5, time: '2 hr ago', title: 'Auto sales data: Maruti reports 12% YoY growth', source: 'BS', impact: 'positive', sector: 'Auto', summary: 'Strong February numbers boost auto sector sentiment.' },
];

const sectorMovers = [
  { name: 'Banking', change: 1.8, top: 'HDFCBANK +2.3%' },
  { name: 'Auto', change: 1.2, top: 'MARUTI +3.1%' },
  { name: 'Metal', change: 0.9, top: 'TATASTEEL +2.8%' },
  { name: 'IT', change: -1.4, top: 'TCS -1.8%' },
  { name: 'Pharma', change: -0.6, top: 'SUNPHARMA -1.2%' },
];

const upcomingEvents = [
  { date: 'Today', event: 'RBI Policy Decision', time: '10:00 AM' },
  { date: 'Mar 5', event: 'NIFTY Monthly Expiry', time: '-' },
  { date: 'Mar 8', event: 'US Jobs Report', time: '7:00 PM' },
  { date: 'Mar 12', event: 'CPI Inflation Data', time: '5:30 PM' },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/news" className="text-white font-medium">News</Link>
              <Link href="/screener" className="text-slate-400 hover:text-white">Screener</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Newspaper className="w-8 h-8 text-blue-500" />Market News</h1>
          <p className="text-slate-400 mt-1">Stay updated with market-moving events</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {Object.entries(marketBrief).map(([key, data]) => (
            <div key={key} className="bg-[#141820] rounded-xl p-4 border border-white/5">
              <div className="text-sm text-slate-500 uppercase mb-1">{key}</div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-bold text-white">{data.value.toLocaleString()}</span>
                <span className={`flex items-center gap-1 text-sm ${data.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {data.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {data.change >= 0 ? '+' : ''}{data.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-500" />Latest News</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">All</button>
                <button className="px-3 py-1 bg-white/5 text-slate-400 rounded text-sm">Stocks</button>
                <button className="px-3 py-1 bg-white/5 text-slate-400 rounded text-sm">Global</button>
              </div>
            </div>
            {topNews.map((news) => (
              <div key={news.id} className="bg-[#141820] rounded-xl p-5 border border-white/5 hover:border-blue-500/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${news.impact === 'positive' ? 'bg-emerald-400' : news.impact === 'negative' ? 'bg-red-400' : 'bg-slate-400'}`}></div>
                    <span className="px-2 py-0.5 bg-white/10 rounded text-xs text-slate-400">{news.sector}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" />{news.time}</span>
                  </div>
                  <span className="text-xs text-slate-600">{news.source}</span>
                </div>
                <h3 className="text-white font-medium mb-2">{news.title}</h3>
                <p className="text-sm text-slate-400">{news.summary}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-purple-400" />Sector Performance</h3>
              <div className="space-y-3">
                {sectorMovers.map((sector, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-300">{sector.name}</span>
                    <div className="text-right">
                      <div className={`font-medium ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{sector.change >= 0 ? '+' : ''}{sector.change}%</div>
                      <div className="text-xs text-slate-500">{sector.top}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" />Upcoming Events</h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-12 text-center">
                      <div className="text-xs text-slate-500">{event.date}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm">{event.event}</div>
                      {event.time !== '-' && <div className="text-xs text-slate-500">{event.time}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-5 border border-blue-500/30">
              <h3 className="font-semibold text-white mb-2">Morning Brief</h3>
              <p className="text-sm text-slate-300 mb-4">Get daily market summary at 8:30 AM</p>
              <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm">Enable Notifications</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
