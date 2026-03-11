// Shared Skills System for PaperPe Agents

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'content' | 'data' | 'communication' | 'analysis' | 'design' | 'utility';
  execute: (input: any) => Promise<any>;
}

export interface AgentSkills {
  agentId: string;
  skills: string[]; // skill IDs
}

// === CONTENT SKILLS ===
export const writeThread: Skill = {
  id: 'write-thread',
  name: 'Write Twitter Thread',
  description: 'Generate engaging Twitter threads from content',
  category: 'content',
  execute: async (input: { topic: string; points: string[] }) => {
    const thread = [`🧵 Thread: ${input.topic}\n\n1/`];
    input.points.forEach((point, i) => {
      thread.push(`${i + 2}/ ${point}`);
    });
    thread.push(`${input.points.length + 2}/ That's a wrap! Follow @paperpe_in for more trading insights! 🚀`);
    return thread;
  },
};

export const summarize: Skill = {
  id: 'summarize',
  name: 'Summarize Content',
  description: 'Condense long content into key points',
  category: 'content',
  execute: async (input: { text: string; maxPoints?: number }) => {
    const sentences = input.text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const points = sentences.slice(0, input.maxPoints || 5).map(s => s.trim());
    return { summary: points.join('. ') + '.', keyPoints: points };
  },
};

export const formatPrice: Skill = {
  id: 'format-price',
  name: 'Format Price for Display',
  description: 'Format numbers as Indian currency',
  category: 'utility',
  execute: async (input: { value: number; decimals?: number }) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: input.decimals || 2,
    }).format(input.value);
    return formatted;
  },
};

// === DATA SKILLS ===
export const calculateChange: Skill = {
  id: 'calc-change',
  name: 'Calculate Percentage Change',
  description: 'Calculate % change between two values',
  category: 'data',
  execute: async (input: { old: number; new: number }) => {
    const change = ((input.new - input.old) / input.old) * 100;
    return {
      change: Number(change.toFixed(2)),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
      formatted: `${change > 0 ? '+' : ''}${change.toFixed(2)}%`,
    };
  },
};

export const detectTrend: Skill = {
  id: 'detect-trend',
  name: 'Detect Price Trend',
  description: 'Analyze array of prices to detect trend',
  category: 'analysis',
  execute: async (input: { prices: number[] }) => {
    if (input.prices.length < 2) return { trend: 'insufficient data' };
    const first = input.prices.slice(0, Math.floor(input.prices.length / 2));
    const second = input.prices.slice(Math.floor(input.prices.length / 2));
    const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
    const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;
    const trend = avgSecond > avgFirst * 1.01 ? 'bullish' : avgSecond < avgFirst * 0.99 ? 'bearish' : 'sideways';
    return { trend, avgFirst, avgSecond };
  },
};

// === COMMUNICATION SKILLS ===
export const formatEmoji: Skill = {
  id: 'format-emoji',
  name: 'Add Contextual Emojis',
  description: 'Add relevant emojis to text',
  category: 'communication',
  execute: async (input: { text: string; sentiment?: string }) => {
    const emojiMap: Record<string, string> = {
      bullish: '📈🚀💹',
      bearish: '📉⚠️',
      neutral: '📊',
      profit: '💰✅',
      loss: '🔴❌',
      tip: '💡',
      warning: '⚠️🚨',
      learn: '📚🎓',
    };
    const emojis = emojiMap[input.sentiment || 'neutral'] || '📌';
    return `${emojis.charAt(0)} ${input.text}`;
  },
};

export const personalizeGreeting: Skill = {
  id: 'personalize-greeting',
  name: 'Personalize Greeting',
  description: 'Generate time-appropriate greeting',
  category: 'communication',
  execute: async (input: { name?: string }) => {
    const hour = new Date().getHours();
    let greeting = 'Hello';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    return input.name ? `${greeting}, ${input.name}!` : `${greeting}!`;
  },
};

// === DESIGN SKILLS ===
export const generateGradient: Skill = {
  id: 'generate-gradient',
  name: 'Generate CSS Gradient',
  description: 'Create gradient from colors',
  category: 'design',
  execute: async (input: { colors: string[]; direction?: string }) => {
    const dir = input.direction || 'to right';
    return `linear-gradient(${dir}, ${input.colors.join(', ')})`;
  },
};

export const contrastCheck: Skill = {
  id: 'contrast-check',
  name: 'Check Color Contrast',
  description: 'Verify if colors have sufficient contrast',
  category: 'design',
  execute: async (input: { foreground: string; background: string }) => {
    // Simplified contrast check
    const isLight = (hex: string) => {
      const c = hex.replace('#', '');
      const r = parseInt(c.substr(0, 2), 16);
      const g = parseInt(c.substr(2, 2), 16);
      const b = parseInt(c.substr(4, 2), 16);
      return (r * 299 + g * 587 + b * 114) / 1000 > 128;
    };
    const fgLight = isLight(input.foreground);
    const bgLight = isLight(input.background);
    return { sufficient: fgLight !== bgLight, suggestion: fgLight === bgLight ? 'Consider using contrasting colors' : 'Good contrast' };
  },
};

// All skills registry
export const ALL_SKILLS: Skill[] = [
  writeThread, summarize, formatPrice,
  calculateChange, detectTrend,
  formatEmoji, personalizeGreeting,
  generateGradient, contrastCheck,
];

export function getSkill(id: string): Skill | undefined {
  return ALL_SKILLS.find(s => s.id === id);
}

export function getSkillsByCategory(category: Skill['category']): Skill[] {
  return ALL_SKILLS.filter(s => s.category === category);
}
