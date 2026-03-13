'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Zap, Target, Shield, X, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const indicators = [
  {
    id: 'aria-supreme',
    name: 'ARIA SUPREME',
    tagline: 'The Complete Trading System',
    price: 2999,
    originalPrice: 5999,
    badge: 'FLAGSHIP',
    badgeColor: 'from-[#00C076] to-purple-500',
    description: 'Our most powerful indicator combining 7 professional modules into one. Get clear buy/sell signals, trend detection, smart money tracking, and regime identification - all calibrated for Indian markets.',
    features: [
      'Score-based signals (0-100) for clear decisions',
      'Multi-timeframe trend alignment',
      'Smart money flow detection',
      'Market regime identification (trending/ranging)',
      'India session awareness (9:15 AM - 3:30 PM)',
      'Support/Resistance auto-detection',
      'Works on NIFTY, BANKNIFTY, stocks, MCX',
    ],
    highlight: true
  },
  {
    id: 'oi-pulse',
    name: 'OI Pulse',
    tagline: 'Open Interest Intelligence',
    price: 999,
    originalPrice: 1999,
    badge: 'POPULAR',
    badgeColor: 'from-[#00C076] to-green-500',
    description: 'Track smart money through Open Interest changes. Know when institutions are building positions and in which direction.',
    features: [
      'Real-time OI change tracking',
      'Put-Call ratio analysis',
      'Max pain calculation',
      'Institutional position detection',
      'OI-based support/resistance',
    ],
    highlight: false
  },
  {
    id: 'fear-greed',
    name: 'Fear & Greed Meter',
    tagline: 'Market Sentiment Gauge',
    price: 499,
    originalPrice: 999,
    badge: 'STARTER',
    badgeColor: 'from-[#00C076] to-[#00C076]',
    description: 'Visual fear and greed indicator for timing entries. Buy when others are fearful, sell when greedy.',
    features: [
      'Real-time sentiment scoring',
      'Historical sentiment overlay',
      'Extreme fear/greed alerts',
      'Works on any timeframe',
    ],
    highlight: false
  },
  {
    id: 'smart-sr',
    name: 'Smart S/R',
    tagline: 'Intelligent Support & Resistance',
    price: 999,
    originalPrice: 1999,
    badge: 'ESSENTIAL',
    badgeColor: 'from-cyan-500 to-blue-500',
    description: 'Auto-detect key support and resistance levels that actually matter. No more guessing where to place stops and targets.',
    features: [
      'Auto-detected key levels',
      'Strength scoring for each level',
      'Dynamic updates as price moves',
      'Works on all instruments',
    ],
    highlight: false
  },
];

const bundle = {
  id: 'bundle',
  name: 'Complete Bundle',
  price: 3999,
  originalPrice: 8996,
  includes: ['ARIA SUPREME', 'OI Pulse', 'Fear & Greed Meter', 'Smart S/R'],
  savings: 4997
};

