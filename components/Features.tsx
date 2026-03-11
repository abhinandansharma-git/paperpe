'use client';

import { BarChart3, LineChart, Layers, Zap, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: LineChart,
    title: 'Live Charts',
    description: 'Professional candlestick charts with multiple timeframes. Real-time price updates with volume analysis.',
    link: '/charts',
    color: 'emerald',
  },
  {
    icon: Layers,
    title: 'Options Chain',
    description: 'Full option chain with OI, IV, and PCR analysis. Track call/put buildup and identify support/resistance.',
    link: '/options',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Stock Screener',
    description: 'Scan stocks by RSI, MACD, volume, and custom signals. Find bullish breakouts and oversold opportunities.',
    link: '/screener',
    color: 'purple',
  },
  {
    icon: Zap,
    title: 'Instant Execution',
    description: 'Place paper trades instantly. Track P&L in real-time. Exit positions with one click.',
    link: '/dashboard',
    color: 'orange',
  },
  {
    icon: Shield,
    title: 'Zero Risk',
    description: 'Practice with ₹10 lakh virtual capital. Make mistakes, learn lessons, lose nothing real.',
    link: '/dashboard',
    color: 'cyan',
  },
  {
    icon: Globe,
    title: 'F&O + MCX',
    description: 'Trade NIFTY, BANKNIFTY options and MCX commodities. Full Indian market coverage.',
    link: '/options',
    color: 'rose',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything you need to
            <span className="text-orange"> trade smart</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Professional-grade tools for testing and refining your trading strategies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="glass rounded-2xl p-8 group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-white/20"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 text-${feature.color}-500`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-orange transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
