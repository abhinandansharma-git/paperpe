'use client';

import { BarChart3, PieChart, Target, Zap } from 'lucide-react';

export default function PerformanceStats() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Track Every Trade
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Detailed analytics to improve your strategy before going live
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Portfolio performance card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Portfolio Performance</h3>
            </div>

            {/* Mini bar chart */}
            <div className="flex items-end gap-1 h-32 mb-4">
              {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 72].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    background: height > 70 
                      ? 'linear-gradient(to top, #10b981, #34d399)' 
                      : 'linear-gradient(to top, #f97316, #fb923c)',
                  }}
                />
              ))}
            </div>

            <div className="flex justify-between text-xs text-slate-500">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-sm">Total Return</div>
                <div className="text-2xl font-bold text-emerald-400">+34.7%</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Max Drawdown</div>
                <div className="text-2xl font-bold text-white">-8.2%</div>
              </div>
            </div>
          </div>

          {/* Win rate card */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-orange" />
              </div>
              <h3 className="text-lg font-semibold text-white">Win Rate Analysis</h3>
            </div>

            {/* Donut chart visualization */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="12"
                />
                {/* Win segment */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${68 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">68%</span>
                <span className="text-sm text-slate-400">Win Rate</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <div className="text-emerald-400 font-semibold">127</div>
                <div className="text-xs text-slate-400">Wins</div>
              </div>
              <div className="p-2 rounded-lg bg-red-500/10">
                <div className="text-red-400 font-semibold">60</div>
                <div className="text-xs text-slate-400">Losses</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-500/10">
                <div className="text-slate-300 font-semibold">187</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
            </div>
          </div>

          {/* Strategy metrics */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <PieChart className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Strategy Breakdown</h3>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Momentum', allocation: 40, color: 'bg-orange' },
                { name: 'Mean Reversion', allocation: 30, color: 'bg-emerald-500' },
                { name: 'Breakout', allocation: 20, color: 'bg-blue-500' },
                { name: 'Scalping', allocation: 10, color: 'bg-purple-500' },
              ].map((strategy) => (
                <div key={strategy.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{strategy.name}</span>
                    <span className="text-white font-medium">{strategy.allocation}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strategy.color} rounded-full transition-all duration-500`}
                      style={{ width: `${strategy.allocation}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent trades */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
            </div>

            <div className="space-y-3">
              {[
                { symbol: 'RELIANCE', type: 'BUY', qty: 50, pnl: 2340, time: '2m ago' },
                { symbol: 'NIFTY PE', type: 'SELL', qty: 25, pnl: -890, time: '15m ago' },
                { symbol: 'INFY', type: 'BUY', qty: 100, pnl: 1560, time: '1h ago' },
                { symbol: 'HDFC CE', type: 'SELL', qty: 50, pnl: 4200, time: '2h ago' },
              ].map((trade, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      trade.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type}
                    </span>
                    <div>
                      <div className="text-white font-medium">{trade.symbol}</div>
                      <div className="text-xs text-slate-500">{trade.qty} qty • {trade.time}</div>
                    </div>
                  </div>
                  <div className={`font-semibold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trade.pnl >= 0 ? '+' : ''}₹{trade.pnl.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
