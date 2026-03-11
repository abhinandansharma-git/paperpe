import type { Metadata } from 'next';
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
