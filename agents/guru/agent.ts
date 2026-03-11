import { LESSONS, Lesson, getRandomLesson, getLessonsByCategory, getLessonsByDifficulty } from './lessons';

export interface DailyContent {
  lessonOfTheDay: Lesson;
  tweetThread: string[];
  quickTip: string;
  generatedAt: string;
}

const QUICK_TIPS = [
  'Always set a stop loss before entering a trade.',
  'Never risk more than 2% of your capital on one trade.',
  'The trend is your friend - don\'t fight it.',
  'Paper trading is practice, not just playing.',
  'Cut losses quickly, let winners run.',
  'Volume confirms price moves.',
  'Support becomes resistance once broken.',
  'Don\'t revenge trade after a loss.',
  'Keep a trading journal.',
  'The best trade is sometimes no trade.',
  'Plan your trade, trade your plan.',
  'Options lose value every day - theta decay.',
  'High IV = expensive options.',
  'Gap ups often get sold, gap downs often get bought.',
  'The first hour has the most volatility.',
];

export function generateTweetThread(lesson: Lesson): string[] {
  const thread: string[] = [];
  
  // Tweet 1: Hook
  thread.push(`📚 Trading Lesson: ${lesson.title}\n\nA thread for ${lesson.difficulty} traders 🧵`);
  
  // Tweet 2-3: Key points
  const points = lesson.keyPoints;
  if (points.length >= 2) {
    thread.push(`1️⃣ ${points[0]}\n\n2️⃣ ${points[1]}`);
  }
  if (points.length >= 4) {
    thread.push(`3️⃣ ${points[2]}\n\n4️⃣ ${points[3]}`);
  }
  
  // Tweet 4: CTA
  thread.push(`💡 Practice this concept risk-free on PaperPe!\n\n🔗 paperpe.in\n\n#TradingEducation #StockMarket #LearnToTrade`);
  
  return thread;
}

export function generateQuickTip(): string {
  const tip = QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)];
  return `💡 Quick Tip:\n\n${tip}\n\n#TradingTips #PaperPe`;
}

export async function runGuruAgent(category?: Lesson['category']): Promise<DailyContent> {
  console.log('[Guru Agent] Generating daily content...');
  
  // Get lesson (random or by category)
  let lesson: Lesson;
  if (category) {
    const categoryLessons = getLessonsByCategory(category);
    lesson = categoryLessons[Math.floor(Math.random() * categoryLessons.length)] || getRandomLesson();
  } else {
    lesson = getRandomLesson();
  }
  
  // Generate thread
  const tweetThread = generateTweetThread(lesson);
  
  // Generate quick tip
  const quickTip = generateQuickTip();
  
  const content: DailyContent = {
    lessonOfTheDay: lesson,
    tweetThread,
    quickTip,
    generatedAt: new Date().toISOString(),
  };
  
  console.log(`[Guru Agent] Generated content for: ${lesson.title}`);
  
  return content;
}

export function getAllCategories(): string[] {
  return ['basics', 'technical', 'options', 'psychology', 'risk', 'strategies'];
}

export function getLessonCount(): { total: number; byCategory: Record<string, number> } {
  const byCategory: Record<string, number> = {};
  LESSONS.forEach(l => {
    byCategory[l.category] = (byCategory[l.category] || 0) + 1;
  });
  return { total: LESSONS.length, byCategory };
}
