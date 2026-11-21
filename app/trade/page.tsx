import Link from 'next/link';

export const metadata = {
  title: 'Paper Trading | PaperPe',
  description: 'Paper trading on PaperPe is being prepared for public beta.',
};

export default function TradePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Paper Trading</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">This part is almost ready.</h1>
        <p className="text-neutral-500 text-lg leading-relaxed mb-8">
          We are still tightening the paper trading experience before opening it up publicly. In the meantime, your dashboard, indicators, and tools are live and ready to use.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <p className="text-sm text-neutral-500 mb-2">Available now</p>
            <p className="text-lg font-semibold text-neutral-900">Indicators, dashboard, downloads, and market tools</p>
          </div>
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
            <p className="text-sm text-neutral-500 mb-2">Coming next</p>
            <p className="text-lg font-semibold text-neutral-900">Virtual trades, positions, P&L tracking, and leaderboard sync</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Go to Dashboard
          </Link>
          <Link href="/tools" className="border border-neutral-200 hover:border-[#00C076]/40 text-neutral-600 hover:text-neutral-900 px-5 py-3 rounded-xl transition-colors">
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
