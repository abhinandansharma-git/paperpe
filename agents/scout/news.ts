// News sources for Indian markets

export interface NewsItem {
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  symbols: string[];
}

const KEYWORDS = {
  bullish: ['surge', 'rally', 'gains', 'bullish', 'breakout', 'up', 'high', 'record', 'soar', 'jump'],
  bearish: ['crash', 'fall', 'drop', 'bearish', 'breakdown', 'down', 'low', 'plunge', 'sink', 'decline'],
};

export function analyzeSentiment(text: string): 'bullish' | 'bearish' | 'neutral' {
  const lowerText = text.toLowerCase();
  let bullishScore = 0;
  let bearishScore = 0;
  
  KEYWORDS.bullish.forEach(word => {
    if (lowerText.includes(word)) bullishScore++;
  });
  
  KEYWORDS.bearish.forEach(word => {
    if (lowerText.includes(word)) bearishScore++;
  });
  
  if (bullishScore > bearishScore + 1) return 'bullish';
  if (bearishScore > bullishScore + 1) return 'bearish';
  return 'neutral';
}

export function extractSymbols(text: string): string[] {
  const patterns = ['NIFTY', 'BANKNIFTY', 'SENSEX', 'RELIANCE', 'TCS', 'INFY', 'HDFC', 'ICICI', 'SBI', 'TATA', 'ADANI', 'CRUDE', 'GOLD', 'SILVER'];
  const found: string[] = [];
  const upper = text.toUpperCase();
  patterns.forEach(p => {
    if (upper.includes(p) && !found.includes(p)) found.push(p);
  });
  return found;
}

// Mock news data for demo (in production, fetch from RSS)
const MOCK_NEWS: NewsItem[] = [
  { title: 'NIFTY hits new all-time high', summary: 'Index surges past 22000 on FII buying', source: 'moneycontrol', url: '#', publishedAt: new Date().toISOString(), sentiment: 'bullish', symbols: ['NIFTY'] },
  { title: 'Crude oil prices surge on geopolitical tensions', summary: 'MCX crude rallies 5% as Middle East tensions escalate', source: 'economictimes', url: '#', publishedAt: new Date().toISOString(), sentiment: 'bullish', symbols: ['CRUDE'] },
  { title: 'Gold continues safe-haven rally', summary: 'Yellow metal up 2% as investors seek safety', source: 'livemint', url: '#', publishedAt: new Date().toISOString(), sentiment: 'bullish', symbols: ['GOLD'] },
  { title: 'BANKNIFTY consolidates near resistance', summary: 'Banking index faces selling pressure at 48000', source: 'moneycontrol', url: '#', publishedAt: new Date().toISOString(), sentiment: 'neutral', symbols: ['BANKNIFTY'] },
  { title: 'IT stocks under pressure on weak guidance', summary: 'TCS, Infosys see selling after Q4 outlook', source: 'economictimes', url: '#', publishedAt: new Date().toISOString(), sentiment: 'bearish', symbols: ['TCS', 'INFY'] },
];

export async function fetchAllNews(): Promise<NewsItem[]> {
  // In production, implement actual RSS fetching
  // For now, return mock data with randomized sentiment
  return MOCK_NEWS.map(item => ({
    ...item,
    publishedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
  }));
}

export async function fetchMarketMovers(): Promise<NewsItem[]> {
  const news = await fetchAllNews();
  return news.filter(item => item.symbols.length > 0 || item.sentiment !== 'neutral');
}
