'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Normal distribution CDF approximation
function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

// Normal distribution PDF
function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// Black-Scholes calculations
function blackScholes(
  S: number,  // Spot price
  K: number,  // Strike price
  T: number,  // Time to expiry in years
  r: number,  // Risk-free rate
  sigma: number, // Volatility
  optionType: 'CE' | 'PE'
) {
  if (T <= 0) T = 0.0001;
  
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  
  let price, delta, gamma, theta, vega;
  
  if (optionType === 'CE') {
    price = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    delta = normalCDF(d1);
    theta = (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  } else {
    price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    delta = normalCDF(d1) - 1;
    theta = (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;
  }
  
  gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  vega = S * normalPDF(d1) * Math.sqrt(T) / 100;
  
  return { price, delta, gamma, theta, vega, d1, d2 };
}

export default function CalculatorPage() {
  // Input states
  const [spotPrice, setSpotPrice] = useState(22000);
  const [strikePrice, setStrikePrice] = useState(22000);
  const [daysToExpiry, setDaysToExpiry] = useState(7);
  const [volatility, setVolatility] = useState(15);
  const [riskFreeRate, setRiskFreeRate] = useState(6.5);
  const [optionType, setOptionType] = useState<'CE' | 'PE'>('CE');
  const [lotSize, setLotSize] = useState(50);
  const [premiumPaid, setPremiumPaid] = useState(150);
  const [quantity, setQuantity] = useState(1);
  
  // Calculate Greeks
  const results = useMemo(() => {
    const T = daysToExpiry / 365;
    const r = riskFreeRate / 100;
    const sigma = volatility / 100;
    return blackScholes(spotPrice, strikePrice, T, r, sigma, optionType);
  }, [spotPrice, strikePrice, daysToExpiry, volatility, riskFreeRate, optionType]);
  
  // Calculate P&L scenarios
  const pnlScenarios = useMemo(() => {
    const scenarios = [];
    const moves = [-5, -3, -2, -1, 0, 1, 2, 3, 5];
    
    for (const pct of moves) {
      const newSpot = spotPrice * (1 + pct / 100);
      const T = Math.max(daysToExpiry - 1, 1) / 365;
      const r = riskFreeRate / 100;
      const sigma = volatility / 100;
      const newResults = blackScholes(newSpot, strikePrice, T, r, sigma, optionType);
      const pnl = (newResults.price - premiumPaid) * lotSize * quantity;
      scenarios.push({ move: pct, newSpot: newSpot.toFixed(0), premium: newResults.price.toFixed(2), pnl });
    }
    return scenarios;
  }, [spotPrice, strikePrice, daysToExpiry, volatility, riskFreeRate, optionType, premiumPaid, lotSize, quantity]);
  
  // Calculate breakeven
  const breakeven = optionType === 'CE' 
    ? strikePrice + premiumPaid 
    : strikePrice - premiumPaid;
  
  const maxLoss = premiumPaid * lotSize * quantity;
  
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
          <Link href="/dashboard" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
            Start Trading
          </Link>
        </div>
      </header>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Free Option Calculator</h1>
            <p className="text-slate-400">Calculate option premium, Greeks, P&L scenarios for NIFTY & BANKNIFTY</p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Input Parameters</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Option Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setOptionType('CE')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${optionType === 'CE' ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-400'}`}>Call (CE)</button>
                    <button onClick={() => setOptionType('PE')} className={`flex-1 py-2 rounded-lg font-medium transition-colors ${optionType === 'PE' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'}`}>Put (PE)</button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Spot Price</label>
                  <input type="number" value={spotPrice} onChange={(e) => setSpotPrice(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Strike Price</label>
                  <input type="number" value={strikePrice} onChange={(e) => setStrikePrice(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Days to Expiry</label>
                  <input type="number" value={daysToExpiry} onChange={(e) => setDaysToExpiry(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Volatility (IV %)</label>
                  <input type="number" value={volatility} onChange={(e) => setVolatility(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Risk-Free Rate (%)</label>
                  <input type="number" value={riskFreeRate} onChange={(e) => setRiskFreeRate(Number(e.target.value))} step="0.1" className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <hr className="border-white/10" />
                
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Premium Paid (for P&L)</label>
                  <input type="number" value={premiumPaid} onChange={(e) => setPremiumPaid(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Lot Size</label>
                    <input type="number" value={lotSize} onChange={(e) => setLotSize(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-1">Quantity</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Results Panel */}
            <div className="space-y-6">
              {/* Premium & Greeks */}
              <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Option Premium & Greeks</h2>
                
                <div className="text-center mb-6">
                  <div className="text-sm text-slate-400">Theoretical Premium</div>
                  <div className="text-4xl font-bold text-orange-500">{String.fromCharCode(8377)}{results.price.toFixed(2)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400">Delta</div>
                    <div className={`text-2xl font-bold ${results.delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>{results.delta.toFixed(4)}</div>
                  </div>
                  <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400">Gamma</div>
                    <div className="text-2xl font-bold text-blue-500">{results.gamma.toFixed(6)}</div>
                  </div>
                  <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400">Theta</div>
                    <div className="text-2xl font-bold text-red-500">{results.theta.toFixed(4)}</div>
                  </div>
                  <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                    <div className="text-sm text-slate-400">Vega</div>
                    <div className="text-2xl font-bold text-purple-500">{results.vega.toFixed(4)}</div>
                  </div>
                </div>
              </div>
              
              {/* Breakeven */}
              <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Breakeven Analysis</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Breakeven</div>
                    <div className="text-2xl font-bold text-white">{breakeven.toFixed(0)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-400">Max Loss</div>
                    <div className="text-2xl font-bold text-red-500">{String.fromCharCode(8377)}{maxLoss.toLocaleString()}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  {optionType === 'CE' 
                    ? `NIFTY needs to be above ${breakeven.toFixed(0)} at expiry to profit.`
                    : `NIFTY needs to be below ${breakeven.toFixed(0)} at expiry to profit.`}
                </div>
              </div>
            </div>
            
            {/* P&L Scenarios */}
            <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">P&L Scenarios (Next Day)</h2>
              <div className="space-y-2">
                {pnlScenarios.map((s, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 rounded-lg ${s.pnl >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <div>
                      <span className={`font-medium ${s.move >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {s.move >= 0 ? '+' : ''}{s.move}%
                      </span>
                      <span className="text-slate-400 ml-2">({s.newSpot})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">{String.fromCharCode(8377)}{s.premium}</div>
                      <div className={`font-bold ${s.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {s.pnl >= 0 ? '+' : ''}{String.fromCharCode(8377)}{s.pnl.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">Want to practice options trading without risk?</p>
            <Link href="/dashboard" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors">
              Start Paper Trading Free
            </Link>
          </div>
        </div>
      </section>
      
      {/* SEO Content */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">How to Use This Option Calculator</h2>
          <div className="text-slate-400 space-y-4">
            <p>This free option calculator uses the Black-Scholes model to calculate theoretical option premiums and Greeks for NIFTY and BANKNIFTY options.</p>
            <h3 className="text-white font-semibold">Understanding the Greeks:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Delta:</strong> How much option price changes when underlying moves Rs 1</li>
              <li><strong className="text-white">Gamma:</strong> Rate of change of Delta</li>
              <li><strong className="text-white">Theta:</strong> Daily time decay (how much value lost per day)</li>
              <li><strong className="text-white">Vega:</strong> Sensitivity to 1% change in volatility</li>
            </ul>
            <p>Use the P&L scenarios to see potential profit/loss at different price levels.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center text-slate-500 text-sm">
          <p>2026 PaperPe. Free trading tools for Indian markets.</p>
        </div>
      </footer>
    </div>
  );
}
