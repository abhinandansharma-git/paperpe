import Link from 'next/link';

export const metadata = {
  title: 'Paper Trading | PaperPe',
  description: 'Paper trading on PaperPe is being prepared for public beta.',
};

export default function TradePage() {
  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-[#00C076] text-sm font-medium mb-3">Paper Trading</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">This part is almost ready.</h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          We are still tightening the paper trading experience before opening it up publicly. In the meantime, your dashboard, indicators, and tools are live and ready to use.
        </p>

        <div className="grid gap-4 md:grid-cols-2 mb-10">
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-2">Available now</p>
            <p className="text-lg font-semibold text-white">Indicators, dashboard, downloads, and market tools</p>
          </div>
          <div className="bg-[#161B22] border border-[#21262D] rounded-2xl p-5">
            <p className="text-sm text-gray-400 mb-2">Coming next</p>
            <p className="text-lg font-semibold text-white">Virtual trades, positions, P&L tracking, and leaderboard sync</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="bg-[#00C076] hover:bg-[#00a865] text-[#0D1117] font-semibold px-5 py-3 rounded-xl transition-colors">
            Go to Dashboard
          </Link>
          <Link href="/tools" className="border border-[#21262D] hover:border-[#00C076]/40 text-gray-300 hover:text-white px-5 py-3 rounded-xl transition-colors">
            Explore Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
