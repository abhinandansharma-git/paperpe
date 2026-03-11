'use client';

import { useState } from 'react';
import { ArrowRight, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Hero() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-orange" />
            <span className="text-slate-300">Now in Public Beta</span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-12 space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Test your algos.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-orange-light">
              Not your savings.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Paper trade with real market data. Perfect your strategies before risking real capital.
          </p>
        </div>

        {/* Email capture */}
        <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-xl glass focus:glass-strong focus:outline-none focus:ring-2 focus:ring-orange/50 transition-all duration-200 text-white placeholder:text-slate-500 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-orange hover:bg-orange-dark rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-orange/25 disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Start Free
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
            
            {/* Status message */}
            {message && (
              <div className={`mt-3 flex items-center justify-center gap-2 text-sm ${
                status === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {status === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {message}
              </div>
            )}
            
            {!message && (
              <p className="text-sm text-slate-500 mt-3 text-center">
                No credit card required. Start trading in 60 seconds.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
