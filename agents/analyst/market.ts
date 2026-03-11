// Market data and analysis utilities

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  timestamp: string;
}

export interface MarketOverview {
  nifty: MarketData;
  banknifty: MarketData;
  sensex: MarketData;
  vix: number;
  advance: number;
  decline: number;
  fiiActivity: 'buying' | 'selling' | 'neutral';
  marketBreadth: 'strong' | 'weak' | 'neutral';
}

export interface TechnicalLevels {
  symbol: string;
  support1: number;
  support2: number;
  resistance1: number;
  resistance2: number;
  pivot: number;
  trend: 'bullish' | 'bearish' | 'sideways';
}

// Mock data generator (in production, fetch from API)
export function getMockMarketData(): MarketOverview {
  const baseNifty = 22000 + Math.random() * 500 - 250;
  const niftyChange = (Math.random() - 0.5) * 200;
  
  return {
    nifty: {
      symbol: 'NIFTY',
      price: Math.round(baseNifty),
      change: Math.round(niftyChange),
      changePercent: Number((niftyChange / baseNifty * 100).toFixed(2)),
      high: Math.round(baseNifty + Math.random() * 100),
      low: Math.round(baseNifty - Math.random() * 100),
      volume: Math.round(Math.random() * 500000000),
      timestamp: new Date().toISOString(),
    },
    banknifty: {
      symbol: 'BANKNIFTY',
      price: Math.round(47000 + Math.random() * 1000 - 500),
      change: Math.round((Math.random() - 0.5) * 400),
      changePercent: Number(((Math.random() - 0.5) * 2).toFixed(2)),
      high: 47500,
      low: 46800,
      volume: Math.round(Math.random() * 200000000),
      timestamp: new Date().toISOString(),
    },
    sensex: {
      symbol: 'SENSEX',
      price: Math.round(72000 + Math.random() * 800 - 400),
      change: Math.round((Math.random() - 0.5) * 600),
      changePercent: Number(((Math.random() - 0.5) * 1.5).toFixed(2)),
      high: 72500,
      low: 71800,
      volume: Math.round(Math.random() * 100000000),
      timestamp: new Date().toISOString(),
    },
    vix: Number((12 + Math.random() * 8).toFixed(2)),
    advance: Math.round(800 + Math.random() * 600),
    decline: Math.round(600 + Math.random() * 600),
    fiiActivity: Math.random() > 0.6 ? 'buying' : Math.random() > 0.3 ? 'selling' : 'neutral',
    marketBreadth: Math.random() > 0.6 ? 'strong' : Math.random() > 0.3 ? 'weak' : 'neutral',
  };
}

export function calculateTechnicalLevels(data: MarketData): TechnicalLevels {
  const { price, high, low } = data;
  const pivot = (high + low + price) / 3;
  
  return {
    symbol: data.symbol,
    support1: Math.round(2 * pivot - high),
    support2: Math.round(pivot - (high - low)),
    resistance1: Math.round(2 * pivot - low),
    resistance2: Math.round(pivot + (high - low)),
    pivot: Math.round(pivot),
    trend: data.changePercent > 0.3 ? 'bullish' : data.changePercent < -0.3 ? 'bearish' : 'sideways',
  };
}

export function getMarketMood(vix: number, breadth: string): string {
  if (vix > 20) return 'Fear (High VIX)';
  if (vix < 13 && breadth === 'strong') return 'Greed (Low VIX + Strong Breadth)';
  if (breadth === 'strong') return 'Optimistic';
  if (breadth === 'weak') return 'Cautious';
  return 'Neutral';
}
