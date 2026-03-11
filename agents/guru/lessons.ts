// Trading education content library

export interface Lesson {
  id: string;
  title: string;
  category: 'basics' | 'technical' | 'options' | 'psychology' | 'risk' | 'strategies';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  keyPoints: string[];
  quiz?: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const LESSONS: Lesson[] = [
  // BASICS
  {
    id: 'basics-1',
    title: 'What is the Stock Market?',
    category: 'basics',
    difficulty: 'beginner',
    content: `The stock market is where buyers and sellers trade shares of publicly listed companies. In India, the two main exchanges are NSE (National Stock Exchange) and BSE (Bombay Stock Exchange).\n\nWhen you buy a stock, you're buying a small piece of ownership in that company. If the company does well, your shares become more valuable.\n\nThe market operates from 9:15 AM to 3:30 PM on weekdays, except holidays.`,
    keyPoints: [
      'Stock = ownership in a company',
      'NSE and BSE are India\'s main exchanges',
      'Market hours: 9:15 AM - 3:30 PM',
      'Prices move based on supply and demand',
    ],
  },
  {
    id: 'basics-2',
    title: 'Understanding NIFTY and SENSEX',
    category: 'basics',
    difficulty: 'beginner',
    content: `NIFTY 50 and SENSEX are indices that track the overall market performance.\n\nNIFTY 50: Top 50 companies on NSE\nSENSEX: Top 30 companies on BSE\n\nWhen people say "the market is up", they usually mean these indices are up. They\'re like a report card for the market.`,
    keyPoints: [
      'NIFTY 50 = Top 50 NSE stocks',
      'SENSEX = Top 30 BSE stocks',
      'Indices show overall market direction',
      'Used as benchmarks for performance',
    ],
  },
  // TECHNICAL
  {
    id: 'tech-1',
    title: 'Support and Resistance',
    category: 'technical',
    difficulty: 'beginner',
    content: `Support is a price level where buying interest is strong enough to stop the price from falling further. Think of it as a floor.\n\nResistance is where selling pressure prevents price from rising. Think of it as a ceiling.\n\nKey insight: When support breaks, it often becomes resistance (and vice versa).`,
    keyPoints: [
      'Support = floor (buyers step in)',
      'Resistance = ceiling (sellers step in)',
      'Broken support becomes resistance',
      'More touches = stronger level',
    ],
  },
  {
    id: 'tech-2',
    title: 'Candlestick Basics',
    category: 'technical',
    difficulty: 'beginner',
    content: `Each candlestick shows 4 prices: Open, High, Low, Close (OHLC).\n\nGreen candle: Close > Open (bullish)\nRed candle: Close < Open (bearish)\n\nThe body shows open-close range. Wicks show high-low range. Long wicks indicate rejection of prices.`,
    keyPoints: [
      'Green = price went up',
      'Red = price went down',
      'Body = open to close range',
      'Wicks = high/low extremes',
    ],
  },
  // OPTIONS
  {
    id: 'options-1',
    title: 'What are Options?',
    category: 'options',
    difficulty: 'intermediate',
    content: `Options give you the RIGHT (not obligation) to buy or sell at a fixed price.\n\nCALL option: Right to BUY at strike price\nPUT option: Right to SELL at strike price\n\nYou pay a premium for this right. If the market moves in your favor, you profit. If not, you only lose the premium.`,
    keyPoints: [
      'CALL = bullish bet (expect price to rise)',
      'PUT = bearish bet (expect price to fall)',
      'Premium = cost of the option',
      'Max loss = premium paid (for buyers)',
    ],
  },
  {
    id: 'options-2',
    title: 'Understanding Option Greeks',
    category: 'options',
    difficulty: 'advanced',
    content: `Greeks measure how option prices change:\n\nDelta: How much option moves per ₹1 stock move\nTheta: How much value lost per day (time decay)\nVega: Sensitivity to volatility changes\nGamma: Rate of delta change\n\nMost important for beginners: Delta and Theta.`,
    keyPoints: [
      'Delta = directional exposure',
      'Theta = daily time decay (enemy of buyers)',
      'High IV = expensive options',
      'ATM options have highest theta decay',
    ],
  },
  // PSYCHOLOGY
  {
    id: 'psych-1',
    title: 'Controlling Fear and Greed',
    category: 'psychology',
    difficulty: 'beginner',
    content: `Fear makes you exit too early or avoid good trades.\nGreed makes you hold too long or overtrade.\n\nThe fix: Have a plan BEFORE entering. Know your entry, stop loss, and target. Then follow it mechanically.\n\nYour emotions are not your friend in trading.`,
    keyPoints: [
      'Plan your trade before entering',
      'Set stop loss immediately',
      'Don\'t move your stop loss',
      'Take profits at predetermined levels',
    ],
  },
  {
    id: 'psych-2',
    title: 'Revenge Trading',
    category: 'psychology',
    difficulty: 'beginner',
    content: `Revenge trading is when you take impulsive trades to recover losses. It almost always makes things worse.\n\nAfter a loss:\n1. Step away from the screen\n2. Review what went wrong\n3. Only trade again when calm\n\nLosses are part of trading. Don\'t let one bad trade become five.`,
    keyPoints: [
      'Never trade angry or frustrated',
      'Take breaks after losses',
      'One loss shouldn\'t trigger another',
      'Revenge trading = guaranteed more losses',
    ],
  },
  // RISK
  {
    id: 'risk-1',
    title: 'Position Sizing',
    category: 'risk',
    difficulty: 'intermediate',
    content: `Never risk more than 1-2% of your capital on a single trade.\n\nExample: ₹1,00,000 capital\nMax risk per trade: ₹1,000-2,000\n\nThis means if your stop loss is ₹10 away, you can buy 100-200 shares max.\n\nPosition sizing protects you from blowing up your account.`,
    keyPoints: [
      'Risk 1-2% max per trade',
      'Calculate position size from stop loss',
      'Smaller positions = longer survival',
      'Protect capital above all else',
    ],
  },
  // STRATEGIES
  {
    id: 'strat-1',
    title: 'Trend Following',
    category: 'strategies',
    difficulty: 'intermediate',
    content: `"The trend is your friend" - trade in the direction of the larger trend.\n\nUptrend: Higher highs, higher lows → Look for CALLS\nDowntrend: Lower highs, lower lows → Look for PUTS\n\nDon\'t fight the trend. Wait for pullbacks to enter with the trend.`,
    keyPoints: [
      'Identify the trend first',
      'Buy dips in uptrend',
      'Sell rallies in downtrend',
      'Trend trades have higher probability',
    ],
  },
];

export function getLessonsByCategory(category: Lesson['category']): Lesson[] {
  return LESSONS.filter(l => l.category === category);
}

export function getLessonsByDifficulty(difficulty: Lesson['difficulty']): Lesson[] {
  return LESSONS.filter(l => l.difficulty === difficulty);
}

export function getRandomLesson(): Lesson {
  return LESSONS[Math.floor(Math.random() * LESSONS.length)];
}

export function searchLessons(query: string): Lesson[] {
  const lower = query.toLowerCase();
  return LESSONS.filter(l => 
    l.title.toLowerCase().includes(lower) ||
    l.content.toLowerCase().includes(lower) ||
    l.keyPoints.some(p => p.toLowerCase().includes(lower))
  );
}
