'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-orange/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
          Now Live - Try the Dashboard
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Start testing your strategies
          <span className="text-orange"> today</span>
        </h2>
        
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Join 500+ traders who are perfecting their algorithms without risking real money.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 bg-orange hover:bg-orange-dark rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange/25 text-white"
          >
            Try Live Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/charts"
            className="px-8 py-4 glass hover:glass-strong rounded-xl font-semibold transition-all duration-200 text-white"
          >
            View Charts
          </Link>
        </div>

        <p className="text-sm text-slate-500 mt-8">
          No signup required for demo. Full access with free account.
        </p>
      </div>
    </section>
  );
}
