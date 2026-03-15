import { NextResponse } from 'next/server';

// In-memory cache to avoid hammering NSE
const CACHE: Record<string, { data: unknown; ts: number }> = {};
const TTL = 3 * 60 * 1000; // 3 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'NIFTY').toUpperCase();

  // Serve from cache if fresh
  const hit = CACHE[symbol];
  if (hit && Date.now() - hit.ts < TTL) {
    return NextResponse.json(hit.data, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    // Step 1: visit NSE homepage to get session cookies
    const homeRes = await fetch('https://www.nseindia.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });

    // Parse cookies from response headers
    const rawCookies = homeRes.headers.getSetCookie?.() ?? [];
    const cookieStr = rawCookies.map(c => c.split(';')[0]).join('; ');

    // Step 2: fetch the option chain
    const ocRes = await fetch(
      `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.nseindia.com/option-chain',
          'Cookie': cookieStr,
          'Connection': 'keep-alive',
        },
        cache: 'no-store',
      }
    );

    if (!ocRes.ok) throw new Error(`NSE status ${ocRes.status}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await ocRes.json();
    const allRecords: any[] = raw.records?.data ?? [];
    const expiryDates: string[] = raw.records?.expiryDates ?? [];
    const underlyingValue: number = raw.records?.underlyingValue ?? 0;
    const timestamp: string = raw.records?.timestamp ?? '';
    const nearestExpiry = expiryDates[0] ?? '';

    // Filter to nearest expiry
    const records = allRecords.filter(r => r.expiryDate === nearestExpiry);

    // ── PCR ──────────────────────────────────────────────────────────────────
    let totalCallOI = 0;
    let totalPutOI = 0;
    for (const r of records) {
      totalCallOI += r.CE?.openInterest ?? 0;
      totalPutOI  += r.PE?.openInterest ?? 0;
    }
    const pcr = totalCallOI > 0 ? +(totalPutOI / totalCallOI).toFixed(3) : 0;

    // ── Max Pain ─────────────────────────────────────────────────────────────
    const strikeSet = new Set(records.map(r => r.strikePrice as number));
    const strikes: number[] = Array.from(strikeSet).sort((a, b) => a - b);
    let maxPainStrike = strikes[Math.floor(strikes.length / 2)] ?? 0;
    let minPain = Infinity;

    for (const S of strikes) {
      let pain = 0;
      for (const r of records) {
        const K: number = r.strikePrice;
        pain += Math.max(0, S - K) * (r.CE?.openInterest ?? 0);
        pain += Math.max(0, K - S) * (r.PE?.openInterest ?? 0);
      }
      if (pain < minPain) { minPain = pain; maxPainStrike = S; }
    }

    // ── Per-strike data ───────────────────────────────────────────────────────
    const strikeData = records.map(r => ({
      strike:    r.strikePrice as number,
      callOI:    (r.CE?.openInterest     ?? 0) as number,
      putOI:     (r.PE?.openInterest     ?? 0) as number,
      callChng:  (r.CE?.changeinOpenInterest ?? 0) as number,
      putChng:   (r.PE?.changeinOpenInterest ?? 0) as number,
      callLTP:   (r.CE?.lastPrice        ?? 0) as number,
      putLTP:    (r.PE?.lastPrice        ?? 0) as number,
      callIV:    (r.CE?.impliedVolatility ?? 0) as number,
      putIV:     (r.PE?.impliedVolatility ?? 0) as number,
    }));

    const payload = {
      symbol, underlyingValue, timestamp,
      expiryDates, nearestExpiry,
      pcr, totalCallOI, totalPutOI,
      maxPainStrike, strikeData,
    };

    CACHE[symbol] = { data: payload, ts: Date.now() };
    return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS' } });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `NSE data unavailable: ${msg}` }, { status: 503 });
  }
}
