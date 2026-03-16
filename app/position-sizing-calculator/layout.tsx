import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Position Sizing Calculator for F&O — Risk-Based Lot Size | PaperPe',
  description: 'Calculate exact lot size for NIFTY, BANKNIFTY and stock options based on your account size and risk percentage. Never risk more than you can afford. Free F&O position sizing tool.',
  keywords: ['position sizing calculator india', 'f&o lot size calculator', 'options position sizing', 'nifty lot size calculator', 'risk based position sizing', 'how many lots to buy nifty'],
  openGraph: {
    title: 'F&O Position Sizing Calculator — Know Your Lot Size | PaperPe',
    description: 'Enter your capital and risk %. Get exact number of lots to buy for NIFTY, BANKNIFTY options. Free tool for Indian traders.',
    url: 'https://paperpe.in/position-sizing-calculator',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'F&O Position Sizing Calculator — Know Your Lot Size | PaperPe',
    description: 'Enter your capital and risk %. Get exact number of lots to buy for NIFTY, BANKNIFTY options. Free tool for Indian traders.',
  },
  alternates: {
    canonical: 'https://paperpe.in/position-sizing-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
