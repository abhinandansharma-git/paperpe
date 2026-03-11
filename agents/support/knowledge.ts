// FAQ and Knowledge Base for Support Agent

export interface FAQ {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
  category: 'general' | 'trading' | 'account' | 'technical' | 'pricing';
}

export const FAQS: FAQ[] = [
  // GENERAL
  {
    id: 'gen-1',
    question: 'What is PaperPe?',
    keywords: ['what', 'paperpe', 'about', 'platform'],
    answer: 'PaperPe is India\'s #1 paper trading platform. Practice trading NSE, MCX & F&O with ₹10 Lakh virtual capital. Zero risk, real market data, real skills!',
    category: 'general',
  },
  {
    id: 'gen-2',
    question: 'Is PaperPe free?',
    keywords: ['free', 'cost', 'price', 'pay', 'charge'],
    answer: 'Yes! PaperPe is 100% FREE to use. We believe everyone should have access to practice trading without risking real money. Our free tier includes all essential features.',
    category: 'general',
  },
  {
    id: 'gen-3',
    question: 'How do I get started?',
    keywords: ['start', 'begin', 'signup', 'register', 'join'],
    answer: 'Getting started is easy! 1) Sign up with your email, 2) You\'ll get ₹10L virtual capital instantly, 3) Start placing trades! No KYC or documents needed.',
    category: 'general',
  },
  // TRADING
  {
    id: 'trade-1',
    question: 'What markets can I trade?',
    keywords: ['market', 'trade', 'nse', 'mcx', 'stocks', 'options', 'futures'],
    answer: 'You can trade: NSE Stocks (Equity), NSE F&O (Futures & Options on NIFTY, BANKNIFTY, stocks), and MCX Commodities (Gold, Silver, Crude Oil). All with real-time data!',
    category: 'trading',
  },
  {
    id: 'trade-2',
    question: 'Is the data real-time?',
    keywords: ['real-time', 'live', 'data', 'delay', 'price'],
    answer: 'Yes! We use real-time market data from NSE and MCX. Prices update live during market hours so you get the authentic trading experience.',
    category: 'trading',
  },
  {
    id: 'trade-3',
    question: 'What is virtual capital?',
    keywords: ['virtual', 'capital', 'money', 'fake', 'paper'],
    answer: 'Virtual capital is simulated money for practice. You start with ₹10 Lakh virtual capital. It\'s not real money - you can\'t withdraw it, but you can\'t lose real money either! Perfect for learning.',
    category: 'trading',
  },
  {
    id: 'trade-4',
    question: 'Can I reset my portfolio?',
    keywords: ['reset', 'restart', 'new', 'fresh', 'portfolio'],
    answer: 'Yes! You can reset your portfolio anytime from Settings. This will restore your virtual capital to ₹10L and clear all positions. Great for starting fresh!',
    category: 'trading',
  },
  // ACCOUNT
  {
    id: 'acc-1',
    question: 'How do I change my password?',
    keywords: ['password', 'change', 'reset', 'forgot'],
    answer: 'Go to Settings > Security > Change Password. If you forgot your password, click "Forgot Password" on the login page and we\'ll send a reset link to your email.',
    category: 'account',
  },
  {
    id: 'acc-2',
    question: 'How do I delete my account?',
    keywords: ['delete', 'remove', 'account', 'close'],
    answer: 'Go to Settings > Account > Delete Account. Note: This is permanent and all your trade history will be lost. You can always create a new account later.',
    category: 'account',
  },
  // TECHNICAL
  {
    id: 'tech-1',
    question: 'Why is my order not executing?',
    keywords: ['order', 'execute', 'pending', 'stuck', 'not working'],
    answer: 'Orders execute at market price during market hours (9:15 AM - 3:30 PM for NSE). If market is closed, your order will be queued. Check if you have sufficient virtual margin for F&O trades.',
    category: 'technical',
  },
  {
    id: 'tech-2',
    question: 'App is not loading / showing error',
    keywords: ['error', 'loading', 'crash', 'bug', 'not working', 'problem'],
    answer: 'Try these steps: 1) Refresh the page, 2) Clear browser cache, 3) Try a different browser, 4) Check your internet connection. If issue persists, contact us at support@paperpe.in',
    category: 'technical',
  },
  // PRICING
  {
    id: 'price-1',
    question: 'What is Premium?',
    keywords: ['premium', 'pro', 'paid', 'subscription'],
    answer: 'Premium (₹499/month) unlocks: Advanced charts with 100+ indicators, Options Greeks, Institutional data, Priority support, and Ad-free experience. But the free tier has everything you need to learn!',
    category: 'pricing',
  },
  {
    id: 'price-2',
    question: 'How do I go live / trade real money?',
    keywords: ['live', 'real', 'money', 'broker', 'actual'],
    answer: 'Ready to trade real money? We partner with top brokers like Zerodha, Groww, and Angel One. Check our Brokers page to open a free demat account and start live trading!',
    category: 'pricing',
  },
];

export function findAnswer(query: string): FAQ | null {
  const lowerQuery = query.toLowerCase();
  
  // Score each FAQ by keyword matches
  let bestMatch: FAQ | null = null;
  let bestScore = 0;
  
  for (const faq of FAQS) {
    let score = 0;
    
    // Check keywords
    for (const keyword of faq.keywords) {
      if (lowerQuery.includes(keyword)) {
        score += 2;
      }
    }
    
    // Check question similarity
    const questionWords = faq.question.toLowerCase().split(' ');
    for (const word of questionWords) {
      if (word.length > 3 && lowerQuery.includes(word)) {
        score += 1;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }
  
  // Return match only if score is good enough
  return bestScore >= 2 ? bestMatch : null;
}

export function getFAQsByCategory(category: FAQ['category']): FAQ[] {
  return FAQS.filter(f => f.category === category);
}

export function getAllFAQs(): FAQ[] {
  return FAQS;
}
