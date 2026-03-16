import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Put Call Ratio (PCR) Tracker — Live NIFTY PCR Today | PaperPe',
  description: 'Track live Put-Call Ratio for NIFTY and BANKNIFTY from NSE option chain. PCR above 1.3 signals fear, below 0.7 signals greed. Auto-refreshes every 3 minutes. Free PCR tracker for Indian traders.',
  keywords: ['put call ratio nifty today', 'pcr nifty live', 'nifty pcr tracker', 'banknifty pcr today', 'put call ratio india', 'live pcr nse'],
  openGraph: {
    title: 'Live PCR Tracker — Put-Call Ratio NIFTY Today | PaperPe',
    description: 'Live Put-Call Ratio for NIFTY & BANKNIFTY. Gauge market sentiment before every trade session. Auto-refreshes every 3 minutes.',
    url: 'https://paperpe.in/pcr',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Live PCR Tracker — Put-Call Ratio NIFTY Today | PaperPe',
    description: 'Live Put-Call Ratio for NIFTY & BANKNIFTY. Gauge market sentiment before every trade session. Auto-refreshes every 3 minutes.',
  },
  alternates: {
    canonical: 'https://paperpe.in/pcr',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
