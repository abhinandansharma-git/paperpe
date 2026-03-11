'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const instruments = [
  { symbol: 'NIFTY', lotSize: 50, price: 22000, marginPct: 12 },
  { symbol: 'BANKNIFTY', lotSize: 30, price: 47000, marginPct: 15 },
  { symbol: 'FINNIFTY', lotSize: 65, price: 21000, marginPct: 14 },
  { symbol: 'SENSEX', lotSize: 20, price: 73000, marginPct: 12 },
  { symbol: 'CRUDEOIL', lotSize: 100, price: 6500, marginPct: 8 },
  { symbol: 'CRUDEOILM', lotSize: 10, price: 6500, marginPct: 8 },
  { symbol: 'GOLD', lotSize: 100, price: 62000, marginPct: 5 },
  { symbol: 'GOLDM', lotSize: 10, price: 62000, marginPct: 5 },
  { symbol: 'SILVER', lotSize: 30, price: 72000, marginPct: 6 },
  { symbol: 'SILVERM', lotSize: 5, price: 72000, marginPct: 6 },
];

export default function MarginCalculator() {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY');
  const [lots, setLots] = useState(1);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [optionType, setOptionType] = useState<'futures' | 'options'>('futures');

  const selected = instruments.find(i => i.symbol === selectedSymbol) || instruments[0];

  const results = useMemo(() => {
    const contractValue = selected.price * selected.lotSize * lots;
    const futuresMargin = contractValue * (selected.marginPct / 100);
    const optionMargin = tradeType === 'buy' 
      ? selected.price * 0.05 * selected.lotSize * lots // Premium only for buy
      : futuresMargin * 0.8; // Similar to futures for sell
    const margin = optionType === 'futures' ? futuresMargin : optionMargin;
    const exposure = contractValue;
    const leverage = margin > 0 ? contractValue / margin : 0;
    
    return { contractValue, margin, exposure, leverage };
  }, [selected, lots, tradeType, optionType]);

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
          <h1 className="text-3xl font-bold text-white mb-2 text-center">F&O Margin Calculator</h1>
          <p className="text-slate-400 text-center mb-8">Calculate margin requirements for NIFTY, BANKNIFTY & MCX</p>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl p-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Instrument</label>
                <select value={selectedSymbol} onChange={(e) => setSelectedSymbol(e.target.value)} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white">
                  <optgroup label="Index F&O">
                    {instruments.slice(0, 4).map(i => (
                      <option key={i.symbol} value={i.symbol}>{i.symbol} (Lot: {i.lotSize})</option>
                    ))}
                  </optgroup>
                  <optgroup label="MCX">
                    {instruments.slice(4).map(i => (
                      <option key={i.symbol} value={i.symbol}>{i.symbol} (Lot: {i.lotSize})</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Segment</label>
                  <div className="flex gap-2">
                    <button onClick={() => setOptionType('futures')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${optionType === 'futures' ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'}`}>Futures</button>
                    <button onClick={() => setOptionType('options')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${optionType === 'options' ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'}`}>Options</button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 block mb-1">Trade Type</label>
                  <div className="flex gap-2">
                    <button onClick={() => setTradeType('buy')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tradeType === 'buy' ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-400'}`}>Buy</button>
                    <button onClick={() => setTradeType('sell')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-400'}`}>Sell</button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-slate-400 block mb-1">Number of Lots</label>
                <input type="number" value={lots} onChange={(e) => setLots(Number(e.target.value))} min="1" className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Margin Required</h2>
            
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center mb-6">
              <div className="text-sm text-orange-400">Approximate Margin</div>
              <div className="text-4xl font-bold text-orange-500">{String.fromCharCode(8377)}{results.margin.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Contract Value</div>
                <div className="text-xl font-bold text-white">{String.fromCharCode(8377)}{results.contractValue.toLocaleString()}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Leverage</div>
                <div className="text-xl font-bold text-blue-500">{results.leverage.toFixed(1)}x</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Lot Size</div>
                <div className="text-xl font-bold text-white">{selected.lotSize}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Total Qty</div>
                <div className="text-xl font-bold text-white">{selected.lotSize * lots}</div>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-4">*Margins are approximate. Actual margins vary based on volatility and exchange rules.</p>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/dashboard" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">Practice Paper Trading</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
