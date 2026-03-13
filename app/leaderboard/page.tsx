'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Medal, TrendingUp, Users, Crown, Flame, Target, Award } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'TraderKing', avatar: '👑', returns: 847.2, winRate: 78, trades: 156, streak: 12, badge: 'Diamond' },
  { rank: 2, name: 'NiftyNinja', avatar: '🥷', returns: 623.5, winRate: 72, trades: 203, streak: 8, badge: 'Platinum' },
  { rank: 3, name: 'OptionsMaster', avatar: '🎯', returns: 512.8, winRate: 69, trades: 89, streak: 5, badge: 'Gold' },
  { rank: 4, name: 'BullRunner', avatar: '🐂', returns: 445.3, winRate: 65, trades: 178, streak: 4, badge: 'Gold' },
  { rank: 5, name: 'SwingTrader99', avatar: '📊', returns: 398.7, winRate: 63, trades: 134, streak: 3, badge: 'Silver' },
  { rank: 6, name: 'ScalpKing', avatar: '⚡', returns: 356.2, winRate: 71, trades: 445, streak: 6, badge: 'Silver' },
  { rank: 7, name: 'TrendFollower', avatar: '📈', returns: 312.9, winRate: 58, trades: 98, streak: 2, badge: 'Silver' },
  { rank: 8, name: 'RiskManager', avatar: '🛡️', returns: 289.4, winRate: 67, trades: 67, streak: 4, badge: 'Bronze' },
  { rank: 9, name: 'MomentumPro', avatar: '🚀', returns: 267.1, winRate: 61, trades: 189, streak: 1, badge: 'Bronze' },
  { rank: 10, name: 'PatientTrader', avatar: '🧘', returns: 234.5, winRate: 74, trades: 34, streak: 7, badge: 'Bronze' },
];

const timeframes = ['Today', 'This Week', 'This Month', 'All Time'];
const categories = ['Returns', 'Win Rate', 'Streak', 'Most Trades'];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState('This Week');
  const [category, setCategory] = useState('Returns');

  const getBadgeColor = (badge: string) => {
    switch(badge) {
      case 'Diamond': return 'from-cyan-400 to-blue-500';
      case 'Platinum': return 'from-slate-300 to-slate-500';
      case 'Gold': return 'from-yellow-400 to-[#00C076]';
      case 'Silver': return 'from-slate-400 to-slate-600';
      default: return 'from-[#00C076] to-[#007a4f]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/leaderboard" className="text-white font-medium">Leaderboard</Link>
              <Link href="/contests" className="text-slate-400 hover:text-white">Contests</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-b from-yellow-500/10 to-transparent py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-yellow-500 mb-4">
            <Trophy className="w-6 h-6" />
            <span className="font-medium">Leaderboard</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Top Traders</h1>
          <p className="text-slate-400 text-lg">Compete with the best paper traders in India</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8 justify-between">
          <div className="flex gap-2">
            {timeframes.map(t => (
              <button key={t} onClick={() => setTimeframe(t)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${timeframe === t ? 'bg-yellow-500 text-black font-medium' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{t}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${category === c ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400 hover:text-white'}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {leaderboardData.slice(0, 3).map((trader, i) => (
            <div key={trader.rank} className={`relative rounded-2xl p-6 ${i === 0 ? 'bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border-yellow-500/30' : i === 1 ? 'bg-gradient-to-br from-slate-400/20 to-slate-600/10 border-slate-400/30' : 'bg-gradient-to-br from-[#00C076]/20 to-[#007a4f]/10 border-orange-600/30'} border`}>
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-gradient-to-br ${i === 0 ? 'from-yellow-400 to-[#00C076]' : i === 1 ? 'from-slate-300 to-slate-500' : 'from-[#00C076] to-orange-700'} flex items-center justify-center text-xl font-bold text-black">
                {i === 0 ? <Crown className="w-6 h-6" /> : i + 1}
              </div>
              <div className="text-4xl mb-4">{trader.avatar}</div>
              <h3 className="text-xl font-bold text-white mb-1">{trader.name}</h3>
              <div className={`inline-block px-2 py-0.5 rounded text-xs bg-gradient-to-r ${getBadgeColor(trader.badge)} text-white mb-4`}>{trader.badge}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><div className="text-2xl font-bold text-emerald-400">+{trader.returns}%</div><div className="text-xs text-slate-500">Returns</div></div>
                <div><div className="text-2xl font-bold text-white">{trader.winRate}%</div><div className="text-xs text-slate-500">Win Rate</div></div>
                <div><div className="text-lg font-semibold text-white">{trader.trades}</div><div className="text-xs text-slate-500">Trades</div></div>
                <div><div className="text-lg font-semibold text-[#00C076] flex items-center gap-1"><Flame className="w-4 h-4" />{trader.streak}</div><div className="text-xs text-slate-500">Streak</div></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-white/5"><th className="px-6 py-4 text-left text-sm text-slate-500">Rank</th><th className="px-6 py-4 text-left text-sm text-slate-500">Trader</th><th className="px-6 py-4 text-right text-sm text-slate-500">Returns</th><th className="px-6 py-4 text-right text-sm text-slate-500 hidden md:table-cell">Win Rate</th><th className="px-6 py-4 text-right text-sm text-slate-500 hidden md:table-cell">Trades</th><th className="px-6 py-4 text-right text-sm text-slate-500">Streak</th></tr></thead>
            <tbody>
              {leaderboardData.map((trader) => (
                <tr key={trader.rank} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4"><span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${trader.rank <= 3 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/5 text-slate-400'}`}>{trader.rank}</span></td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="text-2xl">{trader.avatar}</span><div><div className="font-medium text-white">{trader.name}</div><div className={`text-xs px-2 py-0.5 rounded inline-block bg-gradient-to-r ${getBadgeColor(trader.badge)} text-white`}>{trader.badge}</div></div></div></td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-semibold">+{trader.returns}%</td>
                  <td className="px-6 py-4 text-right text-white hidden md:table-cell">{trader.winRate}%</td>
                  <td className="px-6 py-4 text-right text-slate-400 hidden md:table-cell">{trader.trades}</td>
                  <td className="px-6 py-4 text-right"><span className="flex items-center justify-end gap-1 text-[#00C076]"><Flame className="w-4 h-4" />{trader.streak}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-[#00C076]/20 to-yellow-500/20 rounded-xl border border-[#00C076]/30 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Want to be on the leaderboard?</h3>
          <p className="text-slate-300 mb-4">Start paper trading and climb the ranks!</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-[#00C076] hover:bg-[#00a865] text-white rounded-xl font-semibold transition-colors">Start Trading</Link>
        </div>
      </main>
    </div>
  );
}
