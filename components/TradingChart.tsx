'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

// Fixed initial data to avoid hydration mismatch
const INITIAL_PRICE = 22500;
const STATIC_INITIAL_DATA = Array.from({ length: 50 }, (_, i) => INITIAL_PRICE + (i - 25) * 10);

export default function TradingChart() {
  const [priceData, setPriceData] = useState(STATIC_INITIAL_DATA);
  const [currentPrice, setCurrentPrice] = useState(INITIAL_PRICE);
  const [prevPrice, setPrevPrice] = useState(INITIAL_PRICE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initialize with random data only on client
    const generateInitial = () => {
      const data = [];
      let price = INITIAL_PRICE;
      for (let i = 0; i < 50; i++) {
        const change = (Math.random() - 0.48) * 0.008;
        price = Math.max(price * (1 + change), INITIAL_PRICE * 0.7);
        data.push(price);
      }
      return data;
    };
    const initial = generateInitial();
    setPriceData(initial);
    setCurrentPrice(initial[initial.length - 1]);
    setPrevPrice(initial[initial.length - 2]);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setPriceData(prev => {
        const newPrice = prev[prev.length - 1] * (1 + (Math.random() - 0.48) * 0.005);
        setPrevPrice(prev[prev.length - 1]);
        setCurrentPrice(newPrice);
        return [...prev.slice(1), newPrice];
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [mounted]);

  const isUp = currentPrice > prevPrice;
  const dayChange = ((currentPrice - INITIAL_PRICE) / INITIAL_PRICE) * 100;
  const minPrice = Math.min(...priceData);
  const maxPrice = Math.max(...priceData);
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 100;
  const chartHeight = 100;
  const points = priceData.map((price, i) => {
    const x = (i / (priceData.length - 1)) * chartWidth;
    const y = chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm mb-4">
            <Activity className="w-4 h-4" />
            Live Paper Trading Preview
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Real-Time Market Simulation</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Practice with live market data. Zero risk. Full experience.</p>
        </div>

        <div className="glass rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">NIFTY 50</h3>
                <p className="text-slate-400 text-sm">NSE Index • Paper Trade</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className={`text-2xl md:text-3xl font-bold tabular-nums transition-colors duration-300 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`flex items-center justify-end gap-1 text-sm ${dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {dayChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%</span>
                  <span className="text-slate-500">today</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-48 md:h-64 mb-6">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dayChange >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={dayChange >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`} fill="url(#chartGradient)" />
              <polyline points={points} fill="none" stroke={dayChange >= 0 ? '#10b981' : '#ef4444'} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx={chartWidth} cy={chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight} r="2" fill={dayChange >= 0 ? '#10b981' : '#ef4444'} className="animate-pulse" />
            </svg>
            <div className="absolute left-0 top-0 text-xs text-slate-500">₹{maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div className="absolute left-0 bottom-0 text-xs text-slate-500">₹{minPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Open', value: `₹${INITIAL_PRICE.toLocaleString('en-IN')}` },
              { label: 'High', value: `₹${maxPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
              { label: 'Low', value: `₹${minPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` },
              { label: 'Volume', value: '2.4M' },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-3 rounded-lg bg-white/5">
                <div className="text-slate-400 text-xs mb-1">{stat.label}</div>
                <div className="text-white font-semibold">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 glass rounded-xl p-4 overflow-hidden">
          <div className="flex items-center gap-8 animate-scroll">
            {[
              { symbol: 'RELIANCE', price: 2847.50, change: 1.2 },
              { symbol: 'TCS', price: 4123.75, change: -0.8 },
              { symbol: 'INFY', price: 1876.25, change: 2.1 },
              { symbol: 'HDFC', price: 1654.00, change: 0.5 },
              { symbol: 'ICICI', price: 1098.50, change: -1.3 },
              { symbol: 'SBIN', price: 812.25, change: 1.8 },
              { symbol: 'WIPRO', price: 487.50, change: -0.2 },
              { symbol: 'BHARTI', price: 1456.75, change: 0.9 },
            ].map((stock, i) => (
              <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-white font-medium">{stock.symbol}</span>
                <span className="text-slate-300">₹{stock.price.toLocaleString('en-IN')}</span>
                <span className={stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {stock.change >= 0 ? '+' : ''}{stock.change}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
