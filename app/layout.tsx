import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'PaperPe - India\'s #1 Paper Trading Platform | Coming Soon',
  description: 'Practice trading NSE, MCX & F&O with virtual money. Zero risk, real skills. Launching soon!',
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
    url: 'https://paperpe.in',
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
      <body className="antialiased bg-noise">
        {children}
        <footer className="bg-[#0D1117] border-t border-[#21262D] py-6 mt-auto">
          <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
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
