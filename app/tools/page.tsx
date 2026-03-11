'use client';

import Link from 'next/link';
import { Calculator, TrendingUp, BarChart3, Shield, ExternalLink, ArrowLeft, Sparkles } from 'lucide-react';

const ourTools = [
  {
    name: 'Option Calculator',
    desc: 'Calculate option Greeks (Delta, Gamma, Theta, Vega), theoretical price, P&L scenarios, and breakeven points using Black-Scholes model.',
    href: '/calculator',
    icon: Calculator,
    color: 'from-violet-500 to-purple-500',
    features: ['Black-Scholes pricing', 'All Greeks calculated', 'P&L at different prices', 'Breakeven analysis']
  },
  {
    name: 'Position Size Calculator',
    desc: 'Calculate optimal position size based on your risk tolerance. Never risk more than you can afford to lose on any single trade.',
    href: '/tools/position-size',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    features: ['Risk-based sizing', 'Stop loss calculation', 'Max lots recommendation', 'Portfolio % risk']
  },
  {
    name: 'Brokerage Calculator',
    desc: 'Compare brokerage charges across Zerodha, Groww, Angel One, Upstox and more. Know your exact trading costs before you trade.',
    href: '/tools/brokerage',
    icon: BarChart3,
    color: 'from-emerald-500 to-green-500',
    features: ['6+ brokers compared', 'F&O charges included', 'STT, stamp duty, GST', 'Net P&L calculation']
  },
  {
    name: 'Margin Calculator',
    desc: 'Calculate margin requirements for NIFTY, BANKNIFTY, and stock F&O. Know how much capital you need before taking a position.',
    href: '/tools/margin',
    icon: Shield,
    color: 'from-orange-500 to-amber-500',
    features: ['SPAN + Exposure margin', 'All F&O segments', 'Intraday vs delivery', 'Live margin updates']
  },
];

const externalTools = [
  { name: 'TradingView', url: 'https://tradingview.com', desc: 'Best charting platform in the world' },
  { name: 'Sensibull', url: 'https://sensibull.com', desc: 'Options strategy builder and analysis' },
  { name: 'Screener.in', url: 'https://screener.in', desc: 'Fundamental analysis for Indian stocks' },
  { name: 'Zerodha Varsity', url: 'https://zerodha.com/varsity', desc: 'Free trading education' },
  { name: 'NSE Option Chain', url: 'https://nseindia.com/option-chain', desc: 'Official NIFTY/BANKNIFTY chain' },
  { name: 'Opstra', url: 'https://opstra.definedge.com', desc: 'Free options analytics' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center font-bold text-white">P</div>
            <span className="font-semibold text-xl">PaperPe</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-blue-500 flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> 100% Free Tools
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trading Calculators</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Professional-grade calculators for Indian F&O traders. Calculate options pricing, position sizes, brokerage costs, and margin requirements.
          </p>
        </div>
      </section>

      {/* Our Tools */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">PaperPe Tools</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {ourTools.map((tool, i) => (
              <Link key={i} href={tool.href} className="group block">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center flex-shrink-0`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{tool.name}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-4">{tool.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tool.features.map((f, j) => (
                          <span key={j} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{f}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recommended Resources</h2>
          <p className="text-gray-500 mb-8">External tools we recommend for Indian traders</p>
          <div className="grid md:grid-cols-3 gap-4">
            {externalTools.map((tool, i) => (
              <a key={i} href={tool.url} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex items-start gap-3">
                <ExternalLink className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-gray-500 text-sm">{tool.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Want more powerful tools?</h2>
          <p className="text-gray-500 mb-6">Check out our premium TradingView indicators for professional-grade signals.</p>
          <Link href="/indicators" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            View Indicators
          </Link>
        </div>
      </section>
    </div>
  );
}
