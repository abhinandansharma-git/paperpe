import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brokerage Calculator India — Zerodha, Upstox, Angel One | PaperPe',
  description: 'Calculate exact brokerage charges, STT, SEBI fees, stamp duty and net P&L for NSE F&O, equity intraday and delivery. Compare Zerodha, Upstox, Angel One charges instantly.',
  keywords: ['brokerage calculator india', 'zerodha brokerage calculator', 'upstox brokerage calculator', 'f&o brokerage calculator', 'intraday brokerage calculator', 'nse charges calculator'],
  openGraph: {
    title: 'Free Brokerage Calculator — All Indian Brokers | PaperPe',
    description: 'See exactly how much brokerage, STT, and taxes you pay on every trade. Free tool for NSE F&O, equity intraday and delivery.',
    url: 'https://paperpe.in/brokerage-calculator',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Brokerage Calculator — All Indian Brokers | PaperPe',
    description: 'See exactly how much brokerage, STT, and taxes you pay on every trade. Free tool for NSE F&O, equity intraday and delivery.',
  },
  alternates: {
    canonical: 'https://paperpe.in/brokerage-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
