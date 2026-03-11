'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, User, ChevronRight, BookOpen } from 'lucide-react';

const posts = [
  {
    slug: 'nifty-options-trading',
    title: 'NIFTY Options Trading: Complete Beginner Guide',
    excerpt: 'Learn how to trade NIFTY options from scratch. Understand calls, puts, strikes, expiry, and strategies that actually work in Indian markets.',
    category: 'Options',
    readTime: '12 min',
    date: 'Mar 1, 2026'
  },
  {
    slug: 'mcx-trading-beginners',
    title: 'MCX Trading for Beginners: Gold, Crude & Silver',
    excerpt: 'Complete guide to commodity trading on MCX. Learn market timings, lot sizes, margin requirements, and winning strategies.',
    category: 'Commodities',
    readTime: '10 min',
    date: 'Mar 1, 2026'
  },
  {
    slug: 'options-greeks',
    title: 'Options Greeks Explained: Delta, Theta, Gamma, Vega',
    excerpt: 'Understand the Greeks without complex math. Learn how Delta, Theta, Gamma, and Vega affect your option positions.',
    category: 'Options',
    readTime: '15 min',
    date: 'Feb 28, 2026'
  },
  {
    slug: 'paper-trading-benefits',
    title: 'Why Paper Trading is Essential Before Going Live',
    excerpt: 'Most traders lose money in their first year. Learn why paper trading can save you lakhs and build real confidence.',
    category: 'Trading Psychology',
    readTime: '8 min',
    date: 'Feb 28, 2026'
  },
  {
    slug: 'banknifty-vs-nifty',
    title: 'BANKNIFTY vs NIFTY: Which Should You Trade?',
    excerpt: 'Compare BANKNIFTY and NIFTY options. Understand the differences in volatility, premiums, and which suits your trading style.',
    category: 'Options',
    readTime: '10 min',
    date: 'Feb 27, 2026'
  },
  {
    slug: 'position-sizing-guide',
    title: 'Position Sizing: The Key to Surviving as a Trader',
    excerpt: 'Learn the 2% rule and other position sizing techniques. Never blow up your account with proper risk management.',
    category: 'Risk Management',
    readTime: '9 min',
    date: 'Feb 27, 2026'
  },
  {
    slug: 'india-vix-explained',
    title: 'India VIX Explained: How to Use the Fear Index',
    excerpt: 'What is India VIX and why does it matter? Learn to use the volatility index to time your trades better.',
    category: 'Market Analysis',
    readTime: '7 min',
    date: 'Feb 26, 2026'
  },
  {
    slug: 'best-time-to-trade',
    title: 'Best Time to Trade NIFTY Options: Hour by Hour',
    excerpt: 'Not all market hours are equal. Discover the best and worst times to trade NIFTY options for maximum profits.',
    category: 'Strategies',
    readTime: '8 min',
    date: 'Feb 26, 2026'
  },
];

const categories = ['All', 'Options', 'Commodities', 'Risk Management', 'Market Analysis', 'Strategies'];

export default function BlogPage() {
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
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4" /> Free Learning Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trading Guides & Tutorials</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Learn trading from scratch. Free guides on options, commodities, risk management, and strategies - written for Indian traders.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat, i) => (
              <button key={i} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{post.category}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">{post.title}</h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{post.date}</span>
                    <span className="text-blue-500 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to practice what you learned?</h2>
          <p className="text-gray-500 mb-6">Apply your knowledge with Rs 10 Lakh virtual capital. Zero risk.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Join Waitlist
            </Link>
            <Link href="/tools" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Try Free Tools
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
