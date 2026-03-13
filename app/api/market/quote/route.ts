import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.MARKET_API_URL || 'http://localhost:5000';
const CACHE = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 60000;

// Only allow alphanumeric + basic symbols
function isValidSymbol(s: string): boolean {
  return /^[A-Za-z0-9._^-]{1,30}$/.test(s);
}

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol');

  if (!symbol || !isValidSymbol(symbol)) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  const cacheKey = `quote:${symbol}`;
  const cached = CACHE.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...cached.data, _cached: true });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/quote/${encodeURIComponent(symbol)}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      CACHE.set(cacheKey, { data, timestamp: Date.now() });
      return NextResponse.json(data);
    }

    const yf = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}.NS?interval=1d&range=1d`);
    if (yf.ok) {
      const yfData = await yf.json();
      const quote = yfData?.chart?.result?.[0]?.meta;
      if (quote) {
        const data = {
          symbol,
          lastPrice: quote.regularMarketPrice,
          previousClose: quote.previousClose,
          change: quote.regularMarketPrice - quote.previousClose,
          pctChange: ((quote.regularMarketPrice - quote.previousClose) / quote.previousClose * 100).toFixed(2),
          source: 'yahoo',
        };
        CACHE.set(cacheKey, { data, timestamp: Date.now() });
        return NextResponse.json(data);
      }
    }

    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }
}
