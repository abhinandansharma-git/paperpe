'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rahul Sharma',
    role: 'Software Engineer, Bangalore',
    avatar: 'RS',
    content: 'Lost ₹80,000 in my first month of F&O trading. Wish I had found PaperPe earlier. Now I test every strategy here before going live. My win rate improved from 30% to 65%.',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'CA Student, Mumbai',
    content: 'Finally a paper trading app that supports MCX! I practice crude oil trades here without the stress of losing real money. The analytics help me understand what works.',
    rating: 5,
  },
  {
    name: 'Vikram Reddy',
    role: 'Full-time Trader, Hyderabad',
    content: 'I use PaperPe to test new strategies before deploying them. The no-code strategy builder is exactly what I needed. Saved me lakhs in potential losses.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-transparent via-orange/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by
            <span className="text-orange"> Indian Traders</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands who learned to trade the smart way
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 relative transition-all duration-300 hover:scale-105"
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-orange/20 absolute top-6 right-6" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-orange text-orange" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-300 leading-relaxed mb-6 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
