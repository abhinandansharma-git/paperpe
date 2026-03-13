'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

const instruments = [
  { symbol: 'NIFTY', category: 'Index F&O', lotSize: 50, price: 22000, marginPct: 12 },
  { symbol: 'BANKNIFTY', category: 'Index F&O', lotSize: 30, price: 47000, marginPct: 15 },
  { symbol: 'FINNIFTY', category: 'Index F&O', lotSize: 65, price: 21000, marginPct: 14 },
  { symbol: 'SENSEX', category: 'Index F&O', lotSize: 20, price: 73000, marginPct: 12 },
  { symbol: 'CRUDEOIL', category: 'MCX', lotSize: 100, price: 6500, marginPct: 8 },
  { symbol: 'CRUDEOILM', category: 'MCX', lotSize: 10, price: 6500, marginPct: 8 },
  { symbol: 'GOLD', category: 'MCX', lotSize: 100, price: 62000, marginPct: 5 },
  { symbol: 'GOLDM', category: 'MCX', lotSize: 10, price: 62000, marginPct: 5 },
  { symbol: 'SILVER', category: 'MCX', lotSize: 30, price: 72000, marginPct: 6 },
  { symbol: 'SILVERM', category: 'MCX', lotSize: 5, price: 72000, marginPct: 6 },
];

const categories = ['All', 'Index F&O', 'MCX'];

export default function MarginCalculator() {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [lots, setLots] = useState(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [optionType, setOptionType] = useState<'futures' | 'options'>('futures');
  const [category, setCategory] = useState('All');

  const selected = instruments.find(i => i.symbol === selectedSymbol) || instruments[0];

  const results = useMemo(() => {
    const contractValue = selected.price * selected.lotSize * lots;
    const futuresMargin = contractValue * (selected.marginPct / 100);
    const spanMargin = futuresMargin * 0.7;
    const exposureMargin = futuresMargin * 0.3;
    const optionMargin = tradeType === 'buy'
      ? selected.price * 0.05 * selected.lotSize * lots
      : futuresMargin * 0.8;
    const margin = optionType === 'futures' ? futuresMargin : optionMargin;
    const leverage = margin > 0 ? contractValue / margin : 0;
    return { contractValue, margin, spanMargin, exposureMargin, leverage };
  }, [selected, lots, tradeType, optionType]);

  const filteredInstruments = category === 'All' ? instruments : instruments.filter(i => i.category === category);

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
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">F&O Margin Calculator</h1>
              <p className="text-gray-400 text-sm">Calculate margin requirements for Index F&O and MCX instruments</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Parameters</h2>

            {/* Category filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Category</label>
              <div className="flex gap-2">
                {categories.map(c => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${category === c ? 'bg-[#00C076] text-[#0D1117]' : 'bg-[#0D1117] border border-[#21262D] text-gray-400 hover:text-white'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Instrument */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Instrument</label>
              <select value={selectedSymbol} onChange={e => setSelectedSymbol(e.target.value)}
                className="w-full bg-[#0D1117] border border-[#21262D] focus:border-[#00C076] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors appearance-none">
                {filteredInstruments.map(i => (
                  <option key={i.symbol} value={i.symbol}>{i.symbol} — Lot: {i.lotSize} | ~₹{i.price.toLocaleString()}</option>
                ))}
              </select>
            </div>

            {/* Segment */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Segment</label>
              <div className="grid grid-cols-2 gap-2">
                {(['futures', 'options'] as const).map(t => (
                  <button key={t} onClick={() => setOptionType(t)}
                    className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${optionType === t ? 'bg-amber-500 text-[#0D1117]' : 'bg-[#0D1117] border border-[#21262D] text-gray-400 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy/Sell */}
            {optionType === 'options' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Position Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['buy', 'sell'] as const).map(t => (
                    <button key={t} onClick={() => setTradeType(t)}
                      className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tradeType === t
                        ? t === 'buy' ? 'bg-[#00C076] text-[#0D1117]' : 'bg-red-500 text-white'
                        : 'bg-[#0D1117] border border-[#21262D] text-gray-400 hover:text-white'}`}>
                      {t === 'buy' ? '▲ Buy' : '▼ Sell'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lots */}
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Number of Lots</label>
              <input type="number" value={lots} min={1} onChange={e => setLots(Math.max(1, Number(e.target.value)))}
                className="w-full bg-[#0D1117] border border-[#21262D] focus:border-[#00C076] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
              <p className="text-xs text-gray-500 mt-1">{lots} lot × {selected.lotSize} units = {lots * selected.lotSize} units</p>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Main result */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 text-center">
              <p className="text-gray-400 text-sm mb-1">Required Margin</p>
              <p className="text-4xl font-bold text-amber-400">₹{Math.round(results.margin).toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">{optionType === 'futures' ? 'SPAN + Exposure margin' : `${tradeType === 'buy' ? 'Premium (option buy)' : 'SPAN margin (option sell)'}`}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Contract Value</p>
                <p className="text-lg font-bold text-white">₹{Math.round(results.contractValue).toLocaleString()}</p>
              </div>
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Leverage</p>
                <p className="text-lg font-bold text-[#00C076]">{results.leverage.toFixed(1)}x</p>
              </div>
              {optionType === 'futures' && (
                <>
                  <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">SPAN Margin</p>
                    <p className="text-lg font-bold text-white">₹{Math.round(results.spanMargin).toLocaleString()}</p>
                  </div>
                  <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Exposure Margin</p>
                    <p className="text-lg font-bold text-white">₹{Math.round(results.exposureMargin).toLocaleString()}</p>
                  </div>
                </>
              )}
            </div>

            {/* Instrument details */}
            <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{selected.symbol} Details</p>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Lot Size', value: selected.lotSize },
                  { label: 'Approx. Price', value: `₹${selected.price.toLocaleString()}` },
                  { label: 'Margin %', value: `${selected.marginPct}%` },
                  { label: 'Category', value: selected.category },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-gray-400">
                    <span>{row.label}</span>
                    <span className="text-white font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">Margin values are indicative. Actual margins set by exchanges may vary.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
