'use client';

import { Terminal } from 'lucide-react';

export default function CodeExample() {
  const code = `// Place a paper trade
const order = await paperpe.placeOrder({
  symbol: "RELIANCE",
  quantity: 10,
  side: "BUY",
  orderType: "MARKET"
});

// Check position
const position = await paperpe.getPosition("RELIANCE");
console.log(\`P&L: ₹\${position.pnl}\`);`;

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Description */}
          <div>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm mb-6">
              <Terminal className="w-4 h-4 text-orange" />
              <span className="text-slate-300">Developer Friendly</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple API.
              <br />
              <span className="text-orange">Powerful results.</span>
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-8">
              Build algorithmic trading bots in minutes. Clean REST API with TypeScript support.
            </p>
            <ul className="space-y-4">
              {['Real-time WebSocket feeds', 'Complete order management', 'Historical backtesting', 'Portfolio analytics'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-orange/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-orange" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Code block */}
          <div className="relative">
            {/* Terminal window */}
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal header */}
              <div className="bg-navy-lighter px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-400 text-sm ml-2">trade.ts</span>
              </div>

              {/* Code content */}
              <div className="p-6 bg-[#0A0E1A] font-mono text-sm overflow-x-auto">
                <pre className="text-slate-300">
                  <code>
                    {code.split('\n').map((line, i) => (
                      <div key={i} className="leading-relaxed">
                        {line.includes('//') ? (
                          <span className="text-slate-500">{line}</span>
                        ) : line.includes('const') || line.includes('await') ? (
                          <>
                            <span className="text-purple-400">{line.match(/^(\s*)(const|await)/)?.[0]}</span>
                            <span className="text-slate-300">{line.replace(/^(\s*)(const|await)/, '')}</span>
                          </>
                        ) : line.includes('paperpe') ? (
                          <span className="text-blue-400">{line}</span>
                        ) : line.includes('"') ? (
                          <>
                            {line.split('"').map((part, j) => (
                              j % 2 === 0 ? (
                                <span key={j} className="text-slate-300">{part}</span>
                              ) : (
                                <span key={j} className="text-green-400">"{part}"</span>
                              )
                            ))}
                          </>
                        ) : (
                          <span className="text-slate-300">{line}</span>
                        )}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange/20 to-blue-500/20 rounded-2xl blur-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
