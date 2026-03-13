import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_EMAIL = 'data.abhinandan73@gmail.com';

// ── Rate limiting (in-memory, per Vercel instance) ──
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

// ── Sanitize: block suspicious payloads ──
function hasSuspiciousInput(url: string): boolean {
  const suspicious = [
    /(\.\.\/)/, // path traversal
    /<script/i, // XSS
    /javascript:/i, // XSS
    /on(error|load|click)=/i, // event handler injection
    /union\s+select/i, // SQL injection
    /;\s*(drop|delete|insert|update)\s/i, // SQL injection
    /';\s*--/, // SQL comment injection
    /\$\{.*\}/, // template injection
    /%00/, // null byte
  ];
  return suspicious.some(p => p.test(url));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
  const url = req.nextUrl.toString();

  // ── Block suspicious requests ──
  if (hasSuspiciousInput(decodeURIComponent(url))) {
    return NextResponse.json({ error: 'Blocked' }, { status: 400 });
  }

  // ── Block common attack paths ──
  const blocked = [
    '/api/env', '/.env', '/wp-admin', '/wp-login', '/phpinfo',
    '/admin.php', '/.git', '/config', '/debug', '/trace',
    '/actuator', '/.well-known/security.txt',
  ];
  if (blocked.some(b => pathname.toLowerCase().startsWith(b))) {
    return new NextResponse(null, { status: 404 });
  }

  // ── Rate limiting per route type ──
  if (pathname.startsWith('/api/payment')) {
    if (isRateLimited(`pay:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many payment requests. Try again later.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/email')) {
    if (isRateLimited(`email:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many email requests.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/download')) {
    if (isRateLimited(`dl:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Download limit reached.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/waitlist')) {
    if (isRateLimited(`wl:${ip}`, 3, 60_000)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/agents')) {
    if (isRateLimited(`agent:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }
  }

  if (pathname.startsWith('/api/market')) {
    if (isRateLimited(`market:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
    }
  }

  // ── Global rate limit — 100 requests/minute per IP ──
  if (pathname.startsWith('/api/')) {
    if (isRateLimited(`global:${ip}`, 100, 60_000)) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    }
  }

  // ── Protect /admin at edge ──
  if (pathname.startsWith('/admin')) {
    // Check for Supabase auth cookie
    const hasCookie = req.cookies.getAll().some(c => c.name.includes('auth-token'));
    if (!hasCookie) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', req.url));
    }
  }

  // ── Block direct access to API internals ──
  if (pathname.startsWith('/api/admin')) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // ── Response with security headers ──
  const res = NextResponse.next();

  // Remove server info
  res.headers.delete('Server');
  res.headers.delete('X-Powered-By');

  return res;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/dashboard/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
