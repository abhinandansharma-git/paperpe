import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'PaperPe - India\'s #1 Paper Trading Platform | Coming Soon',
  description: 'Practice trading NSE, MCX & F&O with virtual money. Zero risk, real skills. Launching soon!',
  keywords: 'paper trading, virtual trading, stock market simulator, NSE, MCX, F&O, options trading, India',
  openGraph: {
    title: 'PaperPe - Paper Trading Platform',
    description: 'Practice trading with zero risk. Launching soon!',
    url: 'https://paperpe.in',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@paperpe_in',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased">
        {children}
        <footer className="bg-gray-950 border-t border-gray-800 py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} PaperPe. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="/legal/terms" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="/legal/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="/legal/refund" className="hover:text-gray-300 transition-colors">Refund Policy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
