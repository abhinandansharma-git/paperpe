import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NIFTY Max Pain Calculator — Live NSE Option Chain | PaperPe',
  description: 'Find today\'s max pain level for NIFTY, BANKNIFTY and FINNIFTY from live NSE option chain data. See top call and put OI strikes, resistance levels and where option writers will defend.',
  keywords: ['nifty max pain calculator', 'banknifty max pain today', 'options max pain india', 'max pain nse', 'max pain level nifty', 'option chain max pain'],
  openGraph: {
    title: 'NIFTY Max Pain Calculator — Live Option Chain | PaperPe',
    description: 'Live max pain level for NIFTY & BANKNIFTY. See where option buyers lose the most at expiry and plan your trades accordingly.',
    url: 'https://paperpe.in/max-pain',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NIFTY Max Pain Calculator — Live Option Chain | PaperPe',
    description: 'Live max pain level for NIFTY & BANKNIFTY. See where option buyers lose the most at expiry and plan your trades accordingly.',
  },
  alternates: {
    canonical: 'https://paperpe.in/max-pain',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
