import { NextResponse } from 'next/server';

const CACHE: Record<string, { data: unknown; ts: number }> = {};
const TTL = 3 * 60 * 1000;

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

function parseCookies(res: Response): string {
  // Try getSetCookie (Node 18+) first, fall back to get('set-cookie')
  let raw: string[] = [];
  if (typeof (res.headers as any).getSetCookie === 'function') {
    raw = (res.headers as any).getSetCookie();
  } else {
    const h = res.headers.get('set-cookie');
    if (h) raw = h.split(/,\s*(?=[a-zA-Z_-]+=)/);
  }
  return raw.map(c => c.split(';')[0].trim()).filter(c => c.includes('=')).join('; ');
}

async function fetchNSE(symbol: string) {
  const baseHeaders = {
    'User-Agent': UA,
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
  };

  // Step 1 — homepage for cookies
  const r1 = await fetch('https://www.nseindia.com/', {
    headers: { ...baseHeaders, 'Accept': 'text/html,application/xhtml+xml' },
    cache: 'no-store',
  });
  const c1 = parseCookies(r1);

  // Step 2 — option-chain page for extra cookies
  const r2 = await fetch('https://www.nseindia.com/option-chain', {
    headers: { ...baseHeaders, 'Accept': 'text/html,application/xhtml+xml', 'Cookie': c1, 'Referer': 'https://www.nseindia.com/' },
    cache: 'no-store',
  });
  const c2 = parseCookies(r2);
  const allCookies = [c1, c2].filter(Boolean).join('; ');

  // Step 3 — actual API call
  const apiRes = await fetch(
    `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`,
    {
      headers: {
        ...baseHeaders,
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://www.nseindia.com/option-chain',
        'Cookie': allCookies,
        'X-Requested-With': 'XMLHttpRequest',
      },
      cache: 'no-store',
    }
  );

  if (!apiRes.ok) throw new Error(`NSE ${apiRes.status}`);
  const contentType = apiRes.headers.get('content-type') ?? '';
  if (!contentType.includes('json')) throw new Error('NSE returned non-JSON (blocked)');

  return apiRes.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = (searchParams.get('symbol') || 'NIFTY').toUpperCase();

  const hit = CACHE[symbol];
  if (hit && Date.now() - hit.ts < TTL) {
    return NextResponse.json(hit.data, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any = await fetchNSE(symbol);

    const allRecords: any[] = raw.records?.data ?? [];
    const expiryDates: string[] = raw.records?.expiryDates ?? [];
    const underlyingValue: number = raw.records?.underlyingValue ?? 0;
    const timestamp: string = raw.records?.timestamp ?? '';
    const nearestExpiry = expiryDates[0] ?? '';

    if (!underlyingValue) throw new Error('Empty response from NSE — may be market hours restriction');

    const records = allRecords.filter((r: any) => r.expiryDate === nearestExpiry);

    let totalCallOI = 0, totalPutOI = 0;
    for (const r of records) {
      totalCallOI += r.CE?.openInterest ?? 0;
      totalPutOI  += r.PE?.openInterest ?? 0;
    }
    const pcr = totalCallOI > 0 ? +(totalPutOI / totalCallOI).toFixed(3) : 0;

    const strikeSet = new Set(records.map((r: any) => r.strikePrice as number));
    const strikes = Array.from(strikeSet).sort((a, b) => a - b);
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

    const strikeData = records.map((r: any) => ({
      strike:   r.strikePrice as number,
      callOI:   (r.CE?.openInterest          ?? 0) as number,
      putOI:    (r.PE?.openInterest           ?? 0) as number,
      callChng: (r.CE?.changeinOpenInterest   ?? 0) as number,
      putChng:  (r.PE?.changeinOpenInterest   ?? 0) as number,
      callLTP:  (r.CE?.lastPrice             ?? 0) as number,
      putLTP:   (r.PE?.lastPrice             ?? 0) as number,
      callIV:   (r.CE?.impliedVolatility      ?? 0) as number,
      putIV:    (r.PE?.impliedVolatility      ?? 0) as number,
    }));

    const payload = {
      symbol, underlyingValue, timestamp, expiryDates, nearestExpiry,
      pcr, totalCallOI, totalPutOI, maxPainStrike, strikeData,
    };

    CACHE[symbol] = { data: payload, ts: Date.now() };
    return NextResponse.json(payload, { headers: { 'X-Cache': 'MISS' } });

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 503 });
  }
}
