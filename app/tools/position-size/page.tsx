'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function PositionSizeCalculator() {
  const [capital, setCapital] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(22000);
  const [stopLoss, setStopLoss] = useState(21900);
  const [lotSize, setLotSize] = useState(50);

  const results = useMemo(() => {
    const riskAmount = capital * (riskPercent / 100);
    const slPoints = Math.abs(entryPrice - stopLoss);
    const riskPerShare = slPoints;
    const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
    const lots = lotSize > 0 ? Math.floor(shares / lotSize) : 0;
    const actualRisk = lots * lotSize * slPoints;
    const actualRiskPercent = capital > 0 ? (actualRisk / capital) * 100 : 0;
    const positionValue = lots * lotSize * entryPrice;
    
    return { riskAmount, slPoints, shares, lots, actualRisk, actualRiskPercent, positionValue };
  }, [capital, riskPercent, entryPrice, stopLoss, lotSize]);

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/10 bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="text-white font-semibold text-xl">PaperPe</span>
          </Link>
          <Link href="/tools" className="text-slate-400 hover:text-white">All Tools</Link>
        </div>
      </header>

      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Position Size Calculator</h1>
          <p className="text-slate-400 text-center mb-8">Calculate optimal position size based on risk management</p>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Trading Capital</label>
                <input type="number" value={capital} onChange={(e) => setCapital(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Risk Per Trade (%)</label>
                <input type="number" value={riskPercent} onChange={(e) => setRiskPercent(Number(e.target.value))} step="0.5" className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Entry Price</label>
                <input type="number" value={entryPrice} onChange={(e) => setEntryPrice(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Stop Loss Price</label>
                <input type="number" value={stopLoss} onChange={(e) => setStopLoss(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-slate-400 block mb-1">Lot Size (NIFTY=50, BANKNIFTY=30)</label>
                <input type="number" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Results</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Max Risk Amount</div>
                <div className="text-2xl font-bold text-orange-500">{String.fromCharCode(8377)}{results.riskAmount.toLocaleString()}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">SL Points</div>
                <div className="text-2xl font-bold text-red-500">{results.slPoints}</div>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                <div className="text-sm text-green-400">Recommended Lots</div>
                <div className="text-3xl font-bold text-green-500">{results.lots}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Shares</div>
                <div className="text-2xl font-bold text-white">{results.lots * lotSize}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Actual Risk</div>
                <div className="text-2xl font-bold text-red-500">{String.fromCharCode(8377)}{results.actualRisk.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{results.actualRiskPercent.toFixed(2)}%</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Position Value</div>
                <div className="text-2xl font-bold text-blue-500">{String.fromCharCode(8377)}{results.positionValue.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <p className="text-orange-400 text-sm">Golden Rule: Never risk more than 1-2% of your capital on a single trade.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/dashboard" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">Practice Paper Trading</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
