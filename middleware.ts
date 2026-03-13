import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

// Rate limiting store (in-memory, resets on cold start — good enough for Vercel)
const rateMap = new Map<string, { count: number; reset: number }>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(key);
  if (!entry || now > entry.reset) {
    rateMap.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count++;
  return entry.count > limit;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // ── Rate limiting on sensitive routes ──
  if (pathname.startsWith('/api/payment')) {
    if (isRateLimited(`payment:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/email')) {
    if (isRateLimited(`email:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/download')) {
    if (isRateLimited(`download:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  // ── Protect /admin at server level ──
  if (pathname.startsWith('/admin')) {
    const supabaseToken = req.cookies.get('sb-kxwwinlmihtqtnscdiph-auth-token')?.value;
    if (!supabaseToken) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // ── Security headers ──
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('X-XSS-Protection', '1; mode=block');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*', '/dashboard/:path*'],
};
