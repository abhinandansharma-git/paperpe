'use client';

import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ChevronDown, Filter, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

const mockOptionChain = {
  spotPrice: 22456.80,
  expiries: ['27 Feb 2026', '06 Mar 2026', '13 Mar 2026', '27 Mar 2026'],
  strikes: [
    { strike: 22200, ceOI: 1245000, ceCOI: 125000, ceLTP: 312.50, ceIV: 14.2, peOI: 890000, peCOI: -45000, peLTP: 58.25, peIV: 12.8 },
    { strike: 22300, ceOI: 1890000, ceCOI: 234000, ceLTP: 225.75, ceIV: 13.5, peOI: 1120000, peCOI: 78000, peLTP: 72.50, peIV: 13.2 },
    { strike: 22400, ceOI: 2340000, ceCOI: 456000, ceLTP: 152.00, ceIV: 12.8, peOI: 1560000, peCOI: 123000, peLTP: 95.25, peIV: 13.8 },
    { strike: 22500, ceOI: 3120000, ceCOI: 890000, ceLTP: 92.50, ceIV: 12.2, peOI: 2890000, peCOI: 567000, peLTP: 132.75, peIV: 14.5 },
    { strike: 22600, ceOI: 2780000, ceCOI: -234000, ceLTP: 48.75, ceIV: 11.8, peOI: 1980000, peCOI: -89000, peLTP: 192.50, peIV: 15.2 },
    { strike: 22700, ceOI: 1560000, ceCOI: -178000, ceLTP: 22.25, ceIV: 11.5, peOI: 1230000, peCOI: -56000, peLTP: 268.00, peIV: 16.1 },
    { strike: 22800, ceOI: 890000, ceCOI: -45000, ceLTP: 9.50, ceIV: 11.2, peOI: 780000, peCOI: -23000, peLTP: 352.25, peIV: 17.0 },
  ]
};

