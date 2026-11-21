import Link from 'next/link'

export default function About() {
  return (
    <main className="min-h-screen">
      <section className="px-6 pb-20 pt-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About PaperPe</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-neutral-500 mb-8">
              We're building India's best paper trading platform because we believe everyone deserves to learn trading without risking their savings.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Why we built this</h2>
            <p className="text-neutral-500 mb-6">
              Too many first-time traders lose money in their first month. Not because they're bad at trading, 
              but because they never had a safe place to practice. Real market data, real strategies, zero risk — 
              that's what PaperPe offers.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">What makes us different</h2>
            <ul className="space-y-4 text-neutral-500">
              <li className="flex gap-3">
                <span className="text-[#00C076] font-bold">✓</span>
                <span><strong>Real-time MCX & F&O data</strong> — Same prices your broker sees</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00C076] font-bold">✓</span>
                <span><strong>Realistic execution</strong> — Proper lot sizes, margins, and slippage</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00C076] font-bold">✓</span>
                <span><strong>Built for India</strong> — MCX commodities, Nifty, Bank Nifty</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#00C076] font-bold">✓</span>
                <span><strong>Free forever</strong> — No hidden charges, no premium tiers</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Made in India 🇮🇳</h2>
            <p className="text-neutral-500">
              PaperPe is proudly built in India, for Indian traders. We understand the nuances of MCX 
              trading hours, F&O expiries, and what Indian retail traders actually need.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link 
              href="/#join" 
              className="inline-flex items-center gap-2 bg-[#00C076]/100 hover:bg-[#00a865] text-white px-8 py-4 rounded-xl font-semibold transition-all"
            >
              Join the waitlist
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
