'use client';

import Link from 'next/link';
import { Calculator, TrendingUp, BarChart3, Shield, ExternalLink, ArrowLeft, Sparkles, ChevronRight } from 'lucide-react';

const ourTools = [
  {
    name: 'Option Calculator',
    desc: 'Calculate option Greeks (Delta, Gamma, Theta, Vega), theoretical price, P&L scenarios and breakeven points using Black-Scholes model.',
    href: '/calculator',
    icon: Calculator,
    color: '#8b5cf6',
    tag: 'Options',
    features: ['Black-Scholes pricing', 'All Greeks', 'P&L scenarios', 'Breakeven analysis'],
  },
  {
    name: 'Position Size Calculator',
    desc: 'Calculate optimal position size based on your risk tolerance. Never over-risk on any single trade.',
    href: '/tools/position-size',
    icon: TrendingUp,
    color: '#3b82f6',
    tag: 'Risk',
    features: ['Risk-based sizing', 'Stop loss calc', 'Max lots', 'Portfolio % risk'],
  },
  {
    name: 'Brokerage Calculator',
    desc: 'Compare brokerage charges across Zerodha, Groww, Angel One, Upstox and more. Know exact trading costs.',
    href: '/tools/brokerage',
    icon: BarChart3,
    color: '#00C076',
    tag: 'Costs',
    features: ['6+ brokers', 'F&O charges', 'STT, GST, stamp', 'Net P&L'],
  },
  {
    name: 'Margin Calculator',
    desc: 'Calculate margin requirements for NIFTY, BANKNIFTY, and stock F&O. Know capital needed before trading.',
    href: '/tools/margin',
    icon: Shield,
    color: '#f59e0b',
    tag: 'Margin',
    features: ['SPAN + Exposure', 'Index & MCX', 'Futures & Options', 'Leverage ratio'],
  },
];

const externalTools = [
  { name: 'TradingView', url: 'https://tradingview.com', desc: 'Best charting platform in the world' },
  { name: 'Sensibull', url: 'https://sensibull.com', desc: 'Options strategy builder and analysis' },
  { name: 'Screener.in', url: 'https://screener.in', desc: 'Fundamental analysis for Indian stocks' },
  { name: 'Zerodha Varsity', url: 'https://zerodha.com/varsity', desc: 'Free trading education by Zerodha' },
  { name: 'NSE Option Chain', url: 'https://nseindia.com/option-chain', desc: 'Official NIFTY/BANKNIFTY option chain' },
  { name: 'Opstra', url: 'https://opstra.definedge.com', desc: 'Free options analytics platform' },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#0D1117] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00C076] rounded-lg flex items-center justify-center font-bold text-[#0D1117] text-sm">P</div>
            <span className="font-semibold text-lg">PaperPe</span>
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-14 px-6 border-b border-[#21262D] overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C076]/10 border border-[#00C076]/20 rounded-full text-[#00C076] text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5" /> 100% Free — No Login Required
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate-fade-in-up" style={{animationDelay:'0.1s'}}>
            Trading <span className="text-gradient">Calculators</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay:'0.2s'}}>
            The tools every Indian F&O trader needs. Options pricing, position sizing, brokerage comparison, margin requirements — all free, forever.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">PaperPe Tools</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {ourTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="group">
                <div className="soul-card border-gradient p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${tool.color}20` }}>
                      <tool.icon className="w-6 h-6" style={{ color: tool.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white group-hover:text-[#00C076] transition-colors">{tool.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full border" style={{ color: tool.color, borderColor: `${tool.color}40`, background: `${tool.color}10` }}>{tool.tag}</span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">{tool.desc}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tool.features.map((f) => (
                          <span key={f} className="text-xs bg-[#0D1117] text-gray-400 px-2 py-1 rounded-lg border border-[#21262D]">{f}</span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 flex-shrink-0 mt-0.5 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* External Resources */}
      <section className="py-14 px-6 border-t border-[#21262D]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Recommended Resources</h2>
          <p className="text-gray-500 text-sm mb-6">External tools we recommend for Indian traders</p>
          <div className="grid md:grid-cols-3 gap-4">
            {externalTools.map((tool) => (
              <a key={tool.url} href={tool.url} target="_blank" rel="noopener noreferrer"
                className="bg-[#161B22] border border-[#21262D] hover:border-[#30363D] rounded-xl p-4 flex items-start gap-3 transition-all group">
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-300 flex-shrink-0 mt-0.5 transition-colors" />
                <div>
                  <h3 className="font-medium text-white text-sm">{tool.name}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{tool.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 border-t border-[#21262D]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Need professional-grade signals?</h2>
          <p className="text-gray-400 mb-6">Check out our premium TradingView indicators — battle-tested for Indian markets.</p>
          <Link href="/indicators" className="inline-flex items-center gap-2 bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-bold px-6 py-3 rounded-xl transition-colors">
            View Indicators <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
