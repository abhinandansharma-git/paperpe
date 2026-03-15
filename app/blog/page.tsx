'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, ChevronRight, BookOpen } from 'lucide-react';

const posts = [
  { slug: 'why-95-percent-traders-lose-money', title: 'Why 95% of F&O Traders Lose Money — And It Is Not About Intelligence', excerpt: 'We have tracked thousands of paper trades on PaperPe. The thing that strikes us most is not how often traders get direction wrong — it is how often they get it RIGHT and still lose.', category: 'Trading Psychology', readTime: '11 min', date: 'Mar 15, 2026' },
  { slug: 'how-to-read-option-chain', title: 'How to Actually Read an Option Chain (Most Traders Miss 80% of the Data)', excerpt: 'Most traders use the option chain like a price list — scan for something cheap, buy it. That is not reading the option chain. Here is what the data actually tells you.', category: 'Options', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'options-buying-vs-selling', title: 'Options Buying vs Selling: We Have Watched Both Fail. Here Is the Honest Answer.', excerpt: 'Every week on PaperPe we see both approaches work and both approaches blow up. After thousands of trades observed, here is the comparison nobody gives you.', category: 'Options', readTime: '12 min', date: 'Mar 15, 2026' },
  { slug: 'zerodha-vs-upstox-vs-dhan', title: 'Zerodha vs Upstox vs Dhan vs Angel One: What Actually Differentiates Them', excerpt: 'We have watched traders on PaperPe use all four major brokers. Brokerage is the same. What is not the same: which platform goes down on Budget day, which has the best options tools.', category: 'Brokers', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'open-interest-analysis', title: 'Open Interest: The Data Column Most Traders Scroll Past (Do Not)', excerpt: 'The option chain shows you where large traders are positioned in real time. Most people ignore this data and buy based on price alone. Here is how to use OI before price reaches a level.', category: 'Options', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'nifty-options-lot-size-margin', title: 'NIFTY Options Lot Size, Margin & Capital Required in 2026', excerpt: 'Exact lot sizes, margin requirements, and minimum capital needed to trade NIFTY, BANKNIFTY, FINNIFTY, and MCX options in 2026. Updated with current SEBI regulations.', category: 'Options', readTime: '7 min', date: 'Mar 15, 2026' },
  { slug: 'iron-condor-strategy-india', title: 'Iron Condor Strategy: How to Profit in Sideways NIFTY Markets', excerpt: 'When NIFTY is rangebound, Iron Condor lets you profit from time decay. Learn how to set up, manage, and exit this popular options selling strategy with Indian market examples.', category: 'Strategies', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'mcx-gold-trading-guide', title: 'MCX Gold Trading Guide: GOLDM vs GOLD, Timings, and Strategies', excerpt: 'Everything you need to trade gold on MCX India. GOLD vs GOLDM contracts, trading hours, margin requirements, what moves gold prices, and practical trading strategies.', category: 'Commodities', readTime: '9 min', date: 'Mar 14, 2026' },
  { slug: 'theta-decay-options', title: 'Theta Decay: We Watched ₹130 Vanish in 3 Days Without NIFTY Moving', excerpt: 'A PaperPe user was furious. He bought a NIFTY call. NIFTY went up. His option was down 60%. This is theta — the silent tax on every option buyer.', category: 'Options', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'iv-crush-explained', title: 'IV Crush: Budget Day 2024, NIFTY Moved 800 Points — Half Our Users Still Lost Money', excerpt: 'Every year around Budget, we watch the same painful thing happen on PaperPe. Traders are right about direction. The market moves. They still lose money. This is IV crush.', category: 'Options', readTime: '8 min', date: 'Mar 15, 2026' },
  { slug: 'top-fo-trading-mistakes', title: 'The 10 F&O Mistakes We See Traders Repeat — Even Smart Ones', excerpt: 'After watching thousands of paper trades on PaperPe, the same 10 mistakes show up constantly. What is painful is that most of them are not beginner mistakes.', category: 'Trading Psychology', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'how-to-trade-budget-day', title: 'How to Trade Budget Day, RBI Policy & US Fed Meetings (Without Getting Crushed)', excerpt: 'We have simulated every major economic event of the last two years on PaperPe. The strategies that work 90% of normal days fail systematically on event days. Here is the playbook.', category: 'Strategies', readTime: '9 min', date: 'Mar 15, 2026' },
  { slug: 'bull-put-spread-bear-call-spread', title: 'Bull Put Spread & Bear Call Spread: Selling Options Without Unlimited Loss', excerpt: 'Naked options selling blows up small accounts. Credit spreads give you the seller\'s edge with a defined maximum loss. Here is how we teach them on PaperPe.', category: 'Strategies', readTime: '10 min', date: 'Mar 15, 2026' },
  { slug: 'intraday-vs-options-trading', title: 'Intraday vs Options Trading: We Have Watched Both Fail. Here Is the Honest Answer.', excerpt: 'Every week on PaperPe we see both approaches work and blow up. After thousands of trades observed, here is the comparison nobody gives you — with actual numbers.', category: 'Trading Psychology', readTime: '8 min', date: 'Mar 15, 2026' },
  { slug: 'nifty-banknifty-trading-psychology', title: 'Your Brain Is Working Against You: Trading Psychology Explained', excerpt: 'On PaperPe we have seen engineers, doctors, and MBAs make the same irrational decisions as everyone else. The biases that destroy traders are not stupidity — they are universal human wiring.', category: 'Trading Psychology', readTime: '10 min', date: 'Mar 15, 2026' },
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
