'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, Clock, Users, Gift, Zap, Target, TrendingUp, Calendar, Award } from 'lucide-react';

const activeContests = [
  { id: 1, name: 'Weekly Options Challenge', prize: '10,000', participants: 234, endsIn: '2d 14h', type: 'Options', difficulty: 'All Levels', image: '🎯' },
  { id: 2, name: 'Intraday Scalping Battle', prize: '5,000', participants: 567, endsIn: '5h 30m', type: 'Intraday', difficulty: 'Advanced', image: '⚡' },
  { id: 3, name: 'Swing Trading Marathon', prize: '15,000', participants: 123, endsIn: '6d 8h', type: 'Swing', difficulty: 'Intermediate', image: '📈' },
];

const upcomingContests = [
  { id: 4, name: 'MCX Crude Challenge', prize: '8,000', startsIn: '3 days', type: 'MCX', difficulty: 'All Levels' },
  { id: 5, name: 'Bank Nifty Weekly', prize: '12,000', startsIn: '5 days', type: 'Index', difficulty: 'Intermediate' },
];

const pastWinners = [
  { contest: 'Options Master Feb', winner: 'TraderKing', prize: '10,000', returns: '+234%' },
  { contest: 'Intraday Sprint', winner: 'ScalpKing', prize: '5,000', returns: '+89%' },
  { contest: 'Monthly Challenge', winner: 'NiftyNinja', prize: '25,000', returns: '+456%' },
];

export default function ContestsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-purple-500/10 to-transparent py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-purple-400 mb-4">
            <Trophy className="w-6 h-6" />
            <span className="font-medium">Trading Contests</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">Win Real Prizes</h1>
          <p className="text-neutral-500 text-lg max-w-2xl mx-auto">Compete in paper trading contests, prove your skills, and win cash prizes - all without risking real money!</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[{ icon: Trophy, label: 'Total Prizes', value: '₹2.5L+', color: 'text-yellow-500' },
            { icon: Users, label: 'Participants', value: '5,000+', color: 'text-[#00C076]' },
            { icon: Award, label: 'Contests Held', value: '50+', color: 'text-purple-400' },
            { icon: Gift, label: 'Winners', value: '500+', color: 'text-[#00C076]' }].map((stat, i) => (
            <div key={i} className="bg-neutral-50 rounded-xl p-5 border border-neutral-200">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
              <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
              <div className="text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"><Zap className="w-6 h-6 text-yellow-500" />Active Contests</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {activeContests.map((contest) => (
            <div key={contest.id} className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden group hover:border-purple-500/50 transition-all">
              <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-5xl">{contest.image}</div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 rounded text-xs bg-purple-500/100/20 text-purple-400">{contest.type}</span>
                  <span className="px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-500">{contest.difficulty}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 group-hover:text-purple-400 transition-colors">{contest.name}</h3>
                <div className="flex items-center justify-between text-sm mb-4">
                  <div className="flex items-center gap-1 text-neutral-500"><Users className="w-4 h-4" />{contest.participants}</div>
                  <div className="flex items-center gap-1 text-orange-400"><Clock className="w-4 h-4" />{contest.endsIn}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div><div className="text-xs text-neutral-500">Prize Pool</div><div className="text-xl font-bold text-[#00C076]">₹{contest.prize}</div></div>
                  <button className="px-4 py-2 bg-purple-500/100 hover:bg-purple-600 text-neutral-900 rounded-lg font-medium transition-colors">Join Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"><Calendar className="w-6 h-6 text-[#00C076]" />Upcoming Contests</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {upcomingContests.map((contest) => (
            <div key={contest.id} className="bg-neutral-50 rounded-xl p-5 border border-neutral-200 flex items-center justify-between hover:border-[#00C076]/30 transition-all">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 rounded text-xs bg-[#00C076]/20 text-[#00C076]">{contest.type}</span>
                  <span className="px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-500">{contest.difficulty}</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900">{contest.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-[#00C076] font-medium">₹{contest.prize} prize</span>
                  <span className="text-neutral-500">Starts in {contest.startsIn}</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 rounded-lg font-medium transition-colors">Remind Me</button>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"><Award className="w-6 h-6 text-yellow-500" />Recent Winners</h2>
        <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-neutral-200"><th className="px-6 py-4 text-left text-sm text-neutral-500">Contest</th><th className="px-6 py-4 text-left text-sm text-neutral-500">Winner</th><th className="px-6 py-4 text-right text-sm text-neutral-500">Prize</th><th className="px-6 py-4 text-right text-sm text-neutral-500">Returns</th></tr></thead>
            <tbody>
              {pastWinners.map((w, i) => (
                <tr key={i} className="border-b border-neutral-200"><td className="px-6 py-4 text-neutral-900">{w.contest}</td><td className="px-6 py-4"><span className="flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-500" /><span className="text-neutral-900 font-medium">{w.winner}</span></span></td><td className="px-6 py-4 text-right text-[#00C076] font-semibold">₹{w.prize}</td><td className="px-6 py-4 text-right text-[#00C076]">{w.returns}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 text-center">
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">Host Your Own Contest</h3>
          <p className="text-neutral-600 mb-6 max-w-xl mx-auto">Want to create a private contest for your trading community or friends? Upgrade to Pro!</p>
          <Link href="/#pricing" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">Upgrade to Pro</Link>
        </div>
      </main>
    </div>
  );
}
