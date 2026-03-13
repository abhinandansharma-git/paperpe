'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Star, Gift, ExternalLink, ChevronDown, TrendingUp } from 'lucide-react';

const brokers = [
  {
    name: 'Zerodha',
    logo: '🟢',
    tagline: "India's #1 Discount Broker",
    rating: 4.8,
    users: '1.5Cr+',
    equity: '₹0',
    fno: '₹20/order',
    accountFee: '₹200',
    features: ['Kite - Best trading platform', 'Varsity - Free education', 'Console - Advanced analytics', 'Coin - Direct MF'],
    pros: ['Fastest order execution', 'Best charts & UI', 'Huge community'],
    cons: ['No research reports', 'Basic customer support'],
    best: 'Best Overall',
    color: 'emerald',
    link: 'https://zerodha.com/open-account?c=PAPERPE',
  },
  {
    name: 'Groww',
    logo: '🟠',
    tagline: 'Simplest Investment App',
    rating: 4.6,
    users: '8Cr+',
    equity: '₹0',
    fno: '₹20/order',
    accountFee: '₹0',
    features: ['Super simple UI', 'Stocks + MF + FD', 'UPI instant funding', 'IPO applications'],
    pros: ['Free account opening', 'Great for beginners', 'All-in-one app'],
    cons: ['Limited F&O tools', 'No advanced charts'],
    best: 'Best for Beginners',
    color: 'orange',
    link: 'https://groww.in/open-demat-account?ref=PAPERPE',
  },
  {
    name: 'Angel One',
    logo: '🔵',
    tagline: 'Smart Money with AI',
    rating: 4.5,
    users: '2Cr+',
    equity: '₹0',
    fno: '₹20/order',
    accountFee: '₹0',
    features: ['ARQ Prime - AI recommendations', 'SmartAPI for algo trading', 'Free research reports', 'Margin against shares'],
    pros: ['AI-powered insights', 'Great API for algos', 'Free advisory'],
    cons: ['UI not as polished', 'Occasional glitches'],
    best: 'Best for Algo Trading',
    color: 'blue',
    link: 'https://www.angelone.in/open-demat-account?ref=PAPERPE',
  },
  {
    name: 'Upstox',
    logo: '🟣',
    tagline: 'Trade at Lightning Speed',
    rating: 4.4,
    users: '1Cr+',
    equity: '₹0',
    fno: '₹20/order',
    accountFee: '₹0',
    features: ['Upstox Pro - TradingView charts', 'Advanced options chain', 'Paper trading mode', 'API access'],
    pros: ['TradingView integration', 'Good for options', 'Fast execution'],
    cons: ['Customer support issues', 'App crashes reported'],
    best: 'Best Charts',
    color: 'purple',
    link: 'https://upstox.com/open-account/?ref=PAPERPE',
  },
  {
    name: 'Dhan',
    logo: '⚫',
    tagline: 'Built for Serious Traders',
    rating: 4.6,
    users: '30L+',
    equity: '₹0',
    fno: '₹20/order',
    accountFee: '₹0',
    features: ['Options trading focus', 'Lightning fast execution', 'Advanced order types', 'TV charts built-in'],
    pros: ['Options traders paradise', 'Super fast app', 'Great UX'],
    cons: ['Newer platform', 'Smaller community'],
    best: 'Best for Options',
    color: 'slate',
    link: 'https://dhan.co/open-account/?ref=PAPERPE',
  },
  {
    name: '5Paisa',
    logo: '🔴',
    tagline: 'Lowest Brokerage',
    rating: 4.2,
    users: '50L+',
    equity: '₹0',
    fno: '₹10/order',
    accountFee: '₹0',
    features: ['₹10 flat brokerage', 'Robo advisory', 'Basket orders', 'Margin funding'],
    pros: ['Cheapest F&O trades', 'Good for high volume', 'Margin facility'],
    cons: ['Basic platform', 'Average charts'],
    best: 'Lowest Cost',
    color: 'red',
    link: 'https://www.5paisa.com/open-demat-account?ref=PAPERPE',
  },
];

const colorMap: Record<string, string> = {
  emerald: 'bg-[#00C076]/100/20 text-[#00C076] border-[#00C076]/30',
  orange: 'bg-[#00C076]/20 text-orange-400 border-[#00C076]/30',
  blue: 'bg-[#00C076]/20 text-blue-400 border-[#00C076]/30',
  purple: 'bg-purple-500/100/20 text-purple-400 border-purple-500/30',
  slate: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  red: 'bg-red-500/100/20 text-red-400 border-red-500/30',
};

