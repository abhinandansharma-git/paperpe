import Link from 'next/link'

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-amber-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            PaperPe
          </Link>
          <Link 
            href="/#join"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all hover:-translate-y-0.5"
          >
            Join Free
          </Link>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About PaperPe</h1>
          
          <div className="prose prose-lg">
            <p className="text-xl text-gray-600 mb-8">
              We're building India's best paper trading platform because we believe everyone deserves to learn trading without risking their savings.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Why we built this</h2>
            <p className="text-gray-600 mb-6">
              Too many first-time traders lose money in their first month. Not because they're bad at trading, 
              but because they never had a safe place to practice. Real market data, real strategies, zero risk — 
              that's what PaperPe offers.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">What makes us different</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Real-time MCX & F&O data</strong> — Same prices your broker sees</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Realistic execution</strong> — Proper lot sizes, margins, and slippage</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Built for India</strong> — MCX commodities, Nifty, Bank Nifty</span>
              </li>
              <li className="flex gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Free forever</strong> — No hidden charges, no premium tiers</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-12 mb-4">Made in India 🇮🇳</h2>
            <p className="text-gray-600">
              PaperPe is proudly built in India, for Indian traders. We understand the nuances of MCX 
              trading hours, F&O expiries, and what Indian retail traders actually need.
            </p>
          </div>

          <div className="mt-12 pt-8 border-t">
            <Link 
              href="/#join" 
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-semibold transition-all"
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
