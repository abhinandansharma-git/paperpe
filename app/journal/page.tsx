'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Plus, Calendar, TrendingUp, TrendingDown, Tag, MessageSquare, Image, Filter, Download } from 'lucide-react';

const journalEntries = [
  { id: 1, date: '02 Mar 2026', symbol: 'NIFTY 22400 CE', type: 'BUY', entry: 145, exit: 198, qty: 50, pnl: 2650, pnlPct: 36.5, tags: ['Breakout', 'ORB'], notes: 'Clean breakout above 22350. Entered on retest. Target hit in 45 mins.', emotion: 'confident', rating: 5 },
  { id: 2, date: '02 Mar 2026', symbol: 'BANKNIFTY 47800 PE', type: 'SELL', entry: 220, exit: 185, qty: 25, pnl: 875, pnlPct: 15.9, tags: ['Mean Reversion'], notes: 'Sold premium expecting theta decay. Worked well.', emotion: 'calm', rating: 4 },
  { id: 3, date: '01 Mar 2026', symbol: 'RELIANCE', type: 'BUY', entry: 2845, exit: 2812, qty: 10, pnl: -330, pnlPct: -1.2, tags: ['Swing', 'Support'], notes: 'Support broke. Should have waited for confirmation. Lesson learned.', emotion: 'frustrated', rating: 2 },
  { id: 4, date: '01 Mar 2026', symbol: 'TATASTEEL', type: 'BUY', entry: 142, exit: 156, qty: 100, pnl: 1400, pnlPct: 9.8, tags: ['Momentum', 'Sector'], notes: 'Metal sector strong. Followed sector momentum.', emotion: 'confident', rating: 4 },
  { id: 5, date: '28 Feb 2026', symbol: 'NIFTY 22200 PE', type: 'BUY', entry: 95, exit: 78, qty: 75, pnl: -1275, pnlPct: -17.8, tags: ['Reversal'], notes: 'Tried to catch falling knife. Bad idea. Wait for confirmation next time.', emotion: 'anxious', rating: 1 },
];

const emotionEmoji: Record<string, string> = { confident: '😎', calm: '😌', anxious: '😰', frustrated: '😤', neutral: '😐' };

export default function JournalPage() {
  const [entries] = useState(journalEntries);
  const totalPnl = entries.reduce((sum, e) => sum + e.pnl, 0);
  const winRate = (entries.filter(e => e.pnl > 0).length / entries.length * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/alerts" className="text-slate-400 hover:text-white">Alerts</Link>
              <Link href="/journal" className="text-white font-medium">Journal</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3"><BookOpen className="w-8 h-8 text-purple-500" />Trade Journal</h1>
            <p className="text-slate-400 mt-1">Track, analyze, and improve your trading</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#0D1117]/5 hover:bg-[#0D1117]/10 text-white rounded-lg flex items-center gap-2"><Download className="w-4 h-4" />Export</button>
            <button className="px-5 py-2 bg-purple-500/100 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />Add Entry</button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
            <div className="text-sm text-slate-500 mb-1">Total P&L</div>
            <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString()}</div>
          </div>
          <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
            <div className="text-sm text-slate-500 mb-1">Win Rate</div>
            <div className="text-2xl font-bold text-white">{winRate}%</div>
          </div>
          <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
            <div className="text-sm text-slate-500 mb-1">Total Trades</div>
            <div className="text-2xl font-bold text-white">{entries.length}</div>
          </div>
          <div className="bg-[#141820] rounded-xl p-5 border border-white/5">
            <div className="text-sm text-slate-500 mb-1">Avg Rating</div>
            <div className="text-2xl font-bold text-yellow-400">{(entries.reduce((s,e) => s + e.rating, 0) / entries.length).toFixed(1)} ⭐</div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 bg-[#0D1117]/10 text-white rounded-lg flex items-center gap-2"><Filter className="w-4 h-4" />Filter</button>
          <button className="px-4 py-2 bg-[#0D1117]/5 text-slate-400 rounded-lg">All</button>
          <button className="px-4 py-2 bg-[#0D1117]/5 text-slate-400 rounded-lg">Winners</button>
          <button className="px-4 py-2 bg-[#0D1117]/5 text-slate-400 rounded-lg">Losers</button>
          <button className="px-4 py-2 bg-[#0D1117]/5 text-slate-400 rounded-lg">This Week</button>
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-[#141820] rounded-xl p-5 border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${entry.pnl >= 0 ? 'bg-[#00C076]/100/20' : 'bg-red-500/100/20'}`}>
                    {entry.pnl >= 0 ? <TrendingUp className="w-6 h-6 text-[#00C076]" /> : <TrendingDown className="w-6 h-6 text-red-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{entry.symbol}</div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{entry.date}</span>
                      <span className={entry.type === 'BUY' ? 'text-[#00C076]' : 'text-red-400'}>{entry.type}</span>
                      <span>Qty: {entry.qty}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${entry.pnl >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{entry.pnl >= 0 ? '+' : ''}₹{entry.pnl.toLocaleString()}</div>
                  <div className={`text-sm ${entry.pnl >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{entry.pnl >= 0 ? '+' : ''}{entry.pnlPct}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-slate-500 text-sm">Entry: ₹{entry.entry}</span>
                <span className="text-slate-600">→</span>
                <span className="text-slate-500 text-sm">Exit: ₹{entry.exit}</span>
                <span className="text-2xl ml-2">{emotionEmoji[entry.emotion]}</span>
                <div className="flex gap-1 ml-auto">{[1,2,3,4,5].map(s => <span key={s} className={s <= entry.rating ? 'text-yellow-400' : 'text-slate-700'}>★</span>)}</div>
              </div>
              <div className="flex items-center gap-2 mb-3">
                {entry.tags.map((tag, i) => <span key={i} className="px-2 py-1 bg-purple-500/100/20 text-purple-400 rounded text-xs flex items-center gap-1"><Tag className="w-3 h-3" />{tag}</span>)}
              </div>
              <div className="text-slate-300 text-sm bg-[#0D1117]/5 rounded-lg p-3 flex items-start gap-2"><MessageSquare className="w-4 h-4 text-slate-500 mt-0.5" />{entry.notes}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