export default function OptionsPage() {
  const [selectedExpiry, setSelectedExpiry] = useState(mockOptionChain.expiries[0]);
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');

  const maxOI = Math.max(...mockOptionChain.strikes.flatMap(s => [s.ceOI, s.peOI]));

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
              <Link href="/options" className="text-white font-medium">Options</Link>
              <Link href="/screener" className="text-slate-400 hover:text-white">Screener</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-[#141820] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#00C076]"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-sm">Spot:</span>
              <span className="text-white font-bold text-lg">₹{mockOptionChain.spotPrice.toLocaleString('en-IN')}</span>
              <span className="text-[#00C076] text-sm flex items-center gap-1">
                <ArrowUpRight className="w-4 h-4" />+1.24%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {mockOptionChain.expiries.map(exp => (
              <button
                key={exp}
                onClick={() => setSelectedExpiry(exp)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedExpiry === exp
                    ? 'bg-[#00C076] text-white'
                    : 'bg-[#141820] text-slate-400 hover:text-white'
                }`}
              >
                {exp}
              </button>
            ))}
          </div>
        </div>

        {/* Option Chain Table */}
        <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th colSpan={5} className="bg-[#00C076]/100/10 text-[#00C076] p-3 text-center">CALLS</th>
                  <th className="bg-slate-800 text-white p-3">Strike</th>
                  <th colSpan={5} className="bg-red-500/100/10 text-red-400 p-3 text-center">PUTS</th>
                </tr>
                <tr className="text-xs text-slate-500 border-b border-white/5">
                  <th className="p-3 text-left">OI</th>
                  <th className="p-3 text-left">Chng OI</th>
                  <th className="p-3 text-right">LTP</th>
                  <th className="p-3 text-right">IV</th>
                  <th className="p-3">OI Bar</th>
                  <th className="p-3 text-center bg-slate-800/50"></th>
                  <th className="p-3">OI Bar</th>
                  <th className="p-3 text-left">IV</th>
                  <th className="p-3 text-left">LTP</th>
                  <th className="p-3 text-right">Chng OI</th>
                  <th className="p-3 text-right">OI</th>
                </tr>
              </thead>
              <tbody>
                {mockOptionChain.strikes.map((row) => {
                  const isITM_CE = row.strike < mockOptionChain.spotPrice;
                  const isATM = Math.abs(row.strike - mockOptionChain.spotPrice) < 50;
                  const ceOIWidth = (row.ceOI / maxOI) * 100;
                  const peOIWidth = (row.peOI / maxOI) * 100;

                  return (
                    <tr
                      key={row.strike}
                      className={`border-b border-white/5 hover:bg-[#0D1117]/5 transition-colors ${
                        isATM ? 'bg-[#00C076]/10' : ''
                      }`}
                    >
                      {/* CALLS */}
                      <td className={`p-3 text-sm ${isITM_CE ? 'bg-[#00C076]/100/5' : ''}`}>
                        <span className="text-white">{(row.ceOI / 1000).toFixed(0)}K</span>
                      </td>
                      <td className={`p-3 text-sm ${isITM_CE ? 'bg-[#00C076]/100/5' : ''}`}>
                        <span className={row.ceCOI >= 0 ? 'text-[#00C076]' : 'text-red-400'}>
                          {row.ceCOI >= 0 ? '+' : ''}{(row.ceCOI / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td className={`p-3 text-sm text-right ${isITM_CE ? 'bg-[#00C076]/100/5' : ''}`}>
                        <span className="text-white font-medium">₹{row.ceLTP.toFixed(2)}</span>
                      </td>
                      <td className={`p-3 text-sm text-right ${isITM_CE ? 'bg-[#00C076]/100/5' : ''}`}>
                        <span className="text-slate-400">{row.ceIV}%</span>
                      </td>
                      <td className={`p-3 ${isITM_CE ? 'bg-[#00C076]/100/5' : ''}`}>
                        <div className="w-20 h-3 bg-slate-800 rounded overflow-hidden">
                          <div
                            className="h-full bg-[#00C076]/100/50"
                            style={{ width: `${ceOIWidth}%` }}
                          />
                        </div>
                      </td>

                      {/* STRIKE */}
                      <td className={`p-3 text-center font-bold ${isATM ? 'text-[#00C076] text-lg' : 'text-white'} bg-slate-800/50`}>
                        {row.strike}
                        {isATM && <span className="text-xs text-orange-400 block">ATM</span>}
                      </td>

                      {/* PUTS */}
                      <td className={`p-3 ${!isITM_CE ? 'bg-red-500/100/5' : ''}`}>
                        <div className="w-20 h-3 bg-slate-800 rounded overflow-hidden flex justify-end">
                          <div
                            className="h-full bg-red-500/100/50"
                            style={{ width: `${peOIWidth}%` }}
                          />
                        </div>
                      </td>
                      <td className={`p-3 text-sm ${!isITM_CE ? 'bg-red-500/100/5' : ''}`}>
                        <span className="text-slate-400">{row.peIV}%</span>
                      </td>
                      <td className={`p-3 text-sm ${!isITM_CE ? 'bg-red-500/100/5' : ''}`}>
                        <span className="text-white font-medium">₹{row.peLTP.toFixed(2)}</span>
                      </td>
                      <td className={`p-3 text-sm text-right ${!isITM_CE ? 'bg-red-500/100/5' : ''}`}>
                        <span className={row.peCOI >= 0 ? 'text-[#00C076]' : 'text-red-400'}>
                          {row.peCOI >= 0 ? '+' : ''}{(row.peCOI / 1000).toFixed(0)}K
                        </span>
                      </td>
                      <td className={`p-3 text-sm text-right ${!isITM_CE ? 'bg-red-500/100/5' : ''}`}>
                        <span className="text-white">{(row.peOI / 1000).toFixed(0)}K</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* OI Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-[#141820] rounded-xl border border-white/5 p-6">
            <h3 className="text-slate-400 text-sm mb-2">Total Call OI</h3>
            <div className="text-2xl font-bold text-[#00C076]">1.38 Cr</div>
            <div className="text-sm text-[#00C076]/70 mt-1">+12.5L added</div>
          </div>
          <div className="bg-[#141820] rounded-xl border border-white/5 p-6">
            <h3 className="text-slate-400 text-sm mb-2">Total Put OI</h3>
            <div className="text-2xl font-bold text-red-400">1.04 Cr</div>
            <div className="text-sm text-red-400/70 mt-1">+5.5L added</div>
          </div>
          <div className="bg-[#141820] rounded-xl border border-white/5 p-6">
            <h3 className="text-slate-400 text-sm mb-2">PCR (OI)</h3>
            <div className="text-2xl font-bold text-white">0.75</div>
            <div className="text-sm text-[#00C076] mt-1 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Bullish Bias
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
