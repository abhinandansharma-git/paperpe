'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, LayoutDashboard, LineChart, Target, Search, BookOpen, Trophy, Gift, BarChart3, Newspaper, Gauge, Calendar, Wrench, Lock } from 'lucide-react';

const navGroups = [
  { label: 'Trading', items: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Charts', href: '/charts', icon: LineChart },
    { name: 'Options', href: '/options', icon: Target },
    { name: 'Screener', href: '/screener', icon: Search },
  ]},
  { label: 'Insights', items: [
    { name: 'Today', href: '/today', icon: Calendar },
    { name: 'Mood', href: '/mood', icon: Gauge },
    { name: 'News', href: '/news', icon: Newspaper },
    { name: 'Insider', href: '/insider', icon: Lock, pro: true },
  ]},
  { label: 'Community', items: [
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Contests', href: '/contests', icon: Gift },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]},
  { label: 'Learn', items: [
    { name: 'Courses', href: '/learn', icon: BookOpen },
    { name: 'Tools', href: '/tools', icon: Wrench },
  ]},
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 backdrop-blur-md bg-[#0a0e17]/90 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
        <nav className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) => (
            <div key={group.label} className="relative group">
              <button className="px-3 py-2 text-sm text-slate-300 hover:text-white flex items-center gap-1 rounded-lg hover:bg-white/5">
                {group.label}
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#141820] border border-white/10 rounded-xl shadow-2xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white text-sm">
                    <item.icon className="w-4 h-4 text-orange-500" />
                    <span>{item.name}</span>
                    {item.pro && <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded ml-auto">PRO</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <Link href="/#pricing" className="px-3 py-2 text-sm text-slate-300 hover:text-white">Pricing</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block px-3 py-2 text-sm text-slate-300 hover:text-white">Login</Link>
          <Link href="/signup" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg">Start Free</Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-400">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <nav className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">{group.label}</div>
              {group.items.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">
                  <item.icon className="w-5 h-5 text-orange-500" />
                  {item.name}
                  {item.pro && <span className="text-[9px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">PRO</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}
