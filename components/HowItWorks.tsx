'use client';

import { UserPlus, Target, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Sign Up Free',
    description: 'Create your account in 30 seconds. No credit card, no KYC. Just your email and you\'re ready to trade.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Practice Trading',
    description: 'Get ₹10 lakh virtual capital. Trade stocks, F&O, and commodities with real market data. Test your strategies risk-free.',
  },
  {
    icon: Trophy,
    step: '03',
    title: 'Master the Markets',
    description: 'Track your performance, learn from mistakes, refine your edge. When you\'re ready, trade with confidence.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Trading in
            <span className="text-orange"> 3 Simple Steps</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            No complexity. No barriers. Just pure learning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange/50 to-transparent" />
              )}

              <div className="glass rounded-2xl p-8 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange/10">
                {/* Step number */}
                <div className="text-6xl font-bold text-orange/20 absolute top-4 right-6">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
