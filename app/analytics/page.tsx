'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, TrendingDown, Target, Clock, Calendar, PieChart, Activity, Award, Zap } from 'lucide-react';

const monthlyData = [12, 8, -5, 15, 22, -3, 18, 25, 10, -8, 30, 28];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const tradesByInstrument = [
  { name: 'NIFTY', trades: 45, winRate: 67, pnl: 23400 },
  { name: 'BANKNIFTY', trades: 32, winRate: 72, pnl: 18500 },
  { name: 'FINNIFTY', trades: 18, winRate: 55, pnl: 5200 },
  { name: 'Stocks', trades: 23, winRate: 61, pnl: 8900 },
];

const tradesByTime = [
  { time: '9:15-10:00', trades: 34, winRate: 58 },
  { time: '10:00-11:00', trades: 28, winRate: 71 },
  { time: '11:00-12:00', trades: 15, winRate: 60 },
  { time: '12:00-14:00', trades: 12, winRate: 50 },
  { time: '14:00-15:00', trades: 22, winRate: 68 },
  { time: '15:00-15:30', trades: 7, winRate: 43 },
];

const achievements = [
  { name: 'First Trade', icon: '🎯', earned: true },
  { name: '10 Trades', icon: '📊', earned: true },
  { name: '50% Win Rate', icon: '⚖️', earned: true },
  { name: '5 Day Streak', icon: '🔥', earned: true },
  { name: '100 Trades', icon: '💯', earned: false },
  { name: '70% Win Rate', icon: '🏆', earned: false },
  { name: '₹50K Profit', icon: '💰', earned: false },
  { name: '30 Day Streak', icon: '⭐', earned: false },
];

export default function AnalyticsPage() {
  const maxPnl = Math.max(...monthlyData.map(Math.abs));

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/analytics" className="text-white font-medium">Analytics</Link>
              <Link href="/leaderboard" className="text-slate-400 hover:text-white">Leaderboard</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Trading Analytics</h1>
            <p className="text-slate-400">Deep insights into your trading performance</p>
          </div>
          <select className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[{ icon: TrendingUp, label: 'Total P&L', value: '+₹56,000', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { icon: Target, label: 'Win Rate', value: '64.5%', color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { icon: Activity, label: 'Total Trades', value: '118', color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { icon: Zap, label: 'Best Streak', value: '12 days', color: 'text-orange-400', bg: 'bg-orange-500/10' }].map((stat, i) => (
            <div key={i} className="bg-[#141820] rounded-xl p-5 border border-white/5">
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-blue-400" />Monthly P&L</h3>
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((pnl, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end h-40">
                    <div className={`w-full rounded-t ${pnl >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ height: `${(Math.abs(pnl) / maxPnl) * 100}%` }}></div>
                  </div>
                  <span className="text-xs text-slate-500 mt-2">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-400" />By Instrument</h3>
            <div className="space-y-4">
              {tradesByInstrument.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{item.name}</span>
                    <span className={item.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>₹{item.pnl.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.winRate}%` }}></div></div>
                    <span className="text-xs text-slate-500">{item.winRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-orange-400" />Performance by Time</h3>
            <div className="space-y-3">
              {tradesByTime.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-slate-400 text-sm w-24">{item.time}</span>
                  <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden relative">
                    <div className={`h-full rounded-lg ${item.winRate >= 60 ? 'bg-emerald-500/50' : item.winRate >= 50 ? 'bg-yellow-500/50' : 'bg-red-500/50'}`} style={{ width: `${item.winRate}%` }}></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">{item.winRate}% ({item.trades} trades)</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4">💡 Your best hours: 10:00-11:00 AM and 2:00-3:00 PM</p>
          </div>

          <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-yellow-500" />Achievements</h3>
            <div className="grid grid-cols-4 gap-3">
              {achievements.map((ach, i) => (
                <div key={i} className={`p-3 rounded-xl text-center ${ach.earned ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-white/5 border border-white/5 opacity-50'}`}>
                  <div className="text-2xl mb-1">{ach.icon}</div>
                  <div className="text-xs text-slate-400">{ach.name}</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 mt-4">4/8 achievements unlocked</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Export Your Trade Journal</h3>
              <p className="text-slate-300">Download detailed reports in PDF or Excel format</p>
            </div>
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">Export Report</button>
          </div>
        </div>
      </main>
    </div>
  );
}
