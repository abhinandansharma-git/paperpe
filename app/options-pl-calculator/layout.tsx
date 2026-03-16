import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Options P&L Calculator India — Call & Put Profit/Loss | PaperPe',
  description: 'Calculate profit and loss for long call, long put, short call and short put options at expiry. See your breakeven, max profit and max loss before entering any trade. Free options P&L calculator for NSE.',
  keywords: ['options pl calculator india', 'options profit loss calculator', 'call put pl calculator', 'nifty options calculator', 'options payoff calculator', 'breakeven options calculator india'],
  openGraph: {
    title: 'Options P&L Calculator — Know Your Risk Before You Trade | PaperPe',
    description: 'See exactly what you make or lose at every NIFTY level at expiry. Free options payoff calculator for Indian traders.',
    url: 'https://paperpe.in/options-pl-calculator',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Options P&L Calculator — Know Your Risk Before You Trade | PaperPe',
    description: 'See exactly what you make or lose at every NIFTY level at expiry. Free options payoff calculator for Indian traders.',
  },
  alternates: {
    canonical: 'https://paperpe.in/options-pl-calculator',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
