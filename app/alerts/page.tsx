'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, Plus, Trash2, TrendingUp, TrendingDown, Check, X, Volume2 } from 'lucide-react';

const existingAlerts = [
  { id: 1, symbol: 'NIFTY', condition: 'above', price: 22500, current: 22340, status: 'active' },
  { id: 2, symbol: 'RELIANCE', condition: 'below', price: 2800, current: 2890, status: 'active' },
  { id: 3, symbol: 'BANKNIFTY', condition: 'above', price: 48000, current: 47650, status: 'active' },
  { id: 4, symbol: 'TATAMOTORS', condition: 'above', price: 950, current: 978, status: 'triggered', triggeredAt: '10:45 AM' },
  { id: 5, symbol: 'HDFCBANK', condition: 'below', price: 1600, current: 1623, status: 'active' },
];

const popularAlerts = [
  { symbol: 'NIFTY', level: 22500, reason: 'Key resistance' },
  { symbol: 'BANKNIFTY', level: 48000, reason: 'Psychological level' },
  { symbol: 'GOLD', level: 62000, reason: 'All-time high' },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(existingAlerts);
  const [showCreate, setShowCreate] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');
  const [newCondition, setNewCondition] = useState('above');
  const [newPrice, setNewPrice] = useState('');

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-3"><Bell className="w-8 h-8 text-[#00C076]" />Price Alerts</h1>
            <p className="text-neutral-500 mt-1">Get notified when price hits your target</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-5 py-3 bg-[#00C076] hover:bg-[#00a865] text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"><Plus className="w-5 h-5" />Create Alert</button>
        </div>

        {showCreate && (
          <div className="bg-neutral-50 rounded-xl p-6 border border-[#00C076]/30 mb-8">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">New Alert</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <input type="text" placeholder="Symbol (e.g. NIFTY)" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-[#00C076]" />
              <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)} className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 focus:outline-none focus:border-[#00C076]">
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
              <input type="number" placeholder="Target Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-[#00C076]" />
              <div className="flex gap-2">
                <button onClick={() => { setAlerts([...alerts, { id: Date.now(), symbol: newSymbol, condition: newCondition, price: parseFloat(newPrice), current: 0, status: 'active' }]); setShowCreate(false); setNewSymbol(''); setNewPrice(''); }} className="flex-1 py-3 bg-[#00C076] hover:bg-[#00a865] text-white rounded-lg font-medium">Create</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden mb-8">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
            <h3 className="font-semibold text-neutral-900">Your Alerts ({alerts.length})</h3>
            <div className="flex items-center gap-2 text-sm text-neutral-500"><Volume2 className="w-4 h-4" />Sound on</div>
          </div>
          <div className="divide-y divide-white/5">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 flex items-center justify-between ${alert.status === 'triggered' ? 'bg-[#00C076]/100/10' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.condition === 'above' ? 'bg-[#00C076]/100/20' : 'bg-red-500/100/20'}`}>
                    {alert.condition === 'above' ? <TrendingUp className="w-5 h-5 text-[#00C076]" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">{alert.symbol}</div>
                    <div className="text-sm text-neutral-500">{alert.condition === 'above' ? 'Above' : 'Below'} ₹{alert.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {alert.status === 'triggered' ? (
                    <div className="flex items-center gap-2 text-[#00C076]"><Check className="w-5 h-5" /><span className="text-sm">Triggered at {alert.triggeredAt}</span></div>
                  ) : (
                    <div className="text-right"><div className="text-neutral-900 font-medium">₹{alert.current?.toLocaleString()}</div><div className="text-xs text-neutral-500">Current</div></div>
                  )}
                  <button className="p-2 text-neutral-500 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
          <h3 className="font-semibold text-neutral-900 mb-4">Popular Alerts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {popularAlerts.map((alert, i) => (
              <button key={i} className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-left transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-neutral-900">{alert.symbol}</span>
                  <Plus className="w-4 h-4 text-neutral-500 group-hover:text-[#00C076]" />
                </div>
                <div className="text-lg font-semibold text-orange-400">₹{alert.level.toLocaleString()}</div>
                <div className="text-xs text-neutral-500">{alert.reason}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
