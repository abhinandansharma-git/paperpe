'use client';

import { useState, useEffect } from 'react';
import { Search, Settings, Maximize2, Plus, ChevronDown, ArrowUpRight, ArrowDownRight, Minus, BarChart2, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Generate candlestick data
const generateCandleData = (count: number, basePrice: number) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < count; i++) {
    const volatility = Math.random() * 0.02;
    const direction = Math.random() > 0.48 ? 1 : -1;
    const open = price;
    const close = price * (1 + direction * volatility);
    const high = Math.max(open, close) * (1 + Math.random() * 0.005);
    const low = Math.min(open, close) * (1 - Math.random() * 0.005);
    data.push({ open, high, low, close, volume: Math.random() * 1000000 + 500000 });
    price = close;
  }
  return data;
};

export default function ChartsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('NIFTY 50');
  const [timeframe, setTimeframe] = useState('15m');
  const [candleData, setCandleData] = useState(generateCandleData(50, 22400));
  const [currentPrice, setCurrentPrice] = useState(22456.80);
  const [change, setChange] = useState(1.24);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandleData(prev => {
        const last = prev[prev.length - 1];
        const newCandle = {
          open: last.close,
          close: last.close * (1 + (Math.random() - 0.48) * 0.003),
          high: 0,
          low: 0,
          volume: Math.random() * 1000000 + 500000
        };
        newCandle.high = Math.max(newCandle.open, newCandle.close) * (1 + Math.random() * 0.002);
        newCandle.low = Math.min(newCandle.open, newCandle.close) * (1 - Math.random() * 0.002);
        setCurrentPrice(newCandle.close);
        return [...prev.slice(1), newCandle];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const minPrice = Math.min(...candleData.map(c => c.low));
  const maxPrice = Math.max(...candleData.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candleData.map(c => c.volume));

  const candleWidth = 100 / candleData.length;

  return (
    <div className="min-h-screen bg-[#0a0e17] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-4 py-2 flex items-center justify-between bg-[#0d1117]">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold text-white">PaperPe</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/dashboard" className="text-slate-400 hover:text-white">Dashboard</Link>
            <Link href="/charts" className="text-white font-medium">Charts</Link>
            <Link href="/options" className="text-slate-400 hover:text-white">Options</Link>
            <Link href="/screener" className="text-slate-400 hover:text-white">Screener</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white rounded hover:bg-white/5">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-400 hover:text-white rounded hover:bg-white/5">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="border-b border-white/5 px-4 py-2 flex items-center gap-4 bg-[#0d1117]/50">
        {/* Symbol Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded hover:bg-white/10">
          <span className="text-white font-medium">{selectedSymbol}</span>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {/* Price Info */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white">₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
          </span>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 ml-4">
          {['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded text-sm ${
                timeframe === tf ? 'bg-[#00C076] text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded">
            <TrendingUp className="w-4 h-4" />
            Indicators
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded">
            <BarChart2 className="w-4 h-4" />
            Compare
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="flex-1 flex">
        {/* Chart */}
        <div className="flex-1 p-4">
          <div className="h-full bg-[#0d1117] rounded-lg border border-white/5 overflow-hidden flex flex-col">
            {/* Candlestick Chart */}
            <div className="flex-1 p-4 relative">
              <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="none">
                {/* Grid lines */}
                {[0, 20, 40, 60, 80].map(y => (
                  <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.2" />
                ))}
                
                {/* Candlesticks */}
                {candleData.map((candle, i) => {
                  const x = i * candleWidth + candleWidth / 2;
                  const isGreen = candle.close >= candle.open;
                  const bodyTop = 80 - ((Math.max(candle.open, candle.close) - minPrice) / priceRange) * 80;
                  const bodyBottom = 80 - ((Math.min(candle.open, candle.close) - minPrice) / priceRange) * 80;
                  const wickTop = 80 - ((candle.high - minPrice) / priceRange) * 80;
                  const wickBottom = 80 - ((candle.low - minPrice) / priceRange) * 80;
                  
                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={wickTop}
                        x2={x}
                        y2={wickBottom}
                        stroke={isGreen ? '#10b981' : '#ef4444'}
                        strokeWidth="0.15"
                      />
                      {/* Body */}
                      <rect
                        x={x - candleWidth * 0.35}
                        y={bodyTop}
                        width={candleWidth * 0.7}
                        height={Math.max(bodyBottom - bodyTop, 0.3)}
                        fill={isGreen ? '#10b981' : '#ef4444'}
                        rx="0.1"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Price Labels */}
              <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-between py-4 text-xs text-slate-500">
                <span>₹{maxPrice.toFixed(0)}</span>
                <span>₹{((maxPrice + minPrice) / 2).toFixed(0)}</span>
                <span>₹{minPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="h-20 p-4 pt-0 border-t border-white/5">
              <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
                {candleData.map((candle, i) => {
                  const x = i * candleWidth;
                  const height = (candle.volume / maxVolume) * 20;
                  const isGreen = candle.close >= candle.open;
                  return (
                    <rect
                      key={i}
                      x={x + candleWidth * 0.1}
                      y={20 - height}
                      width={candleWidth * 0.8}
                      height={height}
                      fill={isGreen ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)'}
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-64 border-l border-white/5 bg-[#0d1117]/50 p-4 hidden lg:block">
          <h3 className="text-sm font-medium text-white mb-4">Quick Trade</h3>
          
          <div className="space-y-3">
            <div className="flex rounded-lg bg-[#0a0e17] p-1">
              <button className="flex-1 py-2 rounded-md font-medium text-sm bg-emerald-500 text-white">
                BUY
              </button>
              <button className="flex-1 py-2 rounded-md font-medium text-sm text-slate-400 hover:text-white">
                SELL
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Quantity</label>
              <input
                type="number"
                defaultValue="50"
                className="w-full bg-[#0a0e17] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00C076]"
              />
            </div>

            <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm">
              Place Order
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <h3 className="text-sm font-medium text-white mb-4">Market Depth</h3>
            <div className="space-y-1 text-xs">
              {[5, 4, 3, 2, 1].map(i => (
                <div key={`bid-${i}`} className="flex items-center">
                  <div className="flex-1 h-4 bg-emerald-500/20 rounded-l" style={{ width: `${60 + i * 8}%` }} />
                  <span className="w-16 text-right text-slate-400">{22450 + i * 5}</span>
                </div>
              ))}
              <div className="h-px bg-[#00C076] my-2" />
              {[1, 2, 3, 4, 5].map(i => (
                <div key={`ask-${i}`} className="flex items-center">
                  <div className="flex-1 h-4 bg-red-500/20 rounded-l" style={{ width: `${70 - i * 6}%` }} />
                  <span className="w-16 text-right text-slate-400">{22460 + i * 5}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
