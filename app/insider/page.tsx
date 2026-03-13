'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Eye, TrendingUp, TrendingDown, Users, Building2, AlertTriangle, Crown, Sparkles } from 'lucide-react';

const isPro = false; // Toggle this for demo

const bulkDeals = [
  { date: '02 Mar', symbol: 'TATAELXSI', client: 'Morgan Stanley Asia', type: 'BUY', qty: '2,45,000', price: 6842, value: '167.6 Cr' },
  { date: '02 Mar', symbol: 'ZOMATO', client: 'Goldman Sachs India', type: 'BUY', qty: '1,20,00,000', price: 182, value: '218.4 Cr' },
  { date: '02 Mar', symbol: 'PAYTM', client: 'Softbank Vision Fund', type: 'SELL', qty: '85,00,000', price: 412, value: '350.2 Cr' },
  { date: '01 Mar', symbol: 'ADANIENT', client: 'Elara Capital', type: 'BUY', qty: '15,00,000', price: 2456, value: '368.4 Cr' },
  { date: '01 Mar', symbol: 'RELIANCE', client: 'Vanguard Group', type: 'BUY', qty: '8,50,000', price: 2890, value: '245.6 Cr' },
];

const insiderTrades = [
  { date: '02 Mar', symbol: 'INFY', person: 'Salil Parekh (CEO)', relation: 'KMP', type: 'BUY', qty: '50,000', price: 1456, mode: 'Market' },
  { date: '02 Mar', symbol: 'HDFCBANK', person: 'Sashidhar Jagdishan', relation: 'MD', type: 'BUY', qty: '25,000', price: 1623, mode: 'ESOP' },
  { date: '01 Mar', symbol: 'TCS', person: 'K Krithivasan (CEO)', relation: 'KMP', type: 'SELL', qty: '10,000', price: 3845, mode: 'Market' },
  { date: '01 Mar', symbol: 'BAJFINANCE', person: 'Promoter Group', relation: 'Promoter', type: 'BUY', qty: '1,00,000', price: 6890, mode: 'Block' },
  { date: '28 Feb', symbol: 'ICICIBANK', person: 'Sandeep Bakhshi', relation: 'MD', type: 'BUY', qty: '75,000', price: 1087, mode: 'ESOP' },
];

const fiiDiiData = [
  { date: '02 Mar', fii: { buy: 12450, sell: 8920, net: 3530 }, dii: { buy: 9800, sell: 11200, net: -1400 } },
  { date: '01 Mar', fii: { buy: 15600, sell: 14200, net: 1400 }, dii: { buy: 8500, sell: 7800, net: 700 } },
  { date: '28 Feb', fii: { buy: 18900, sell: 22400, net: -3500 }, dii: { buy: 14200, sell: 10800, net: 3400 } },
];

const sectorFlow = [
  { sector: 'Banking', fiiNet: 2340, change: 12.5 },
  { sector: 'IT', fiiNet: -1200, change: -5.2 },
  { sector: 'Auto', fiiNet: 890, change: 8.1 },
  { sector: 'Pharma', fiiNet: 450, change: 3.4 },
  { sector: 'Metal', fiiNet: -780, change: -4.8 },
];

