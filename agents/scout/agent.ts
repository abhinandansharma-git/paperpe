import { fetchAllNews, fetchMarketMovers, NewsItem } from './news';

export interface Opportunity {
  type: 'breakout' | 'news' | 'sentiment' | 'volume';
  symbol: string;
  title: string;
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidence: number; // 0-100
  source: string;
  timestamp: string;
}

export interface ScoutReport {
  generatedAt: string;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  topNews: NewsItem[];
  opportunities: Opportunity[];
  tweetSuggestion?: string;
}

function calculateMarketSentiment(news: NewsItem[]): 'bullish' | 'bearish' | 'neutral' {
  let bullish = 0, bearish = 0;
  
  news.forEach(item => {
    if (item.sentiment === 'bullish') bullish++;
    if (item.sentiment === 'bearish') bearish++;
  });
  
  const total = news.length || 1;
  const bullishPct = bullish / total;
  const bearishPct = bearish / total;
  
  if (bullishPct > 0.5) return 'bullish';
  if (bearishPct > 0.5) return 'bearish';
  return 'neutral';
}

function findOpportunities(news: NewsItem[]): Opportunity[] {
  const opportunities: Opportunity[] = [];
  const symbolMentions: Record<string, NewsItem[]> = {};
  
  // Group news by symbol
  news.forEach(item => {
    item.symbols?.forEach(symbol => {
      if (!symbolMentions[symbol]) symbolMentions[symbol] = [];
      symbolMentions[symbol].push(item);
    });
  });
  
  // Find symbols with multiple mentions (trending)
  Object.entries(symbolMentions).forEach(([symbol, items]) => {
    if (items.length >= 2) {
      const sentiment = items[0].sentiment || 'neutral';
      opportunities.push({
        type: 'news',
        symbol,
        title: `${symbol} trending in news`,
        summary: `${items.length} mentions: ${items.map(i => i.title.slice(0, 50)).join('; ')}`,
        sentiment,
        confidence: Math.min(items.length * 20, 80),
        source: 'multi-source',
        timestamp: new Date().toISOString(),
      });
    }
  });
  
  // Find strong sentiment news
  news.forEach(item => {
    if (item.sentiment !== 'neutral' && item.symbols && item.symbols.length > 0) {
      const mainSymbol = item.symbols[0];
      // Don't duplicate if already added from trending
      if (!opportunities.find(o => o.symbol === mainSymbol && o.type === 'news')) {
        opportunities.push({
          type: 'sentiment',
          symbol: mainSymbol,
          title: item.title,
          summary: item.summary,
          sentiment: item.sentiment || 'neutral',
          confidence: 60,
          source: item.source,
          timestamp: item.publishedAt,
        });
      }
    }
  });
  
  return opportunities.slice(0, 5); // Top 5 opportunities
}

function generateTweetSuggestion(report: ScoutReport): string {
  const emoji = report.marketSentiment === 'bullish' ? '??' : 
                report.marketSentiment === 'bearish' ? '??' : '??';
  
  const topOpp = report.opportunities[0];
  if (topOpp) {
    return `${emoji} Market Scout Alert:\n\n${topOpp.symbol} is trending - ${topOpp.title}\n\nSentiment: ${topOpp.sentiment.toUpperCase()}\n\n#trading #stockmarket`;
  }
  
  return `${emoji} Market Update:\n\nOverall sentiment: ${report.marketSentiment}\nTop stories: ${report.topNews.slice(0, 2).map(n => n.title.slice(0, 40)).join(', ')}\n\n#markets`;
}

export async function runScoutAgent(): Promise<ScoutReport> {
  console.log('[Scout Agent] Starting scan...');
  
  // Fetch news
  const allNews = await fetchAllNews();
  const movers = await fetchMarketMovers();
  
  console.log(`[Scout Agent] Found ${allNews.length} news items, ${movers.length} market movers`);
  
  // Calculate sentiment
  const marketSentiment = calculateMarketSentiment(allNews);
  
  // Find opportunities
  const opportunities = findOpportunities(movers);
  
  // Generate report
  const report: ScoutReport = {
    generatedAt: new Date().toISOString(),
    marketSentiment,
    topNews: allNews.slice(0, 5),
    opportunities,
  };
  
  // Add tweet suggestion
  report.tweetSuggestion = generateTweetSuggestion(report);
  
  console.log(`[Scout Agent] Report ready: ${report.marketSentiment} sentiment, ${opportunities.length} opportunities`);
  
  return report;
}

export async function getLatestInsights(): Promise<{ news: NewsItem[], sentiment: string }> {
  const news = await fetchMarketMovers();
  const sentiment = calculateMarketSentiment(news);
  return { news: news.slice(0, 5), sentiment };
}

