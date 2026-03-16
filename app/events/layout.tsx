import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'F&O Events Calendar 2026 — RBI, FOMC, Expiry Dates | PaperPe',
  description: 'Complete calendar of all NSE F&O expiry dates, RBI MPC policy meetings, FOMC meetings, Union Budget and key market events for 2026. Never miss a high-volatility trading event.',
  keywords: ['f&o expiry calendar 2026', 'rbi policy dates 2026', 'nifty expiry dates 2026', 'fomc dates 2026 india', 'nse expiry calendar', 'options expiry dates india'],
  openGraph: {
    title: 'F&O Events Calendar 2026 — All Expiry & Policy Dates | PaperPe',
    description: 'RBI MPC dates, FOMC meetings, NSE expiry calendar and Budget dates for 2026. Plan your trades around high-volatility events.',
    url: 'https://paperpe.in/events',
    siteName: 'PaperPe',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'F&O Events Calendar 2026 — All Expiry & Policy Dates | PaperPe',
    description: 'RBI MPC dates, FOMC meetings, NSE expiry calendar and Budget dates for 2026. Plan your trades around high-volatility events.',
  },
  alternates: {
    canonical: 'https://paperpe.in/events',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
