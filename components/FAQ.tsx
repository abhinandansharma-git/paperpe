'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'What is paper trading?',
    answer: 'Paper trading is simulated trading that lets you practice buying and selling securities without risking real money. You get virtual capital (₹10 lakh on PaperPe) to test strategies, learn market dynamics, and build confidence before trading with real funds.'
  },
  {
    question: 'Is the market data real-time?',
    answer: 'Yes! PaperPe uses real-time market data from NSE and MCX. Your paper trades execute at actual market prices, giving you an authentic trading experience without the financial risk.'
  },
  {
    question: 'Can I trade F&O and MCX commodities?',
    answer: 'Absolutely. Unlike most paper trading platforms that only support equity, PaperPe fully supports Futures & Options (F&O) and MCX commodities including Crude Oil, Gold, Silver, and Natural Gas.'
  },
  {
    question: 'How is this different from other paper trading apps?',
    answer: 'PaperPe is built by actual traders for Indian markets. We offer MCX support, no-code strategy building, backtesting, and a clean mobile-first interface. Most competitors are either too basic or designed for US markets.'
  },
  {
    question: 'Will my paper trading results reflect real trading?',
    answer: 'Paper trading removes emotional and slippage factors, so real results may vary. However, it\'s the best way to test strategies, understand market behavior, and build discipline before risking real capital.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked
            <span className="text-orange"> Questions</span>
          </h2>
          <p className="text-xl text-slate-400">
            Everything you need to know about paper trading
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-lg text-white pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-orange transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 pb-5' : 'max-h-0'
                }`}
              >
                <p className="px-6 text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
