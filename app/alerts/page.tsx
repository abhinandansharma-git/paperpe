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
    <div className="min-h-screen bg-[#0a0e17]">
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
              <Link href="/alerts" className="text-white font-medium">Alerts</Link>
              <Link href="/journal" className="text-slate-400 hover:text-white">Journal</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3"><Bell className="w-8 h-8 text-[#00C076]" />Price Alerts</h1>
            <p className="text-slate-400 mt-1">Get notified when price hits your target</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="px-5 py-3 bg-[#00C076] hover:bg-[#00a865] text-white rounded-xl font-semibold flex items-center gap-2 transition-colors"><Plus className="w-5 h-5" />Create Alert</button>
        </div>

        {showCreate && (
          <div className="bg-[#141820] rounded-xl p-6 border border-[#00C076]/30 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">New Alert</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <input type="text" placeholder="Symbol (e.g. NIFTY)" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value.toUpperCase())} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00C076]" />
              <select value={newCondition} onChange={(e) => setNewCondition(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00C076]">
                <option value="above">Price Above</option>
                <option value="below">Price Below</option>
              </select>
              <input type="number" placeholder="Target Price" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#00C076]" />
              <div className="flex gap-2">
                <button onClick={() => { setAlerts([...alerts, { id: Date.now(), symbol: newSymbol, condition: newCondition, price: parseFloat(newPrice), current: 0, status: 'active' }]); setShowCreate(false); setNewSymbol(''); setNewPrice(''); }} className="flex-1 py-3 bg-[#00C076] hover:bg-[#00a865] text-white rounded-lg font-medium">Create</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#141820] rounded-xl border border-white/5 overflow-hidden mb-8">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-semibold text-white">Your Alerts ({alerts.length})</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500"><Volume2 className="w-4 h-4" />Sound on</div>
          </div>
          <div className="divide-y divide-white/5">
            {alerts.map((alert) => (
              <div key={alert.id} className={`p-4 flex items-center justify-between ${alert.status === 'triggered' ? 'bg-emerald-500/10' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.condition === 'above' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {alert.condition === 'above' ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{alert.symbol}</div>
                    <div className="text-sm text-slate-400">{alert.condition === 'above' ? 'Above' : 'Below'} ₹{alert.price.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {alert.status === 'triggered' ? (
                    <div className="flex items-center gap-2 text-emerald-400"><Check className="w-5 h-5" /><span className="text-sm">Triggered at {alert.triggeredAt}</span></div>
                  ) : (
                    <div className="text-right"><div className="text-white font-medium">₹{alert.current?.toLocaleString()}</div><div className="text-xs text-slate-500">Current</div></div>
                  )}
                  <button className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#141820] rounded-xl p-6 border border-white/5">
          <h3 className="font-semibold text-white mb-4">Popular Alerts</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {popularAlerts.map((alert, i) => (
              <button key={i} className="p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors group">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{alert.symbol}</span>
                  <Plus className="w-4 h-4 text-slate-500 group-hover:text-[#00C076]" />
                </div>
                <div className="text-lg font-semibold text-orange-400">₹{alert.level.toLocaleString()}</div>
                <div className="text-xs text-slate-500">{alert.reason}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
