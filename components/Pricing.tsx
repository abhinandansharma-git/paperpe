'use client';

import { Check, Sparkles, Clock, Zap } from 'lucide-react';
import { useState } from 'react';
import BuyButton from './BuyButton';

export default function Pricing() {
  const [spotsLeft, setSpotsLeft] = useState(73);

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for learning the basics',
      features: [
        'Paper trading with ₹10L capital',
        'Real-time market data',
        'Basic analytics dashboard',
        'API access (100 req/min)',
        'Community support',
      ],
      cta: 'Start Free',
      popular: false,
    },
    {
      name: 'Early Bird',
      price: '₹499',
      originalPrice: '₹3,588',
      period: 'lifetime',
      description: 'For first 100 serious traders',
      features: [
        'Everything in Free, plus:',
        'Unlimited paper capital',
        'Advanced analytics & insights',
        'API access (unlimited)',
        'Priority support',
        'Backtesting tools',
        'Export trade history',
        'All future updates FREE',
      ],
      cta: 'Grab Early Bird',
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange/10 border border-orange/20 text-orange text-sm mb-6">
            <Clock className="w-4 h-4" />
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Early Bird
            <span className="text-orange"> Pricing</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Lock in lifetime access at 86% off. Only for the first 100 users.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 relative transition-all duration-300 hover:scale-[1.02] ${
                plan.popular
                  ? 'glass-strong shadow-2xl shadow-orange/20 border-orange/30'
                  : 'glass hover:glass-strong'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-orange to-orange-light px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg">
                    <Zap className="w-4 h-4" />
                    {spotsLeft} spots left!
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-3">
                  {plan.originalPrice && (
                    <span className="text-2xl text-slate-500 line-through">{plan.originalPrice}</span>
                  )}
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>
                {plan.originalPrice && (
                  <div className="mt-2 inline-block bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                    Save ₹3,089 (86% off)
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-orange" />
                    </div>
                    <span className={feature.includes(':') || feature.includes('FREE') ? 'font-medium text-white' : 'text-slate-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {plan.popular ? (
                <BuyButton
                  productId="early-bird"
                  productName="Early Bird Lifetime Access"
                  price={499}
                  color="orange"
                />
              ) : (
                <a
                  href="/signup"
                  className="block w-full py-4 rounded-xl font-semibold text-center transition-all duration-200 glass-strong hover:bg-white/10"
                >
                  {plan.cta}
                </a>
              )}
              
              {plan.popular && (
                <p className="text-center text-slate-500 text-sm mt-4">
                  One-time payment. No recurring fees. Ever.
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Trust note */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            🔒 Secure payment via Razorpay • UPI, Cards, NetBanking accepted
          </p>
        </div>
      </div>
    </section>
  );
}
