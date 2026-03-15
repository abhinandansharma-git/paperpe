'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, ChevronRight, BookOpen } from 'lucide-react';

const posts = [
  { slug: 'why-95-percent-traders-lose-money', title: 'Why 95% of Traders Lose Money in F&O (And How to Be in the 5%)', excerpt: 'SEBI data confirms 9 out of 10 F&O traders lose money. Here is exactly why — and the specific habits that separate profitable traders from the rest.', category: 'Trading Psychology', readTime: '11 min', date: 'Mar 15, 2026' },
  { slug: 'how-to-read-option-chain', title: 'How to Read an Option Chain: Complete Guide for Indian Traders', excerpt: 'The option chain contains everything about market sentiment. Learn to read OI, volume, PCR, and IV to make better trading decisions in NIFTY and BANKNIFTY.', category: 'Options', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'options-buying-vs-selling', title: 'Options Buying vs Selling: Which is Better for Indian Traders?', excerpt: 'The eternal debate in F&O trading. Options buyers risk limited capital but win rarely. Options sellers collect premium but face unlimited risk. Here is the truth.', category: 'Options', readTime: '12 min', date: 'Mar 15, 2026' },
  { slug: 'zerodha-vs-upstox-vs-dhan', title: 'Zerodha vs Upstox vs Dhan vs Angel One: Best Broker for F&O 2026', excerpt: 'Choosing the wrong broker costs you money every trade. Detailed comparison of India top brokers for options and futures trading — brokerage, margin, platform, and reliability.', category: 'Brokers', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'open-interest-analysis', title: 'Open Interest Analysis: How to Use OI Data to Trade NIFTY', excerpt: 'Open Interest is the most underused indicator in Indian options markets. Learn how to read OI build-up, unwinding, and changes to predict NIFTY support and resistance.', category: 'Options', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'nifty-options-lot-size-margin', title: 'NIFTY Options Lot Size, Margin & Capital Required in 2026', excerpt: 'Exact lot sizes, margin requirements, and minimum capital needed to trade NIFTY, BANKNIFTY, FINNIFTY, and MCX options in 2026. Updated with current SEBI regulations.', category: 'Options', readTime: '7 min', date: 'Mar 15, 2026' },
  { slug: 'iron-condor-strategy-india', title: 'Iron Condor Strategy: How to Profit in Sideways NIFTY Markets', excerpt: 'When NIFTY is rangebound, Iron Condor lets you profit from time decay. Learn how to set up, manage, and exit this popular options selling strategy with Indian market examples.', category: 'Strategies', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'mcx-gold-trading-guide', title: 'MCX Gold Trading Guide: GOLDM vs GOLD, Timings, and Strategies', excerpt: 'Everything you need to trade gold on MCX India. GOLD vs GOLDM contracts, trading hours, margin requirements, what moves gold prices, and practical trading strategies.', category: 'Commodities', readTime: '9 min', date: 'Mar 14, 2026' },
  { slug: 'theta-decay-options', title: 'Theta Decay Explained: Why Time Destroys Option Buyers', excerpt: 'Every option loses value every day — even when the market does not move. Understanding theta decay is the single most important concept for Indian options traders.', category: 'Options', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'iv-crush-explained', title: 'IV Crush: Why Your Options Lose Value Even When You Are Right', excerpt: 'You predicted the RBI policy correctly, bought options, the market moved your way — and you still lost money. This is IV crush. Here is what it is and how to avoid it.', category: 'Options', readTime: '8 min', date: 'Mar 15, 2026' },
  { slug: 'top-fo-trading-mistakes', title: 'Top 10 F&O Trading Mistakes Beginners Make (And How to Fix Them)', excerpt: 'Most traders repeat the same 10 mistakes that guarantee losses. Here is the complete list — with specific fixes for each.', category: 'Trading Psychology', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'how-to-trade-budget-day', title: 'How to Trade Budget Day, RBI Policy & US Fed Meetings', excerpt: 'A precise playbook for trading India Budget, RBI policy announcements, and FOMC meetings. Know what to do and what to avoid.', category: 'Strategies', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'bull-put-spread-bear-call-spread', title: 'Bull Put Spread & Bear Call Spread: Low Risk Options Strategies', excerpt: 'Credit spreads let you collect premium with defined maximum loss. Step-by-step guide with real NIFTY examples.', category: 'Strategies', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'intraday-vs-options-trading', title: 'Intraday Trading vs Options Trading: Which is Better for You?', excerpt: 'An honest comparison of stock intraday and F&O options trading — capital, time, taxes, win rate, and personality fit.', category: 'Trading Psychology', readTime: '8 min', date: 'Mar 15, 2026' },
  { slug: 'nifty-banknifty-trading-psychology', title: 'Trading Psychology: Why Smart People Lose Money in F&O', excerpt: 'Intelligence does not predict trading success. The problem is psychological, not intellectual. A deep dive into the biases that destroy traders.', category: 'Trading Psychology', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'nifty-options-trading', title: 'NIFTY Options Trading: Complete Beginner Guide', excerpt: 'Learn how to trade NIFTY options from scratch. Understand calls, puts, strikes, expiry, and strategies that actually work in Indian markets.', category: 'Options', readTime: '12 min', date: 'Mar 1, 2026' },
  { slug: 'mcx-trading-beginners', title: 'MCX Trading for Beginners: Gold, Crude & Silver', excerpt: 'Complete guide to commodity trading on MCX. Learn market timings, lot sizes, margin requirements, and winning strategies.', category: 'Commodities', readTime: '10 min', date: 'Mar 1, 2026' },
  { slug: 'options-greeks', title: 'Options Greeks Explained: Delta, Theta, Gamma, Vega', excerpt: 'Understand the Greeks without complex math. Learn how Delta, Theta, Gamma, and Vega affect your option positions.', category: 'Options', readTime: '15 min', date: 'Feb 28, 2026' },
  { slug: 'paper-trading-benefits', title: 'Why Paper Trading is Essential Before Going Live', excerpt: 'Most traders lose money in their first year. Learn why paper trading can save you lakhs and build real confidence.', category: 'Trading Psychology', readTime: '8 min', date: 'Feb 28, 2026' },
  { slug: 'banknifty-vs-nifty', title: 'BANKNIFTY vs NIFTY: Which Should You Trade?', excerpt: 'Compare BANKNIFTY and NIFTY options. Understand the differences in volatility, premiums, and which suits your trading style.', category: 'Options', readTime: '10 min', date: 'Feb 27, 2026' },
  { slug: 'position-sizing-guide', title: 'Position Sizing: The Key to Surviving as a Trader', excerpt: 'Learn the 2% rule and other position sizing techniques. Never blow up your account with proper risk management.', category: 'Risk Management', readTime: '9 min', date: 'Feb 27, 2026' },
  { slug: 'india-vix-explained', title: 'India VIX Explained: How to Use the Fear Index', excerpt: 'What is India VIX and why does it matter? Learn to use the volatility index to time your trades better.', category: 'Market Analysis', readTime: '7 min', date: 'Feb 26, 2026' },
  { slug: 'best-time-to-trade', title: 'Best Time to Trade NIFTY Options: Hour by Hour', excerpt: 'Not all market hours are equal. Discover the best and worst times to trade NIFTY options for maximum profits.', category: 'Strategies', readTime: '8 min', date: 'Feb 26, 2026' },
];

