import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
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
      <body className="antialiased bg-white text-[#1c1c1e]">
        {children}
        <footer className="border-t border-black/10 bg-white py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 text-sm text-black/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} PaperPe</p>
            <div className="flex gap-6">
              <a href="/legal/terms" className="hover:text-black">Terms</a>
              <a href="/legal/privacy" className="hover:text-black">Privacy</a>
              <a href="/legal/refund" className="hover:text-black">Refunds</a>
              <a href="/contact" className="hover:text-black">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
