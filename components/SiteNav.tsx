'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/indicators', label: 'Indicators' },
  { href: '/tools', label: 'Tools' },
  { href: '/learn', label: 'Learn' },
  { href: '/about', label: 'About' },
];

export default function SiteNav() {
  const path = usePathname() || '/';
  const [open, setOpen] = useState(false);

  if (path.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-[17px] font-medium tracking-[-0.03em] text-neutral-950">
          PaperPe
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-500 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors duration-200 ${path.startsWith(item.href) ? 'font-medium text-neutral-950' : 'hover:text-neutral-950'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-full px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <Link href="/login" className="hidden rounded-full px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 sm:inline">
            Log in
          </Link>
          <Link href="/signup" className="rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-medium tracking-tight text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.55)] transition duration-200 hover:-translate-y-px hover:bg-neutral-800">
            Start free
          </Link>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-neutral-100 px-5 py-3 text-sm md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 text-neutral-600">
              {item.label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setOpen(false)} className="py-2 text-neutral-600">
            Log in
          </Link>
        </nav>
      )}
    </header>
  );
}