export default function IndicatorsPage() {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{id: string, name: string, price: number} | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // If user just logged in and has a pending product, proceed to checkout
      if (session?.user && selectedProduct) {
        setShowAuthModal(false);
        setFormData(f => ({
          ...f,
          name: session.user.user_metadata?.full_name || f.name,
          email: session.user.email || f.email,
        }));
        setShowModal(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [selectedProduct]);

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyClick = async (product: {id: string, name: string, price: number}) => {
    setSelectedProduct(product);
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    // Pre-fill from user profile
    setFormData(f => ({
      ...f,
      name: currentUser.user_metadata?.full_name || f.name,
      email: currentUser.email || f.email,
    }));
    setShowModal(true);
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/indicators` }
    });
  };

  const handlePayment = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill all fields');
      return;
    }
    if (!selectedProduct) return;

    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert('Failed to load payment gateway');
      setLoading(false);
      return;
    }

    try {
      // Create order
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Open Razorpay
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'PaperPe',
        description: data.productName,
        order_id: data.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#3B82F6' },
        handler: async (response: any) => {
          // Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...response,
              email: formData.email,
              phone: formData.phone,
              productId: selectedProduct.id,
              productName: data.productName,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert('🎉 Payment successful! Check your email/WhatsApp for the indicator file.');
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '' });
          } else {
            alert('Payment received! Contact us on WhatsApp (+91 99303 24251) for delivery.');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
      <section className="relative py-20 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-mesh" />
        <div className="absolute inset-0 bg-dots opacity-30" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#00C076]/10 border border-[#00C076]/20 rounded-full text-[#00C076] text-sm font-medium mb-6 animate-fade-in-up">
            <span className="w-2 h-2 bg-[#00C076] rounded-full animate-pulse" />
            Built for Indian F&O traders
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{animationDelay:'0.1s'}}>
            Stop Guessing.<br />
            <span className="text-gradient">Start Trading with Clarity.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{animationDelay:'0.2s'}}>
            Professional TradingView indicators that tell you exactly when to enter and exit. Calibrated for NIFTY, BANKNIFTY & Indian markets. One-time payment, lifetime access.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-gray-400 animate-fade-in-up" style={{animationDelay:'0.3s'}}>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00C076]" /> Works on free TradingView</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00C076]" /> NIFTY & BANKNIFTY tested</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00C076]" /> Lifetime updates included</span>
          </div>
          <div className="flex items-center justify-center gap-3 mt-8 text-xs text-gray-500 animate-fade-in-up" style={{animationDelay:'0.4s'}}>
            <div className="flex -space-x-2">
              {['🟢','🔵','🟣','🟡','🔴'].map((c,i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-[#161B22] border-2 border-[#0D1117] flex items-center justify-center text-xs">{c}</div>
              ))}
            </div>
            <span>Trusted by <strong className="text-white">100+</strong> Indian traders</span>
          </div>
        </div>
      </section>

      {/* Bundle Offer */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#00C076] to-[#00a8ff] rounded-2xl p-8 text-white animate-pulse-glow relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="flex flex-col items-center justify-between gap-6 text-center md:text-left">
              <div>
                <span className="text-[#00C076]/60 text-sm font-medium">BEST VALUE</span>
                <h2 className="text-2xl font-bold mt-1 mb-2">Complete Bundle - All 4 Indicators</h2>
                <p className="text-[#00C076]/40">Get everything for one low price. Save ₹{bundle.savings.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {bundle.includes.map((name, i) => (
                    <span key={i} className="text-xs bg-[#0D1117]/20 px-2 py-1 rounded">{name}</span>
                  ))}
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-white/60 line-through">₹{bundle.originalPrice.toLocaleString()}</div>
                <div className="text-3xl md:text-4xl font-bold">₹{bundle.price.toLocaleString()}</div>
                <button 
                  onClick={() => handleBuyClick({ id: bundle.id, name: bundle.name, price: bundle.price })}
                  className="mt-4 bg-[#0D1117] text-[#00C076] px-8 py-3 rounded-xl font-semibold hover:bg-[#161B22] transition-colors"
                >
                  Buy Bundle
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Individual Indicators */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Or Buy Individually</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {indicators.map((ind, i) => (
              <div key={i} className={`bg-[#0D1117] border rounded-2xl p-6 ${ind.highlight ? 'border-[#00C076]/30 ring-2 ring-blue-100' : 'border-[#21262D]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className={`text-xs bg-gradient-to-r ${ind.badgeColor} text-white px-2 py-1 rounded-full`}>{ind.badge}</span>
                    <h3 className="text-xl font-bold text-white mt-2">{ind.name}</h3>
                    <p className="text-gray-500 text-sm">{ind.tagline}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 line-through text-sm">₹{ind.originalPrice.toLocaleString()}</div>
                    <div className="text-2xl font-bold text-white">₹{ind.price.toLocaleString()}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{ind.description}</p>
                <ul className="space-y-2 mb-6">
                  {ind.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                      <Check className="w-4 h-4 text-[#00C076] flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleBuyClick({ id: ind.id, name: ind.name, price: ind.price })}
                  className="w-full bg-[#0D1117] hover:bg-[#161B22] text-white py-3 rounded-xl font-medium transition-colors"
                >
                  Buy {ind.name} - ₹{ind.price.toLocaleString()}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-[#161B22]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Why Traders Choose PaperPe Indicators</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: 'India-Focused', desc: 'Calibrated for NSE, MCX timings and volatility patterns' },
              { icon: Zap, title: 'Clear Signals', desc: 'No ambiguity. Score-based system tells you exactly what to do' },
              { icon: Shield, title: 'One-Time Payment', desc: 'Pay once, use forever. No subscriptions, no recurring fees' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-[#00C076]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#00C076]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How do I use these indicators?', a: 'After purchase, you will receive a Pine Script file. Add it to TradingView via the Pine Editor. Works on free TradingView accounts.' },
              { q: 'Do I need TradingView Premium?', a: 'No, these work on free TradingView accounts. Premium is only needed if you want to use more than 3 indicators on one chart.' },
              { q: 'Can I use on multiple devices?', a: 'Yes, once added to your TradingView account, it works everywhere you log in.' },
              { q: 'Is there a refund policy?', a: 'Due to the digital nature of the product, we do not offer refunds. Please review the features carefully before purchasing.' },
            ].map((faq, i) => (
              <div key={i} className="bg-[#0D1117] border border-[#21262D] rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1117] rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-2">Buy {selectedProduct.name}</h3>
            <p className="text-gray-500 mb-4">Amount: <span className="font-bold text-white">₹{selectedProduct.price.toLocaleString()}</span></p>
            
            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-[#21262D] rounded-xl focus:outline-none focus:border-[#00C076] focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border border-[#21262D] rounded-xl focus:outline-none focus:border-[#00C076] focus:outline-none"
              />
              <input
                type="tel"
                placeholder="WhatsApp Number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 border border-[#21262D] rounded-xl focus:outline-none focus:border-[#00C076] focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-[#21262D] rounded-xl text-gray-400 hover:bg-[#161B22]"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={loading}
                className="flex-1 py-3 bg-[#00a865] text-white rounded-xl font-semibold hover:bg-[#00a865] disabled:opacity-50"
              >
                {loading ? 'Processing...' : `Pay ₹${selectedProduct.price.toLocaleString()}`}
              </button>
            </div>
            
            <p className="text-center text-gray-400 text-xs mt-4">
              🔒 Secure payment via Razorpay
            </p>
          </div>
        </div>
      )}

      {/* Auth Modal — shown when unauthenticated user clicks Buy */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-6 md:p-8 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Sign in to continue</h3>
                <p className="text-gray-400 text-sm mt-1">Create an account to purchase indicators</p>
              </div>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedProduct && (
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4 mb-6">
                <p className="text-gray-400 text-xs mb-1">You're buying</p>
                <p className="text-white font-semibold">{selectedProduct.name}</p>
                <p className="text-[#00C076] font-bold text-lg mt-1">₹{selectedProduct.price.toLocaleString()}</p>
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-[#0D1117] hover:bg-[#161B22] text-white font-semibold py-3 px-4 rounded-xl transition-colors mb-3 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {authLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#21262D]" /></div>
              <div className="relative flex justify-center text-xs text-gray-500"><span className="bg-[#0D1117] px-3">or</span></div>
            </div>

            <div className="flex gap-3">
              <Link href={`/login?redirect=/indicators`} className="flex-1 flex items-center justify-center gap-2 bg-[#161B22] border border-[#21262D] hover:border-gray-600 text-gray-300 hover:text-white py-3 rounded-xl text-sm font-medium transition-all">
                <LogIn className="w-4 h-4" /> Log in
              </Link>
              <Link href={`/signup?redirect=/indicators`} className="flex-1 flex items-center justify-center gap-2 bg-[#00C076]/10 border border-[#00C076]/30 hover:bg-[#00C076]/20 text-[#00C076] py-3 rounded-xl text-sm font-medium transition-all">
                <UserPlus className="w-4 h-4" /> Sign up
              </Link>
            </div>

            <p className="text-center text-gray-500 text-xs mt-4">
              🔒 Your data is safe. We use Google OAuth.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
