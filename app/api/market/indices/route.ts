import { NextResponse } from 'next/server';

const INDICES = [
  { symbol: '^NSEI', name: 'NIFTY 50' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY' },
  { symbol: '^BSESN', name: 'SENSEX' },
];

let cache: { data: any; timestamp: number } | null = null;
const CACHE_TTL = 60000;

export async function GET() {
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...cache.data, _cached: true });
  }
  
  try {
    const results = await Promise.all(
      INDICES.map(async (idx) => {
        try {
          const res = await fetch(
            `https://query1.finance.yahoo.com/v8/finance/chart/${idx.symbol}?interval=1d&range=1d`
          );
          const data = await res.json();
          const meta = data?.chart?.result?.[0]?.meta;
          
          return {
            symbol: idx.name,
            lastPrice: meta?.regularMarketPrice || 0,
            previousClose: meta?.previousClose || 0,
            change: (meta?.regularMarketPrice - meta?.previousClose) || 0,
            pctChange: meta?.previousClose 
              ? (((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100).toFixed(2)
              : '0.00'
          };
        } catch {
          return { symbol: idx.name, error: true };
        }
      })
    );
    
    const response = { indices: results, timestamp: new Date().toISOString() };
    cache = { data: response, timestamp: Date.now() };
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch indices' }, { status: 500 });
  }
}
