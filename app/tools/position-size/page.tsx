'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

function InputField({ label, value, onChange, step = 1, hint = '' }: {
  label: string; value: number; onChange: (v: number) => void; step?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-[#0D1117] border border-[#21262D] focus:border-[#00C076] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function ResultCard({ label, value, color = 'text-white', sub = '' }: {
  label: string; value: string; color?: string; sub?: string;
}) {
  return (
    <div className="bg-[#0D1117] border border-[#21262D] rounded-xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function PositionSizeCalculator() {
  const [capital, setCapital] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(22000);
  const [stopLoss, setStopLoss] = useState(21900);
  const [lotSize, setLotSize] = useState(50);

  const results = useMemo(() => {
    const riskAmount = capital * (riskPercent / 100);
    const slPoints = Math.abs(entryPrice - stopLoss);
    const shares = slPoints > 0 ? Math.floor(riskAmount / slPoints) : 0;
    const lots = lotSize > 0 ? Math.floor(shares / lotSize) : 0;
    const actualRisk = lots * lotSize * slPoints;
    const actualRiskPercent = capital > 0 ? (actualRisk / capital) * 100 : 0;
    const positionValue = lots * lotSize * entryPrice;
    return { riskAmount, slPoints, shares, lots, actualRisk, actualRiskPercent, positionValue };
  }, [capital, riskPercent, entryPrice, stopLoss, lotSize]);

  const isGoodRisk = results.actualRiskPercent <= 2;

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <header className="border-b border-[#21262D] sticky top-0 z-50 bg-[#0D1117]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00C076] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">P</div>
            <span className="font-semibold">PaperPe</span>
          </Link>
          <Link href="/tools" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Tools
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#00C076]/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00C076]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Position Size Calculator</h1>
              <p className="text-gray-400 text-sm">Calculate optimal lot size based on your risk tolerance</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 space-y-5">
            <h2 className="font-semibold text-white text-sm uppercase tracking-wide text-gray-400">Trade Parameters</h2>
            <InputField label="Trading Capital (₹)" value={capital} onChange={setCapital} hint="Your total trading capital" />
            <InputField label="Risk Per Trade (%)" value={riskPercent} onChange={setRiskPercent} step={0.5} hint="Recommended: 1–2% max" />
            <InputField label="Entry Price" value={entryPrice} onChange={setEntryPrice} />
            <InputField label="Stop Loss Price" value={stopLoss} onChange={setStopLoss} />
            <InputField label="Lot Size" value={lotSize} onChange={setLotSize} hint="NIFTY=50, BANKNIFTY=30, FINNIFTY=65" />
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className={`rounded-2xl p-5 border ${isGoodRisk ? 'bg-[#00C076]/5 border-[#00C076]/20' : 'bg-yellow-500/5 border-yellow-500/20'}`}>
              <div className="flex items-center gap-2 mb-1">
                {isGoodRisk
                  ? <CheckCircle className="w-5 h-5 text-[#00C076]" />
                  : <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                <span className={`font-semibold ${isGoodRisk ? 'text-[#00C076]' : 'text-yellow-400'}`}>
                  {isGoodRisk ? 'Good Risk Management' : 'High Risk — Reduce Position'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{isGoodRisk ? 'Your actual risk is within the safe 1–2% range.' : 'Actual risk exceeds 2%. Consider fewer lots.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ResultCard label="Recommended Lots" value={`${results.lots} lots`} color="text-[#00C076]" sub={`${results.lots * lotSize} units`} />
              <ResultCard label="SL Points" value={`${results.slPoints} pts`} color="text-white" />
              <ResultCard label="Max Risk Amount" value={`₹${results.riskAmount.toLocaleString()}`} color="text-[#00C076]" sub={`${riskPercent}% of capital`} />
              <ResultCard label="Actual Risk" value={`₹${Math.round(results.actualRisk).toLocaleString()}`} color={isGoodRisk ? 'text-[#00C076]' : 'text-yellow-400'} sub={`${results.actualRiskPercent.toFixed(2)}% of capital`} />
              <ResultCard label="Position Value" value={`₹${Math.round(results.positionValue).toLocaleString()}`} color="text-white" />
              <ResultCard label="Shares (units)" value={`${results.shares}`} color="text-gray-300" />
            </div>

            <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Reference</p>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between"><span>NIFTY Lot Size</span><span className="text-white">50</span></div>
                <div className="flex justify-between"><span>BANKNIFTY Lot Size</span><span className="text-white">30</span></div>
                <div className="flex justify-between"><span>FINNIFTY Lot Size</span><span className="text-white">65</span></div>
                <div className="flex justify-between"><span>SENSEX Lot Size</span><span className="text-white">20</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
