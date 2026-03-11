import { getMockMarketData, calculateTechnicalLevels, getMarketMood, MarketOverview, TechnicalLevels } from './market';

export interface DailyAnalysis {
  date: string;
  marketOverview: MarketOverview;
  niftyLevels: TechnicalLevels;
  bankniftyLevels: TechnicalLevels;
  mood: string;
  outlook: 'bullish' | 'bearish' | 'neutral' | 'sideways';
  keyInsights: string[];
  tradingPlan: string;
  tweetSummary: string;
}

function generateInsights(data: MarketOverview): string[] {
  const insights: string[] = [];
  
  // VIX insight
  if (data.vix > 18) {
    insights.push(`VIX at ${data.vix} - elevated fear, expect volatility`);
  } else if (data.vix < 13) {
    insights.push(`VIX at ${data.vix} - low fear, complacency warning`);
  }
  
  // Breadth insight
  if (data.advance > data.decline * 1.5) {
    insights.push(`Strong breadth: ${data.advance} advances vs ${data.decline} declines`);
  } else if (data.decline > data.advance * 1.5) {
    insights.push(`Weak breadth: Only ${data.advance} advances vs ${data.decline} declines`);
  }
  
  // FII insight
  if (data.fiiActivity === 'buying') {
    insights.push('FIIs are net buyers - positive for markets');
  } else if (data.fiiActivity === 'selling') {
    insights.push('FIIs are net sellers - watch for weakness');
  }
  
  // Index insight
  if (data.nifty.changePercent > 0.5) {
    insights.push(`NIFTY up ${data.nifty.changePercent}% - bulls in control`);
  } else if (data.nifty.changePercent < -0.5) {
    insights.push(`NIFTY down ${Math.abs(data.nifty.changePercent)}% - bears active`);
  }
  
  // Bank vs Nifty
  if (data.banknifty.changePercent > data.nifty.changePercent + 0.3) {
    insights.push('BANKNIFTY outperforming - financials leading');
  } else if (data.banknifty.changePercent < data.nifty.changePercent - 0.3) {
    insights.push('BANKNIFTY underperforming - financials lagging');
  }
  
  return insights.slice(0, 4);
}

function generateTradingPlan(data: MarketOverview, niftyLevels: TechnicalLevels): string {
  const { trend } = niftyLevels;
  
  if (trend === 'bullish') {
    return `BULLISH BIAS: Look for CALL opportunities on dips to ${niftyLevels.support1}. Avoid shorts. Target: ${niftyLevels.resistance1}`;
  } else if (trend === 'bearish') {
    return `BEARISH BIAS: Look for PUT opportunities on rallies to ${niftyLevels.resistance1}. Avoid longs. Target: ${niftyLevels.support1}`;
  }
  return `NEUTRAL/SIDEWAYS: Range trading between ${niftyLevels.support1}-${niftyLevels.resistance1}. Sell straddles or wait for breakout.`;
}

function generateTweetSummary(analysis: DailyAnalysis): string {
  const emoji = analysis.outlook === 'bullish' ? '??' : analysis.outlook === 'bearish' ? '??' : '??';
  
  return `${emoji} Daily Market Analysis\n\nNIFTY: ${analysis.marketOverview.nifty.price} (${analysis.marketOverview.nifty.changePercent > 0 ? '+' : ''}${analysis.marketOverview.nifty.changePercent}%)\nMood: ${analysis.mood}\nOutlook: ${analysis.outlook.toUpperCase()}\n\nKey Level: ${analysis.niftyLevels.pivot}\n\n#NIFTY #StockMarket #Trading`;
}

export async function runAnalystAgent(): Promise<DailyAnalysis> {
  console.log('[Analyst Agent] Generating daily analysis...');
  
  // Get market data
  const marketData = getMockMarketData();
  
  // Calculate levels
  const niftyLevels = calculateTechnicalLevels(marketData.nifty);
  const bankniftyLevels = calculateTechnicalLevels(marketData.banknifty);
  
  // Determine mood and outlook
  const mood = getMarketMood(marketData.vix, marketData.marketBreadth);
  const outlook = niftyLevels.trend;
  
  // Generate insights
  const keyInsights = generateInsights(marketData);
  
  // Generate trading plan
  const tradingPlan = generateTradingPlan(marketData, niftyLevels);
  
  const analysis: DailyAnalysis = {
    date: new Date().toISOString().split('T')[0],
    marketOverview: marketData,
    niftyLevels,
    bankniftyLevels,
    mood,
    outlook,
    keyInsights,
    tradingPlan,
    tweetSummary: '',
  };
  
  analysis.tweetSummary = generateTweetSummary(analysis);
  
  console.log(`[Analyst Agent] Analysis ready: ${outlook} outlook`);
  
  return analysis;
}

export function getQuickLevels(): { nifty: TechnicalLevels; banknifty: TechnicalLevels } {
  const data = getMockMarketData();
  return {
    nifty: calculateTechnicalLevels(data.nifty),
    banknifty: calculateTechnicalLevels(data.banknifty),
  };
}