export default function InsiderPage() {
  const [activeTab, setActiveTab] = useState('bulk');

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/screener" className="text-slate-400 hover:text-white">Screener</Link>
              <Link href="/insider" className="text-white font-medium flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-500" />Insider</Link>
            </nav>
          </div>
          {!isPro && <Link href="/#pricing" className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-[#00C076] text-black rounded-lg font-semibold text-sm flex items-center gap-1"><Sparkles className="w-4 h-4" />Upgrade to Pro</Link>}
        </div>
      </header>

      <div className="bg-gradient-to-b from-yellow-500/10 to-transparent py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-yellow-500 mb-4">
            <Crown className="w-6 h-6" />
            <span className="font-medium">Pro Feature</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Insider Trading Data</h1>
          <p className="text-slate-400 text-lg max-w-2xl">Track what the big players are doing. Bulk deals, block deals, FII/DII flows, and insider transactions - all in real-time.</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {!isPro && (
          <div className="absolute inset-0 z-20 flex items-center justify-center" style={{top: '200px'}}>
            <div className="bg-[#141820]/95 backdrop-blur-sm p-8 rounded-2xl border border-yellow-500/30 text-center max-w-md mx-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/100/20 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Insider Data</h3>
              <p className="text-slate-400 mb-6">Get access to bulk deals, insider trades, FII/DII flows and more with PaperPe Pro.</p>
              <Link href="/#pricing" className="inline-block w-full py-4 bg-gradient-to-r from-yellow-500 to-[#00C076] text-black rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">Upgrade for ₹499</Link>
              <p className="text-sm text-slate-500 mt-3">One-time payment. Lifetime access.</p>
            </div>
          </div>
        )}

        <div className={`${!isPro ? 'blur-sm pointer-events-none select-none' : ''}`}>
          <div className="flex gap-2 mb-8 overflow-x-auto">
            {['bulk', 'insider', 'fii-dii', 'sector'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-yellow-500/100 text-black' : 'bg-[#0D1117]/5 text-slate-400 hover:text-white'}`}>
                {tab === 'bulk' ? 'Bulk Deals' : tab === 'insider' ? 'Insider Trades' : tab === 'fii-dii' ? 'FII/DII' : 'Sector Flow'}
              </button>
            ))}
          </div>

          {activeTab === 'bulk' && (
            <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2"><Building2 className="w-5 h-5 text-blue-400" />Bulk Deals (Last 7 Days)</h3>
                <span className="text-sm text-slate-500">Updated: 02 Mar 2026, 6:30 PM</span>
              </div>
              <table className="w-full">
                <thead><tr className="border-b border-white/5 text-sm text-slate-500"><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Symbol</th><th className="px-4 py-3 text-left">Client</th><th className="px-4 py-3 text-center">Type</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Price</th><th className="px-4 py-3 text-right">Value</th></tr></thead>
                <tbody>
                  {bulkDeals.map((deal, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-[#0D1117]/5">
                      <td className="px-4 py-3 text-slate-400 text-sm">{deal.date}</td>
                      <td className="px-4 py-3 text-white font-medium">{deal.symbol}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{deal.client}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${deal.type === 'BUY' ? 'bg-[#00C076]/100/20 text-[#00C076]' : 'bg-red-500/100/20 text-red-400'}`}>{deal.type}</span></td>
                      <td className="px-4 py-3 text-right text-slate-300">{deal.qty}</td>
                      <td className="px-4 py-3 text-right text-white">₹{deal.price}</td>
                      <td className="px-4 py-3 text-right text-yellow-400 font-medium">{deal.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'insider' && (
            <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" />Insider Transactions</h3>
                <span className="text-sm text-slate-500">Promoters, Directors, KMPs</span>
              </div>
              <table className="w-full">
                <thead><tr className="border-b border-white/5 text-sm text-slate-500"><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Symbol</th><th className="px-4 py-3 text-left">Person</th><th className="px-4 py-3 text-left">Relation</th><th className="px-4 py-3 text-center">Type</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-right">Price</th></tr></thead>
                <tbody>
                  {insiderTrades.map((trade, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-[#0D1117]/5">
                      <td className="px-4 py-3 text-slate-400 text-sm">{trade.date}</td>
                      <td className="px-4 py-3 text-white font-medium">{trade.symbol}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{trade.person}</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs bg-purple-500/100/20 text-purple-400">{trade.relation}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${trade.type === 'BUY' ? 'bg-[#00C076]/100/20 text-[#00C076]' : 'bg-red-500/100/20 text-red-400'}`}>{trade.type}</span></td>
                      <td className="px-4 py-3 text-right text-slate-300">{trade.qty}</td>
                      <td className="px-4 py-3 text-right text-white">₹{trade.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'fii-dii' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-blue-400" />FII Activity</h3>
                  <div className="text-2xl md:text-3xl font-bold text-[#00C076] mb-1">+₹3,530 Cr</div>
                  <div className="text-sm text-slate-500">Net buying today</div>
                  <div className="mt-4 flex gap-4 text-sm"><div><span className="text-slate-500">Buy:</span> <span className="text-[#00C076]">₹12,450 Cr</span></div><div><span className="text-slate-500">Sell:</span> <span className="text-red-400">₹8,920 Cr</span></div></div>
                </div>
                <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-orange-400" />DII Activity</h3>
                  <div className="text-2xl md:text-3xl font-bold text-red-400 mb-1">-₹1,400 Cr</div>
                  <div className="text-sm text-slate-500">Net selling today</div>
                  <div className="mt-4 flex gap-4 text-sm"><div><span className="text-slate-500">Buy:</span> <span className="text-[#00C076]">₹9,800 Cr</span></div><div><span className="text-slate-500">Sell:</span> <span className="text-red-400">₹11,200 Cr</span></div></div>
                </div>
              </div>
              <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
                <div className="p-4 border-b border-white/5"><h3 className="font-semibold text-white">7-Day History</h3></div>
                <table className="w-full"><thead><tr className="border-b border-white/5 text-sm text-slate-500"><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-right">FII Net</th><th className="px-4 py-3 text-right">DII Net</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
                  <tbody>{fiiDiiData.map((d, i) => (<tr key={i} className="border-b border-white/5"><td className="px-4 py-3 text-slate-400">{d.date}</td><td className={`px-4 py-3 text-right font-medium ${d.fii.net >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{d.fii.net >= 0 ? '+' : ''}₹{d.fii.net} Cr</td><td className={`px-4 py-3 text-right font-medium ${d.dii.net >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{d.dii.net >= 0 ? '+' : ''}₹{d.dii.net} Cr</td><td className={`px-4 py-3 text-right font-medium ${(d.fii.net + d.dii.net) >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{(d.fii.net + d.dii.net) >= 0 ? '+' : ''}₹{d.fii.net + d.dii.net} Cr</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'sector' && (
            <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5"><h3 className="font-semibold text-white">FII Sector-wise Flow (Today)</h3></div>
              <div className="p-4 space-y-4">
                {sectorFlow.map((s, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-20 text-white font-medium">{s.sector}</span>
                    <div className="flex-1 h-8 bg-[#0D1117]/5 rounded-lg overflow-hidden relative">
                      <div className={`absolute top-0 h-full rounded-lg ${s.fiiNet >= 0 ? 'bg-[#00C076]/100/50 left-1/2' : 'bg-red-500/100/50 right-1/2'}`} style={{ width: `${Math.min(Math.abs(s.fiiNet) / 30, 50)}%` }}></div>
                    </div>
                    <span className={`w-24 text-right font-medium ${s.fiiNet >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{s.fiiNet >= 0 ? '+' : ''}₹{s.fiiNet} Cr</span>
                    <span className={`w-16 text-right text-sm ${s.change >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
