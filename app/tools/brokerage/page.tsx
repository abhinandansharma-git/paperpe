'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

const brokers = {
  zerodha: { name: 'Zerodha', equity: 0, fo: 20, intraday: 20 },
  dhan: { name: 'Dhan', equity: 0, fo: 20, intraday: 20 },
  angelone: { name: 'Angel One', equity: 0, fo: 20, intraday: 20 },
  groww: { name: 'Groww', equity: 0, fo: 20, intraday: 20 },
  upstox: { name: 'Upstox', equity: 20, fo: 20, intraday: 20 },
};

export default function BrokerageCalculator() {
  const [segment, setSegment] = useState<'equity' | 'fo' | 'intraday'>('fo');
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(110);
  const [quantity, setQuantity] = useState(50);

  const results = useMemo(() => {
    const turnover = (buyPrice + sellPrice) * quantity;
    const profit = (sellPrice - buyPrice) * quantity;
    
    const calculations = Object.entries(brokers).map(([key, broker]) => {
      const brokerage = segment === 'equity' ? 0 : Math.min(40, broker.fo * 2); // Rs 20 per order, 2 orders
      const stt = segment === 'fo' ? sellPrice * quantity * 0.000625 : turnover * 0.001; // F&O: 0.0625% on sell, Equity: 0.1%
      const transactionCharges = turnover * 0.0000345; // NSE charges
      const gst = (brokerage + transactionCharges) * 0.18;
      const sebiCharges = turnover * 0.000001;
      const stampDuty = buyPrice * quantity * 0.00003;
      
      const totalCharges = brokerage + stt + transactionCharges + gst + sebiCharges + stampDuty;
      const netProfit = profit - totalCharges;
      
      return {
        broker: broker.name,
        brokerage,
        stt,
        transactionCharges,
        gst,
        sebiCharges,
        stampDuty,
        totalCharges,
        netProfit,
      };
    });
    
    return { turnover, profit, calculations };
  }, [segment, buyPrice, sellPrice, quantity]);

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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Brokerage Calculator</h1>
          <p className="text-slate-400 text-center mb-8">Compare brokerage charges across Indian brokers</p>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex gap-2 mb-4">
              {(['equity', 'fo', 'intraday'] as const).map((s) => (
                <button key={s} onClick={() => setSegment(s)} className={`flex-1 py-2 rounded-lg font-medium capitalize transition-colors ${segment === s ? 'bg-orange-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {s === 'fo' ? 'F&O' : s}
                </button>
              ))}
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Buy Price</label>
                <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Sell Price</label>
                <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">Quantity</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full p-3 rounded-lg bg-[#0a0e17] border border-white/10 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Turnover</div>
                <div className="text-xl font-bold text-white">{String.fromCharCode(8377)}{results.turnover.toLocaleString()}</div>
              </div>
              <div className="bg-[#0a0e17] rounded-lg p-4 text-center">
                <div className="text-sm text-slate-400">Gross P&L</div>
                <div className={`text-xl font-bold ${results.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{String.fromCharCode(8377)}{results.profit.toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#131722] border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#0a0e17]">
                <tr>
                  <th className="text-left text-slate-400 p-4">Broker</th>
                  <th className="text-right text-slate-400 p-4">Brokerage</th>
                  <th className="text-right text-slate-400 p-4">STT</th>
                  <th className="text-right text-slate-400 p-4">Other</th>
                  <th className="text-right text-slate-400 p-4">Total</th>
                  <th className="text-right text-slate-400 p-4">Net P&L</th>
                </tr>
              </thead>
              <tbody>
                {results.calculations.map((calc, i) => (
                  <tr key={i} className="border-t border-white/5">
                    <td className="p-4 text-white font-medium">{calc.broker}</td>
                    <td className="p-4 text-right text-slate-300">{String.fromCharCode(8377)}{calc.brokerage.toFixed(2)}</td>
                    <td className="p-4 text-right text-slate-300">{String.fromCharCode(8377)}{calc.stt.toFixed(2)}</td>
                    <td className="p-4 text-right text-slate-300">{String.fromCharCode(8377)}{(calc.gst + calc.transactionCharges + calc.sebiCharges + calc.stampDuty).toFixed(2)}</td>
                    <td className="p-4 text-right text-orange-400 font-medium">{String.fromCharCode(8377)}{calc.totalCharges.toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold ${calc.netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{String.fromCharCode(8377)}{calc.netProfit.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-slate-400 mb-4">Open a demat account with our partner brokers</p>
            <Link href="/brokers" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold">Compare Brokers</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