export default function BrokersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#131722] text-white">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#00C076]">PaperPe</Link>
          <Link href="/dashboard" className="px-4 py-2 bg-[#2962ff] hover:bg-[#1e53e4] text-sm font-medium rounded">Back to Dashboard</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C076]/100/10 text-[#00C076] rounded-full text-sm mb-6">
            <TrendingUp className="w-4 h-4" /> Ready to trade with real money?
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">Choose Your Broker</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">You have practiced. You have learned. Now open a real trading account with India\'s top brokers.</p>
        </div>
      </section>

      {/* Quick Comparison Table */}
      <section className="py-12 px-6 border-b border-white/10 bg-[#1e222d]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4">Broker</th>
                  <th className="text-center py-4 px-4">Rating</th>
                  <th className="text-center py-4 px-4">Users</th>
                  <th className="text-center py-4 px-4">Equity</th>
                  <th className="text-center py-4 px-4">F&O</th>
                  <th className="text-center py-4 px-4">Account Fee</th>
                  <th className="text-center py-4 px-4">Best For</th>
                  <th className="text-right py-4 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => (
                  <tr key={broker.name} className="border-b border-white/5 hover:bg-[#0D1117]/5">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{broker.logo}</span>
                        <div>
                          <div className="font-semibold">{broker.name}</div>
                          <div className="text-xs text-slate-500">{broker.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4"><div className="flex items-center justify-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />{broker.rating}</div></td>
                    <td className="text-center py-4 px-4 text-slate-400">{broker.users}</td>
                    <td className="text-center py-4 px-4 text-[#00C076]">{broker.equity}</td>
                    <td className="text-center py-4 px-4">{broker.fno}</td>
                    <td className="text-center py-4 px-4"><span className={broker.accountFee === '₹0' ? 'text-[#00C076]' : 'text-slate-400'}>{broker.accountFee}</span></td>
                    <td className="text-center py-4 px-4"><span className={`px-2 py-1 rounded text-xs ${colorMap[broker.color]}`}>{broker.best}</span></td>
                    <td className="text-right py-4 px-4">
                      <a href={broker.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-4 py-2 bg-[#2962ff] hover:bg-[#1e53e4] rounded text-sm font-medium">Open <ExternalLink className="w-3 h-3" /></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Detailed Cards */}
      <section className="relative py-12 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Detailed Reviews</h2>
          <div className="space-y-6">
            {brokers.map((broker) => (
              <div key={broker.name} className="bg-[#1e222d] rounded-xl overflow-hidden border border-white/5">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{broker.logo}</span>
                      <div>
                        <div className="flex items-center gap-3"><h3 className="text-xl font-bold">{broker.name}</h3><span className={`px-2 py-1 rounded text-xs ${colorMap[broker.color]}`}>{broker.best}</span></div>
                        <p className="text-slate-400">{broker.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-yellow-400"><Star className="w-5 h-5 fill-yellow-400" /><span className="text-xl font-bold">{broker.rating}</span></div>
                        <div className="text-xs text-slate-500">{broker.users} users</div>
                      </div>
                      <a href={broker.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#2962ff] hover:bg-[#1e53e4] rounded-lg font-semibold flex items-center gap-2">Open Free Account <ExternalLink className="w-4 h-4" /></a>
                    </div>
                  </div>
                  <button onClick={() => setExpanded(expanded === broker.name ? null : broker.name)} className="mt-4 text-sm text-[#2962ff] flex items-center gap-1">
                    {expanded === broker.name ? 'Show less' : 'Show details'}<ChevronDown className={`w-4 h-4 transition-transform ${expanded === broker.name ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {expanded === broker.name && (
                  <div className="px-6 pb-6 border-t border-white/5 pt-4">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div><h4 className="font-semibold mb-3 text-sm text-slate-400">Key Features</h4><ul className="space-y-2">{broker.features.map((f) => (<li key={f} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-[#00C076] mt-0.5" />{f}</li>))}</ul></div>
                      <div><h4 className="font-semibold mb-3 text-sm text-slate-400">Pros</h4><ul className="space-y-2">{broker.pros.map((p) => (<li key={p} className="flex items-start gap-2 text-sm"><span className="text-[#00C076]">+</span> {p}</li>))}</ul></div>
                      <div><h4 className="font-semibold mb-3 text-sm text-slate-400">Cons</h4><ul className="space-y-2">{broker.cons.map((c) => (<li key={c} className="flex items-start gap-2 text-sm"><span className="text-red-400">-</span> {c}</li>))}</ul></div>
                    </div>
                    <div className="mt-6 p-4 bg-[#131722] rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div><div className="text-lg font-bold text-[#00C076]">{broker.equity}</div><div className="text-xs text-slate-500">Equity Delivery</div></div>
                        <div><div className="text-lg font-bold">{broker.fno}</div><div className="text-xs text-slate-500">F&O per order</div></div>
                        <div><div className="text-lg font-bold">{broker.accountFee}</div><div className="text-xs text-slate-500">Account Opening</div></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/10 bg-gradient-to-b from-[#1e222d] to-[#131722]">
        <div className="max-w-3xl mx-auto text-center">
          <Gift className="w-12 h-12 text-[#00C076] mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Not Ready Yet?</h2>
          <p className="text-slate-400 mb-8">Keep practicing on PaperPe until you are confident. There is no rush!</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00C076] hover:bg-[#00a865] rounded-lg font-semibold">Continue Practicing <ArrowRight className="w-5 h-5" /></Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-500">
          <p>Affiliate Disclosure: We may earn a commission when you open an account through our links. This does not affect our recommendations or your account charges.</p>
        </div>
      </footer>
    </div>
  );
}
