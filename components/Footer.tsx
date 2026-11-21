'use client';

import Link from 'next/link';
import { Twitter, Github, Mail, LayoutDashboard, LineChart, Target, Search, BookOpen, Trophy, Gift, BarChart3, Bell, BookMarked, Newspaper, Gauge, Calendar, Wrench, Lock } from 'lucide-react';

const footerLinks = [
  {
    title: 'Trading',
    links: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Charts', href: '/charts' },
      { name: 'Options', href: '/options' },
      { name: 'Screener', href: '/screener' },
    ]
  },
  {
    title: 'Insights',
    links: [
      { name: 'Today\'s Outlook', href: '/today' },
      { name: 'Market Mood', href: '/mood' },
      { name: 'News', href: '/news' },
      { name: 'Insider Data', href: '/insider', pro: true },
    ]
  },
  {
    title: 'Track & Compete',
    links: [
      { name: 'Analytics', href: '/analytics' },
      { name: 'Journal', href: '/journal' },
      { name: 'Alerts', href: '/alerts' },
      { name: 'Leaderboard', href: '/leaderboard' },
      { name: 'Contests', href: '/contests' },
    ]
  },
  {
    title: 'Learn',
    links: [
      { name: 'Courses', href: '/learn' },
      { name: 'Market Tools', href: '/tools' },
    ]
  },
  {
    title: 'Account',
    links: [
      { name: 'Login', href: '/login' },
      { name: 'Sign Up', href: '/signup' },
    ]
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-6 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-neutral-900">PaperPe</Link>
            <p className="text-neutral-500 mt-3 text-sm">India\'s first paper trading platform for NSE, MCX & F&O. Practice with ₹10 lakh virtual capital.</p>
            <div className="flex gap-4 mt-4">
              <a href="https://twitter.com/paperpe_in" target="_blank" rel="noopener" className="text-neutral-500 hover:text-neutral-900"><Twitter className="w-5 h-5" /></a>
              <a href="mailto:hello@paperpe.in" className="text-neutral-500 hover:text-neutral-900"><Mail className="w-5 h-5" /></a>
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-neutral-900 font-semibold mb-4">{group.title}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-neutral-500 hover:text-neutral-900 text-sm flex items-center gap-1">
                      {link.name}
                      {link.pro && <span className="text-[9px] px-1 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">PRO</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-neutral-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2026 PaperPe. Built with ❤️ in India.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/terms" className="hover:text-neutral-900">Terms</Link>
            <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
            <Link href="/sitemap.xml" className="hover:text-neutral-900">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
