'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const brokers = [
  { key: 'zerodha', name: 'Zerodha', color: '#387ed1' },
  { key: 'dhan', name: 'Dhan', color: '#00d09c' },
  { key: 'angelone', name: 'Angel One', color: '#e8272c' },
  { key: 'groww', name: 'Groww', color: '#5367ff' },
  { key: 'upstox', name: 'Upstox', color: '#6858c0' },
];

const SEGMENTS = [
  { id: 'fo', label: 'F&O' },
  { id: 'equity', label: 'Equity CNC' },
  { id: 'intraday', label: 'Intraday MIS' },
] as const;

function calcBrokerage(segment: string, buyPrice: number, sellPrice: number, quantity: number, brokerKey: string) {
  const turnover = (buyPrice + sellPrice) * quantity;
  const profit = (sellPrice - buyPrice) * quantity;
  const brokerage = segment === 'equity' ? 0 : 40; // ₹20 per order × 2
  const stt = segment === 'fo'
    ? sellPrice * quantity * 0.000625
    : segment === 'intraday'
    ? turnover * 0.00025
    : turnover * 0.001;
  const transactionCharges = turnover * 0.0000345;
  const gst = (brokerage + transactionCharges) * 0.18;
  const sebiCharges = turnover * 0.000001;
  const stampDuty = buyPrice * quantity * 0.00003;
  const totalCharges = brokerage + stt + transactionCharges + gst + sebiCharges + stampDuty;
  const netProfit = profit - totalCharges;
  return { brokerage, stt, transactionCharges, gst, sebiCharges, stampDuty, totalCharges, netProfit, turnover, profit };
}

export default function BrokerageCalculator() {
  const [segment, setSegment] = useState<'equity' | 'fo' | 'intraday'>('fo');
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(110);
  const [quantity, setQuantity] = useState(50);

  const results = useMemo(() =>
    brokers.map(b => ({ ...b, ...calcBrokerage(segment, buyPrice, sellPrice, quantity, b.key) })),
    [segment, buyPrice, sellPrice, quantity]
  );

  const summary = results[0];
  const bestBroker = results.reduce((a, b) => a.totalCharges < b.totalCharges ? a : b);

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
              <BarChart3 className="w-5 h-5 text-[#00C076]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Brokerage Calculator</h1>
              <p className="text-gray-400 text-sm">Compare trading charges across all major Indian brokers</p>
            </div>
          </div>
        </div>

        {/* Inputs */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-6 mb-6">
          {/* Segment tabs */}
          <div className="flex gap-2 mb-6">
            {SEGMENTS.map(s => (
              <button key={s.id} onClick={() => setSegment(s.id as any)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${segment === s.id ? 'bg-[#00C076] text-[#0D1117]' : 'bg-[#0D1117] border border-[#21262D] text-gray-400 hover:text-white'}`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Buy Price (₹)', value: buyPrice, set: setBuyPrice },
              { label: 'Sell Price (₹)', value: sellPrice, set: setSellPrice },
              { label: 'Quantity', value: quantity, set: setQuantity },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-sm text-gray-400 mb-1.5">{f.label}</label>
                <input type="number" value={f.value} onChange={e => f.set(Number(e.target.value))}
                  className="w-full bg-[#0D1117] border border-[#21262D] focus:border-[#00C076] rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors" />
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-[#0D1117] border border-[#21262D] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Turnover</p>
              <p className="text-lg font-bold text-white">₹{summary.turnover.toLocaleString()}</p>
            </div>
            <div className="bg-[#0D1117] border border-[#21262D] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Gross P&L</p>
              <p className={`text-lg font-bold ${summary.profit >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>
                {summary.profit >= 0 ? '+' : ''}₹{summary.profit.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#0D1117] border border-[#21262D] rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-1">Best Broker</p>
              <p className="text-lg font-bold text-[#00C076]">{bestBroker.name}</p>
            </div>
          </div>
        </div>

        {/* Broker Comparison */}
        <div className="bg-[#161B22] border border-[#21262D] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#21262D]">
            <h2 className="font-semibold text-white">Broker Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#21262D] text-gray-400 text-xs">
                  <th className="text-left p-4 font-medium">Broker</th>
                  <th className="text-right p-4 font-medium">Brokerage</th>
                  <th className="text-right p-4 font-medium">STT</th>
                  <th className="text-right p-4 font-medium">GST</th>
                  <th className="text-right p-4 font-medium">Other</th>
                  <th className="text-right p-4 font-medium">Total Charges</th>
                  <th className="text-right p-4 font-medium">Net P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262D]">
                {results.map(r => (
                  <tr key={r.key} className={`transition-colors ${r.key === bestBroker.key ? 'bg-[#00C076]/5' : 'hover:bg-[#1c2128]'}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                        <span className="font-medium text-white">{r.name}</span>
                        {r.key === bestBroker.key && <span className="text-xs bg-[#00C076]/10 text-[#00C076] border border-[#00C076]/20 px-1.5 py-0.5 rounded-full">Best</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right text-gray-300">₹{r.brokerage.toFixed(2)}</td>
                    <td className="p-4 text-right text-gray-300">₹{r.stt.toFixed(2)}</td>
                    <td className="p-4 text-right text-gray-300">₹{r.gst.toFixed(2)}</td>
                    <td className="p-4 text-right text-gray-300">₹{(r.sebiCharges + r.stampDuty + r.transactionCharges).toFixed(2)}</td>
                    <td className="p-4 text-right font-semibold text-red-400">₹{r.totalCharges.toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold ${r.netProfit >= 0 ? 'text-[#00C076]' : 'text-red-400'}`}>
                      {r.netProfit >= 0 ? '+' : ''}₹{r.netProfit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Charges are approximate. Actual charges may vary slightly based on broker fee structure changes.
        </p>
      </div>
    </div>
  );
}
