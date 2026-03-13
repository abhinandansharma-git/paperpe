'use client';

import { useState } from 'react';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Star, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import Link from 'next/link';

const mockScreenerData = [
  { symbol: 'RELIANCE', price: 2847.50, change: 2.15, volume: '12.5M', rsi: 62, macd: 'Buy', sector: 'Energy', signal: 'Bullish' },
  { symbol: 'TCS', price: 4123.75, change: -1.32, volume: '8.2M', rsi: 45, macd: 'Neutral', sector: 'IT', signal: 'Neutral' },
  { symbol: 'HDFCBANK', price: 1654.20, change: 0.89, volume: '15.8M', rsi: 55, macd: 'Buy', sector: 'Banking', signal: 'Bullish' },
  { symbol: 'INFY', price: 1876.25, change: 1.56, volume: '10.3M', rsi: 58, macd: 'Buy', sector: 'IT', signal: 'Bullish' },
  { symbol: 'ICICIBANK', price: 1098.50, change: -0.34, volume: '18.2M', rsi: 48, macd: 'Sell', sector: 'Banking', signal: 'Bearish' },
  { symbol: 'SBIN', price: 812.25, change: 1.89, volume: '25.6M', rsi: 65, macd: 'Buy', sector: 'Banking', signal: 'Bullish' },
  { symbol: 'TATASTEEL', price: 145.80, change: 3.25, volume: '45.2M', rsi: 72, macd: 'Buy', sector: 'Metals', signal: 'Strong Buy' },
  { symbol: 'ADANIENT', price: 2456.00, change: -2.15, volume: '8.9M', rsi: 38, macd: 'Sell', sector: 'Infrastructure', signal: 'Bearish' },
  { symbol: 'BHARTIARTL', price: 1456.75, change: 0.45, volume: '6.7M', rsi: 52, macd: 'Neutral', sector: 'Telecom', signal: 'Neutral' },
  { symbol: 'WIPRO', price: 487.50, change: -0.78, volume: '12.1M', rsi: 42, macd: 'Sell', sector: 'IT', signal: 'Bearish' },
];

const scanners = [
  { name: 'Bullish Breakout', count: 15, icon: TrendingUp, color: 'emerald' },
  { name: 'Bearish Breakdown', count: 8, icon: TrendingDown, color: 'red' },
  { name: 'High Volume', count: 23, icon: Activity, color: 'blue' },
  { name: 'RSI Oversold', count: 12, icon: Zap, color: 'orange' },
];

export default function ScreenerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');

  const filteredData = mockScreenerData.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/charts" className="text-slate-400 hover:text-white">Charts</Link>
              <Link href="/options" className="text-slate-400 hover:text-white">Options</Link>
              <Link href="/screener" className="text-white font-medium">Screener</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Quick Scanners */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {scanners.map((scanner, i) => (
            <button
              key={i}
              className={`bg-[#141820] rounded-xl p-4 border border-white/5 hover:border-${scanner.color}-500/50 transition-all group`}
            >
              <div className="flex items-center justify-between mb-2">
                <scanner.icon className={`w-5 h-5 text-${scanner.color}-500`} />
                <span className={`text-2xl font-bold text-${scanner.color}-400`}>{scanner.count}</span>
              </div>
              <div className="text-sm text-slate-400 group-hover:text-white transition-colors">{scanner.name}</div>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#141820] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00C076]"
            />
          </div>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="bg-[#141820] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00C076]"
          >
            <option value="All">All Sectors</option>
            <option value="IT">IT</option>
            <option value="Banking">Banking</option>
            <option value="Energy">Energy</option>
            <option value="Metals">Metals</option>
            <option value="Telecom">Telecom</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#141820] border border-white/10 rounded-lg text-slate-400 hover:text-white hover:border-white/20">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>

        {/* Screener Table */}
        <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-white/5 bg-[#0D1117]/5">
                  <th className="p-4"></th>
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Sector</th>
                  <th className="p-4 text-right">Price</th>
                  <th className="p-4 text-right">Change</th>
                  <th className="p-4 text-right">Volume</th>
                  <th className="p-4 text-center">RSI</th>
                  <th className="p-4 text-center">MACD</th>
                  <th className="p-4 text-center">Signal</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((stock, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-[#0D1117]/5 transition-colors">
                    <td className="p-4">
                      <button className="text-slate-500 hover:text-[#00C076]">
                        <Star className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-4">
                      <span className="font-medium text-white">{stock.symbol}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-400 text-sm">{stock.sector}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-white font-medium">₹{stock.price.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>
                        {stock.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-300">{stock.volume}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        stock.rsi > 70 ? 'bg-red-500/100/20 text-red-400' :
                        stock.rsi < 30 ? 'bg-[#00C076]/100/20 text-[#00C076]' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {stock.rsi}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        stock.macd === 'Buy' ? 'bg-[#00C076]/100/20 text-[#00C076]' :
                        stock.macd === 'Sell' ? 'bg-red-500/100/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {stock.macd}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        stock.signal === 'Bullish' || stock.signal === 'Strong Buy' ? 'bg-[#00C076]/100/20 text-[#00C076]' :
                        stock.signal === 'Bearish' ? 'bg-red-500/100/20 text-red-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {stock.signal}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="px-3 py-1.5 rounded bg-[#00C076]/20 text-orange-400 hover:bg-[#00C076]/30 text-sm">
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
