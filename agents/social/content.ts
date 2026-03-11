// Content templates for PaperPe social posts

export const TWEET_TEMPLATES = {
  marketTip: [
    "📈 Trading tip: {tip}\n\nPractice risk-free on PaperPe 🚀",
    "💡 Pro tip: {tip}\n\n#trading #stockmarket #papertrading",
    "🎯 {tip}\n\nMaster this on PaperPe - zero risk, real skills!",
  ],
  
  lesson: [
    "📚 Trading lesson of the day:\n\n{lesson}\n\nLearn more at paperpe.in",
    "🧠 Did you know?\n\n{lesson}\n\n#TradingEducation",
  ],
  
  motivation: [
    "💪 {quote}\n\nKeep practicing, keep improving!\n\n#TradingMotivation",
    "🔥 {quote}\n\nYour next win is one trade away!",
  ],
  
  feature: [
    "✨ PaperPe feature spotlight:\n\n{feature}\n\nTry it FREE at paperpe.in",
    "🛠️ {feature}\n\nBuilt for serious traders. Coming soon!",
  ],
  
  poll: [
    "📊 Quick poll:\n\n{question}",
    "🤔 Traders, what do you think?\n\n{question}",
  ],
  
  engagement: [
    "What's your biggest trading challenge?\n\nComment below 👇\n\n#TradingCommunity",
    "RT if you've ever made this mistake: {mistake}\n\n😅 We've all been there!",
    "Your trading win rate this month?\n\n🔥 >60%\n💪 40-60%\n📈 Learning\n\nReply below!",
  ],
};

export const TIPS = [
  "Never risk more than 2% of your capital on a single trade",
  "Always set a stop loss BEFORE entering a trade",
  "The trend is your friend - trade with it, not against it",
  "Don't revenge trade after a loss. Take a break.",
  "Keep a trading journal - review your wins AND losses",
  "Paper trading isn't practice - it's preparation",
  "Position sizing > Entry timing",
  "Cut losses quickly, let winners run",
  "The best trade is sometimes no trade",
  "Learn to sit on your hands during chop",
];

export const LESSONS = [
  "Support becomes resistance once broken. Watch for retests!",
  "Volume confirms price moves. Low volume breakouts often fail.",
  "The first hour of trading has the most volatility",
  "Options lose value every day due to theta decay",
  "Max pain theory: Price tends to move where most options expire worthless",
  "Fear and greed drive markets more than fundamentals",
  "Gap ups often get sold, gap downs often get bought",
];

export const QUOTES = [
  "The goal isn't to be right. It's to make money.",
  "Discipline is the bridge between goals and results.",
  "In trading, it's not about how much you make, but how much you don't lose.",
  "The market can stay irrational longer than you can stay solvent.",
  "Plan your trade, trade your plan.",
];

export function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateTweet(type: keyof typeof TWEET_TEMPLATES): string {
  const templates = TWEET_TEMPLATES[type];
  const template = getRandomItem(templates);
  
  switch (type) {
    case 'marketTip':
      return template.replace('{tip}', getRandomItem(TIPS));
    case 'lesson':
      return template.replace('{lesson}', getRandomItem(LESSONS));
    case 'motivation':
      return template.replace('{quote}', getRandomItem(QUOTES));
    default:
      return template;
  }
}