const categories = ['All', 'Options', 'Commodities', 'Strategies', 'Trading Psychology', 'Risk Management', 'Market Analysis', 'Brokers'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header */}
      <header className="border-b border-[#21262D] bg-[#0D1117] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#00C076] rounded-xl flex items-center justify-center font-bold text-white">P</div>
            <span className="font-semibold text-xl">PaperPe</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-[#00C076] flex items-center gap-1 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-[#0D1117] to-[#0D1117]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00C076]/10 border border-[#00C076]/20 rounded-full text-[#00C076] text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" /> Free Learning Resources
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Trading Guides & Tutorials</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Learn trading from scratch. Free guides on options, commodities, risk management, and strategies - written for Indian traders.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 border-b border-[#21262D]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat, i) => (
              <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-[#00C076] text-white' : 'bg-[#161B22] text-gray-400 hover:bg-[#21262D]'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative py-12 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-6 hover:border-[#00C076]/30 hover:shadow-lg hover:shadow-black/30 shadow-black/20 transition-all h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-[#00C076]/10 text-[#00C076] px-2 py-1 rounded">{post.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-[#00C076] transition-colors mb-3">{post.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-[#00C076] text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read more <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-[#161B22]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to practice what you learned?</h2>
          <p className="text-gray-500 mb-6">Apply your knowledge with Rs 10 Lakh virtual capital. Zero risk.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="bg-[#00C076] hover:bg-[#00a865] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Join Waitlist
            </Link>
            <Link href="/tools" className="text-gray-400 hover:text-[#00C076] font-medium transition-colors">
              Try Free Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
