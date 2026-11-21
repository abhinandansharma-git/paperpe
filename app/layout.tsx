import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import SiteNav from '@/components/SiteNav';
import './globals.css';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://paperpe.in';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'PaperPe — Practice Indian markets with virtual capital',
  description: 'Paper-trade NSE and MCX with ₹10 lakh virtual capital. TradingView indicators for NIFTY, BANKNIFTY, and expiry.',
  keywords: 'paper trading, virtual trading, stock market simulator, NSE, MCX, F&O, options trading, India',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon.ico' },
    ],
  },
  openGraph: {
    title: 'PaperPe - Paper Trading Platform',
    description: 'Practice trading with zero risk. Launching soon!',
    url: appUrl,
    siteName: 'PaperPe',
    images: [{ url: '/paperpe-logo-dark.png', width: 1024, height: 512, alt: 'PaperPe Logo' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@paperpe_in',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="flex min-h-screen flex-col bg-white text-[#1c1c1e] antialiased">
        <SiteNav />
        <div className="flex-1">{children}</div>
        <footer className="border-t border-neutral-200 bg-neutral-50">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-[17px] font-medium tracking-[-0.03em] text-neutral-950">PaperPe</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-neutral-500">Practice NSE and MCX with virtual capital. Real prices. No money at risk.</p>
              <a href="mailto:hello@paperpe.in" className="mt-4 inline-block text-sm text-neutral-700 transition-colors hover:text-neutral-950">hello@paperpe.in</a>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Product</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-neutral-600">
                <a href="/indicators" className="transition-colors hover:text-neutral-950">Indicators</a>
                <a href="/tools" className="transition-colors hover:text-neutral-950">Tools</a>
                <a href="/learn" className="transition-colors hover:text-neutral-950">Learn</a>
                <a href="/signup" className="transition-colors hover:text-neutral-950">Start paper trading</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Company</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-neutral-600">
                <a href="/about" className="transition-colors hover:text-neutral-950">About</a>
                <a href="/blog" className="transition-colors hover:text-neutral-950">Blog</a>
                <a href="/contact" className="transition-colors hover:text-neutral-950">Contact</a>
                <a href="/support" className="transition-colors hover:text-neutral-950">Support</a>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">Legal</p>
              <div className="mt-4 flex flex-col gap-2.5 text-sm text-neutral-600">
                <a href="/legal/terms" className="transition-colors hover:text-neutral-950">Terms</a>
                <a href="/legal/privacy" className="transition-colors hover:text-neutral-950">Privacy</a>
                <a href="/legal/refund" className="transition-colors hover:text-neutral-950">Refunds</a>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-200">
            <p className="mx-auto max-w-6xl px-6 py-5 text-xs text-neutral-400">© {new Date().getFullYear()} PaperPe</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
