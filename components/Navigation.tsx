'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, LayoutDashboard, LineChart, Target, Search, BookOpen, Trophy, Gift, BarChart3, Bell, BookMarked, Newspaper, Gauge, Calendar, Wrench, Lock, LogIn, UserPlus } from 'lucide-react';

const navGroups = [
  {
    label: 'Trading',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, desc: 'Paper trading terminal' },
      { name: 'Charts', href: '/charts', icon: LineChart, desc: 'Live candlestick charts' },
      { name: 'Options', href: '/options', icon: Target, desc: 'Option chain analysis' },
      { name: 'Screener', href: '/screener', icon: Search, desc: 'Stock scanner' },
    ]
  },
  {
    label: 'Insights',
    items: [
      { name: 'Today', href: '/today', icon: Calendar, desc: 'Should you trade today?' },
      { name: 'Mood', href: '/mood', icon: Gauge, desc: 'Market fear/greed meter' },
      { name: 'News', href: '/news', icon: Newspaper, desc: 'Market news & events' },
      { name: 'Insider', href: '/insider', icon: Lock, desc: 'FII/DII & bulk deals', pro: true },
    ]
  },
  {
    label: 'Track',
    items: [
      { name: 'Analytics', href: '/analytics', icon: BarChart3, desc: 'Performance analytics' },
      { name: 'Journal', href: '/journal', icon: BookMarked, desc: 'Trade journal' },
      { name: 'Alerts', href: '/alerts', icon: Bell, desc: 'Price alerts' },
    ]
  },
  {
    label: 'Community',
    items: [
      { name: 'Leaderboard', href: '/leaderboard', icon: Trophy, desc: 'Top traders ranking' },
      { name: 'Contests', href: '/contests', icon: Gift, desc: 'Win real prizes' },
    ]
  },
  {
    label: 'Learn',
    items: [
      { name: 'Courses', href: '/learn', icon: BookOpen, desc: 'Free trading courses' },
      { name: 'Tools', href: '/tools', icon: Wrench, desc: 'Best market websites' },
    ]
  },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-[#0a0e17]/95 backdrop-blur border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-white">PaperPe</Link>
            
            <nav className="hidden lg:flex items-center gap-1">
              {navGroups.map((group) => (
                <div key={group.label} className="relative" onMouseEnter={() => setActiveDropdown(group.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <button className="px-3 py-2 text-sm text-slate-300 hover:text-white flex items-center gap-1 rounded-lg hover:bg-white/5">
                    {group.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {activeDropdown === group.label && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-[#141820] border border-white/10 rounded-xl shadow-xl p-2">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 group">
                          <item.icon className="w-5 h-5 text-slate-400 group-hover:text-orange-500 mt-0.5" />
                          <div>
                            <div className="text-white text-sm font-medium flex items-center gap-2">
                              {item.name}
                              {item.pro && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">PRO</span>}
                            </div>
                            <div className="text-xs text-slate-500">{item.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-slate-300 hover:text-white"><LogIn className="w-4 h-4" />Login</Link>
            <Link href="/signup" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg">Sign Up Free</Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-400">{mobileOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/5 pt-4">
            {navGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 px-3">{group.label}</div>
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                    {item.pro && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">PRO</span>}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
