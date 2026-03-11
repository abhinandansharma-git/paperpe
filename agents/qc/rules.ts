// Quality Check rules and validation

export interface QCCheck {
  name: string;
  passed: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface QCResult {
  content: string;
  contentType: 'tweet' | 'article' | 'response' | 'analysis';
  passed: boolean;
  score: number;
  checks: QCCheck[];
  suggestions: string[];
  timestamp: string;
}

const BLOCKED_WORDS = [
  'guaranteed', 'sure shot', '100% profit', 'risk free profit',
  'insider tip', 'pump', 'dump', 'manipulation',
];

export function checkLength(content: string, type: string): QCCheck {
  const limits: Record<string, { min: number; max: number }> = {
    tweet: { min: 10, max: 280 },
    article: { min: 200, max: 5000 },
    response: { min: 5, max: 500 },
    analysis: { min: 50, max: 2000 },
  };
  
  const limit = limits[type] || limits.response;
  const length = content.length;
  
  if (length < limit.min) {
    return { name: 'Length Check', passed: false, message: `Too short (${length}/${limit.min} min)`, severity: 'error' };
  }
  if (length > limit.max) {
    return { name: 'Length Check', passed: false, message: `Too long (${length}/${limit.max} max)`, severity: 'error' };
  }
  return { name: 'Length Check', passed: true, message: `Good length (${length} chars)`, severity: 'info' };
}

export function checkBlockedWords(content: string): QCCheck {
  const lower = content.toLowerCase();
  const found = BLOCKED_WORDS.filter(word => lower.includes(word));
  
  if (found.length > 0) {
    return { name: 'Content Policy', passed: false, message: `Blocked words: ${found.join(', ')}`, severity: 'error' };
  }
  return { name: 'Content Policy', passed: true, message: 'No blocked content', severity: 'info' };
}

export function checkDisclaimer(content: string, required: boolean): QCCheck {
  if (!required) return { name: 'Disclaimer', passed: true, message: 'Not required', severity: 'info' };
  
  const lower = content.toLowerCase();
  const hasDisclaimer = ['paper trading', 'educational', 'virtual', 'practice', 'not financial advice'].some(d => lower.includes(d));
  
  if (!hasDisclaimer) {
    return { name: 'Disclaimer', passed: false, message: 'Add disclaimer about paper trading', severity: 'warning' };
  }
  return { name: 'Disclaimer', passed: true, message: 'Disclaimer present', severity: 'info' };
}

export function checkGrammar(content: string): QCCheck {
  const issues: string[] = [];
  if (content.includes('  ')) issues.push('double spaces');
  
  if (issues.length > 0) {
    return { name: 'Grammar', passed: false, message: `Issues: ${issues.join(', ')}`, severity: 'warning' };
  }
  return { name: 'Grammar', passed: true, message: 'Grammar OK', severity: 'info' };
}

export function checkEmoji(content: string, type: string): QCCheck {
  // Simple emoji detection - count common emoji characters
  let emojiCount = 0;
  for (let i = 0; i < content.length; i++) {
    const code = content.charCodeAt(i);
    if (code >= 0xD800 && code <= 0xDBFF) emojiCount++;
  }
  
  if (type === 'tweet' && emojiCount === 0) {
    return { name: 'Engagement', passed: true, message: 'Consider adding emoji', severity: 'info' };
  }
  if (emojiCount > 5) {
    return { name: 'Engagement', passed: false, message: 'Too many emojis', severity: 'warning' };
  }
  return { name: 'Engagement', passed: true, message: `${emojiCount} emojis - OK`, severity: 'info' };
}

export function checkHashtags(content: string, type: string): QCCheck {
  const hashtags = content.split('#').length - 1;
  
  if (type === 'tweet' && hashtags > 5) {
    return { name: 'Hashtags', passed: false, message: 'Too many hashtags (max 5)', severity: 'warning' };
  }
  return { name: 'Hashtags', passed: true, message: `${hashtags} hashtags`, severity: 'info' };
}
