'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, TrendingUp, TrendingDown, Info, ChevronDown } from 'lucide-react';

function normalCDF(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return 0.5 * (1.0 + sign * y);
}

function normalPDF(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function blackScholes(S: number, K: number, T: number, r: number, sigma: number, type: 'CE' | 'PE') {
  if (T <= 0) T = 0.0001;
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);
  let price: number, delta: number, theta: number;
  if (type === 'CE') {
    price = S * normalCDF(d1) - K * Math.exp(-r * T) * normalCDF(d2);
    delta = normalCDF(d1);
    theta = (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * normalCDF(d2)) / 365;
  } else {
    price = K * Math.exp(-r * T) * normalCDF(-d2) - S * normalCDF(-d1);
    delta = normalCDF(d1) - 1;
    theta = (-(S * normalPDF(d1) * sigma) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * normalCDF(-d2)) / 365;
  }
  const gamma = normalPDF(d1) / (S * sigma * Math.sqrt(T));
  const vega = S * normalPDF(d1) * Math.sqrt(T) / 100;
  return { price, delta, gamma, theta, vega };
}

const PRESETS = [
  { name: 'NIFTY', spot: 24000, strike: 24000, lot: 50 },
  { name: 'BANKNIFTY', spot: 52000, strike: 52000, lot: 15 },
  { name: 'FINNIFTY', spot: 23000, strike: 23000, lot: 40 },
  { name: 'MIDCPNIFTY', spot: 12000, strike: 12000, lot: 75 },
];

