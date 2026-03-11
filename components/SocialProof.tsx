'use client';

import { Users, TrendingUp, Sparkles } from 'lucide-react';

export default function SocialProof() {
  const stats = [
    {
      icon: Users,
      value: '500+',
      label: 'Active Traders',
    },
    {
      icon: TrendingUp,
      value: '₹10L+',
      label: 'Paper Capital',
    },
    {
      icon: Sparkles,
      value: '100%',
      label: 'Free Forever',
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:glass-strong"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-orange" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