const GREEKS_INFO: Record<string, string> = {
  Delta: 'Change in option price per ₹1 move in underlying. CE delta: 0 to 1. PE delta: -1 to 0.',
  Gamma: 'Rate of change of Delta. High gamma = Delta changes quickly. Watch out near expiry.',
  Theta: 'Daily time decay. Negative for buyers — options lose this much value per day.',
  Vega: 'Change in option price per 1% change in IV. High vega = sensitive to volatility changes.',
};

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <button onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} className="text-gray-400 hover:text-[#00C076] transition-colors ml-1">
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-[#0D1117] text-white text-xs p-3 rounded-lg shadow-xl shadow-black/30 z-10 leading-relaxed">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, step = 1, tooltip }: { label: string; value: number; onChange: (v: number) => void; step?: number; tooltip?: string }) {
  return (
    <div>
      <label className="flex items-center text-sm font-medium text-gray-300 mb-1.5">
        {label} {tooltip && <Tooltip text={tooltip} />}
      </label>
      <input
        type="number"
        value={value}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full px-4 py-2.5 border border-[#21262D] rounded-xl text-white focus:outline-none focus:border-[#00C076] focus:border-[#00C076] focus:outline-none/10 transition-all text-sm"
      />
    </div>
  );
}

export default function CalculatorPage() {
  const [spot, setSpot] = useState(24000);
  const [strike, setStrike] = useState(24000);
  const [dte, setDte] = useState(7);
  const [iv, setIv] = useState(15);
  const [rfr, setRfr] = useState(6.5);
  const [type, setType] = useState<'CE' | 'PE'>('CE');
  const [lotSize, setLotSize] = useState(50);
  const [premium, setPremium] = useState(150);
  const [qty, setQty] = useState(1);
  const [activePreset, setActivePreset] = useState('NIFTY');
  const [showGreeks, setShowGreeks] = useState(true);

  const applyPreset = (p: typeof PRESETS[0]) => {
    setSpot(p.spot); setStrike(p.strike); setLotSize(p.lot); setActivePreset(p.name);
  };

  const results = useMemo(() => blackScholes(spot, strike, dte / 365, rfr / 100, iv / 100, type), [spot, strike, dte, iv, rfr, type]);

  const breakeven = type === 'CE' ? strike + premium : strike - premium;
  const maxLoss = premium * lotSize * qty;
  const intrinsic = type === 'CE' ? Math.max(0, spot - strike) : Math.max(0, strike - spot);
  const timeValue = Math.max(0, results.price - intrinsic);
  const moneyness = spot === strike ? 'ATM' : (type === 'CE' ? (spot > strike ? 'ITM' : 'OTM') : (spot < strike ? 'ITM' : 'OTM'));
  const moneynessColor = moneyness === 'ITM' ? 'text-[#00C076] bg-[#00C076]/10 border-green-200' : moneyness === 'OTM' ? 'text-red-600 bg-red-500/10 border-red-200' : 'text-[#00C076] bg-[#00C076]/10 border-blue-200';

  const scenarios = useMemo(() => {
    return [-5, -3, -2, -1, -0.5, 0, 0.5, 1, 2, 3, 5].map(pct => {
      const newSpot = spot * (1 + pct / 100);
      const r = blackScholes(newSpot, strike, Math.max(dte - 1, 1) / 365, rfr / 100, iv / 100, type);
      const pnl = (r.price - premium) * lotSize * qty;
      return { pct, newSpot: Math.round(newSpot), premium: r.price, pnl };
    });
  }, [spot, strike, dte, iv, rfr, type, premium, lotSize, qty]);

  const maxPnl = Math.max(...scenarios.map(s => Math.abs(s.pnl)));

  return (
    <div className="min-h-screen bg-[#161B22]">
      {/* Nav */}
      <header className="bg-[#0D1117] border-b border-[#21262D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#00C076] rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-black/20 shadow-blue-500/20">P</div>
              <span className="font-semibold text-lg text-white hidden sm:block">PaperPe</span>
            </Link>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium">
              <Calculator className="w-4 h-4 text-[#00C076]" />
              Option Calculator
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/tools" className="text-gray-500 hover:text-gray-300 text-sm hidden sm:flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> All Tools
            </Link>
            <Link href="/" className="bg-[#00C076] hover:bg-[#00a865] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Start Trading Free
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Free Option Calculator</h1>
          <p className="text-gray-500 text-sm">Black-Scholes model · NIFTY, BANKNIFTY & MCX options · Greeks + P&L scenarios</p>
        </div>

        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PRESETS.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activePreset === p.name ? 'bg-[#00C076] text-white border-[#00C076] shadow-md shadow-black/20 shadow-blue-500/20' : 'bg-[#0D1117] text-gray-400 border-[#21262D] hover:border-blue-300'}`}>
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-12 gap-5">
          {/* LEFT: Inputs */}
          <div className="xl:col-span-3">
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 shadow-sm sticky top-24">
              {/* CE/PE toggle */}
              <div className="flex rounded-xl overflow-hidden border border-[#21262D] mb-5">
                <button onClick={() => setType('CE')} className={`flex-1 py-3 text-sm font-bold transition-colors ${type === 'CE' ? 'bg-[#00C076]/100 text-white' : 'bg-[#0D1117] text-gray-500 hover:bg-[#161B22]'}`}>
                  CALL (CE)
                </button>
                <button onClick={() => setType('PE')} className={`flex-1 py-3 text-sm font-bold transition-colors ${type === 'PE' ? 'bg-red-500/100 text-white' : 'bg-[#0D1117] text-gray-500 hover:bg-[#161B22]'}`}>
                  PUT (PE)
                </button>
              </div>

              <div className="space-y-4">
                <InputField label="Spot Price" value={spot} onChange={setSpot} tooltip="Current market price of NIFTY / BANKNIFTY / underlying" />
                <InputField label="Strike Price" value={strike} onChange={setStrike} tooltip="The price at which option can be exercised" />
                <InputField label="Days to Expiry" value={dte} onChange={setDte} tooltip="Number of calendar days remaining to expiry. NSE expiry is weekly (Thursday)." />
                <InputField label="IV (%)" value={iv} onChange={setIv} step={0.5} tooltip="Implied Volatility. Check NSE India VIX or option chain for current IV." />
                <InputField label="Risk-Free Rate (%)" value={rfr} onChange={setRfr} step={0.1} tooltip="RBI repo rate (~6.5%). Rarely needs to change." />

                <div className="border-t border-[#21262D] pt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">P&L Settings</p>
                  <div className="space-y-3">
                    <InputField label="Premium Paid (₹)" value={premium} onChange={setPremium} tooltip="The price you paid / received for the option" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField label="Lot Size" value={lotSize} onChange={setLotSize} />
                      <InputField label="Qty (lots)" value={qty} onChange={setQty} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE: Results */}
          <div className="xl:col-span-5 space-y-4">
            {/* Premium card */}
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">Theoretical Premium</h2>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${moneynessColor}`}>{moneyness}</span>
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-white">₹{results.price.toFixed(2)}</span>
                <span className="text-gray-400 text-sm">/ unit</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                <div className="bg-[#161B22] rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Intrinsic</div>
                  <div className="font-bold text-white">₹{intrinsic.toFixed(2)}</div>
                </div>
                <div className="bg-[#161B22] rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Time Value</div>
                  <div className="font-bold text-[#00C076]">₹{timeValue.toFixed(2)}</div>
                </div>
                <div className="bg-[#161B22] rounded-xl p-3">
                  <div className="text-xs text-gray-500 mb-1">Total Cost</div>
                  <div className="font-bold text-white">₹{(results.price * lotSize * qty).toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                </div>
              </div>
            </div>

            {/* Greeks */}
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl shadow-sm overflow-hidden">
              <button onClick={() => setShowGreeks(!showGreeks)} className="w-full flex items-center justify-between p-5 text-left">
                <h2 className="font-bold text-white">Option Greeks</h2>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showGreeks ? 'rotate-180' : ''}`} />
              </button>
              {showGreeks && (
                <div className="px-5 pb-5 grid grid-cols-2 gap-3">
                  {[
                    { name: 'Delta', value: results.delta.toFixed(4), color: results.delta >= 0 ? 'text-[#00C076]' : 'text-red-600', bg: results.delta >= 0 ? 'bg-[#00C076]/10' : 'bg-red-500/10' },
                    { name: 'Gamma', value: results.gamma.toFixed(6), color: 'text-[#00C076]', bg: 'bg-[#00C076]/10' },
                    { name: 'Theta', value: results.theta.toFixed(4), color: 'text-[#00C076]', bg: 'bg-orange-500/10' },
                    { name: 'Vega', value: results.vega.toFixed(4), color: 'text-purple-600', bg: 'bg-purple-500/10' },
                  ].map(g => (
                    <div key={g.name} className={`${g.bg} rounded-xl p-4`}>
                      <div className="flex items-center text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        {g.name} <Tooltip text={GREEKS_INFO[g.name]} />
                      </div>
                      <div className={`text-2xl font-black ${g.color}`}>{g.value}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Breakeven */}
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-white mb-4">Breakeven & Risk</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="text-center bg-[#00C076]/10 rounded-xl p-4">
                  <div className="text-xs text-[#00C076] font-semibold mb-1 uppercase tracking-wide">Breakeven</div>
                  <div className="text-2xl font-black text-blue-700">{breakeven.toFixed(0)}</div>
                  <div className="text-xs text-[#00C076] mt-1">{type === 'CE' ? `+${(breakeven - spot).toFixed(0)} from spot` : `${(breakeven - spot).toFixed(0)} from spot`}</div>
                </div>
                <div className="text-center bg-red-500/10 rounded-xl p-4">
                  <div className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">Max Loss</div>
                  <div className="text-2xl font-black text-red-700">₹{maxLoss.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-red-500 mt-1">{qty} lot{qty > 1 ? 's' : ''} × {lotSize}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 bg-[#161B22] rounded-lg p-3 leading-relaxed">
                {type === 'CE'
                  ? `${activePreset} must close above ₹${breakeven.toFixed(0)} at expiry to profit. Currently ${spot > breakeven ? '✅ profitable' : '❌ not profitable'}.`
                  : `${activePreset} must close below ₹${breakeven.toFixed(0)} at expiry to profit. Currently ${spot < breakeven ? '✅ profitable' : '❌ not profitable'}.`}
              </p>
            </div>
          </div>

          {/* RIGHT: P&L scenarios */}
          <div className="xl:col-span-4">
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 shadow-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white">P&L Scenarios</h2>
                <span className="text-xs text-gray-400">Tomorrow, same IV</span>
              </div>
              <div className="space-y-1.5">
                {scenarios.map((s, i) => {
                  const barWidth = maxPnl > 0 ? Math.abs(s.pnl) / maxPnl * 100 : 0;
                  const isCenter = s.pct === 0;
                  return (
                    <div key={i} className={`rounded-xl overflow-hidden ${isCenter ? 'ring-2 ring-blue-200' : ''}`}>
                      <div className={`flex items-center justify-between px-3 py-2 ${s.pnl >= 0 ? 'bg-[#00C076]/10' : 'bg-red-500/10'}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {s.pct > 0 ? <TrendingUp className="w-3.5 h-3.5 text-[#00C076] shrink-0" /> : s.pct < 0 ? <TrendingDown className="w-3.5 h-3.5 text-red-500 shrink-0" /> : <div className="w-3.5 h-3.5 shrink-0" />}
                          <span className={`text-sm font-bold ${s.pct > 0 ? 'text-green-700' : s.pct < 0 ? 'text-red-700' : 'text-gray-300'}`}>
                            {s.pct === 0 ? 'Flat' : `${s.pct > 0 ? '+' : ''}${s.pct}%`}
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:block">{s.newSpot.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <div className={`text-sm font-black ${s.pnl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                            {s.pnl >= 0 ? '+' : ''}₹{Math.abs(Math.round(s.pnl)).toLocaleString('en-IN')}
                          </div>
                          <div className="text-xs text-gray-400">₹{s.premium.toFixed(1)}</div>
                        </div>
                      </div>
                      {/* Bar indicator */}
                      <div className={`h-0.5 ${s.pnl >= 0 ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: `${barWidth}%` }} />
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3 text-center">Based on ₹{premium} premium · {qty} lot{qty > 1 ? 's' : ''} · {lotSize} qty/lot</p>
            </div>
          </div>
        </div>

        {/* How to use */}
        <div className="mt-8 bg-[#0D1117] border border-[#21262D] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-white mb-4">How to Use This Calculator</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-400">
            <div>
              <div className="font-semibold text-gray-100 mb-2">1. Select Instrument</div>
              <p>Click NIFTY, BANKNIFTY, etc. to load default lot sizes. Adjust spot & strike to your target levels.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-100 mb-2">2. Enter IV</div>
              <p>Get current IV from NSE option chain or check India VIX. Higher IV = more expensive options.</p>
            </div>
            <div>
              <div className="font-semibold text-gray-100 mb-2">3. Check Greeks</div>
              <p>Delta tells position sensitivity. Theta shows daily decay cost. Don't ignore Theta on long options!</p>
            </div>
            <div>
              <div className="font-semibold text-gray-100 mb-2">4. Analyze P&L</div>
              <p>Enter your actual premium paid to see real P&L at different price levels tomorrow.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 bg-gradient-to-r from-[#00C076] to-[#00a865] rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Practice options trading without risk</h3>
          <p className="text-[#00C076]/40 text-sm mb-4">Get ₹10 Lakh virtual capital. Trade NIFTY & BANKNIFTY options risk-free.</p>
          <Link href="/" className="inline-block bg-[#0D1117] text-[#00C076] font-bold px-8 py-3 rounded-xl hover:bg-[#161B22] transition-colors shadow-lg shadow-black/20">
            Join Waitlist — It's Free
          </Link>
        </div>
      </div>
    </div>
  );
}
