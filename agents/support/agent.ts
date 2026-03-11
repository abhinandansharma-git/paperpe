import { findAnswer, getAllFAQs, getFAQsByCategory, FAQ } from './knowledge';

export interface SupportResponse {
  query: string;
  answered: boolean;
  answer: string;
  faqId: string | null;
  category: string | null;
  confidence: 'high' | 'medium' | 'low';
  suggestedFAQs: FAQ[];
  timestamp: string;
}

const FALLBACK_RESPONSES = [
  "I couldn't find a specific answer to your question. Please email us at support@paperpe.in and we'll help you out!",
  "Hmm, I'm not sure about that. Try checking our FAQ section or reach out to support@paperpe.in for help.",
  "I don't have an answer for that yet. Our team at support@paperpe.in would be happy to assist you!",
];

const GREETING_PATTERNS = ['hi', 'hello', 'hey', 'good morning', 'good evening'];
const THANKS_PATTERNS = ['thank', 'thanks', 'thx', 'appreciate'];

export async function runSupportAgent(query: string): Promise<SupportResponse> {
  console.log(`[Support Agent] Processing query: ${query}`);
  
  const lowerQuery = query.toLowerCase().trim();
  
  // Handle greetings
  if (GREETING_PATTERNS.some(g => lowerQuery.includes(g))) {
    return {
      query,
      answered: true,
      answer: 'Hello! 👋 Welcome to PaperPe support. How can I help you today? You can ask about trading, your account, or our features.',
      faqId: null,
      category: null,
      confidence: 'high',
      suggestedFAQs: getAllFAQs().slice(0, 3),
      timestamp: new Date().toISOString(),
    };
  }
  
  // Handle thanks
  if (THANKS_PATTERNS.some(t => lowerQuery.includes(t))) {
    return {
      query,
      answered: true,
      answer: 'You\'re welcome! 😊 Happy trading! If you have more questions, I\'m here to help.',
      faqId: null,
      category: null,
      confidence: 'high',
      suggestedFAQs: [],
      timestamp: new Date().toISOString(),
    };
  }
  
  // Find answer from knowledge base
  const faq = findAnswer(query);
  
  if (faq) {
    // Get related FAQs from same category
    const related = getFAQsByCategory(faq.category)
      .filter(f => f.id !== faq.id)
      .slice(0, 2);
    
    return {
      query,
      answered: true,
      answer: faq.answer,
      faqId: faq.id,
      category: faq.category,
      confidence: 'high',
      suggestedFAQs: related,
      timestamp: new Date().toISOString(),
    };
  }
  
  // No match found - return fallback
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  
  return {
    query,
    answered: false,
    answer: fallback,
    faqId: null,
    category: null,
    confidence: 'low',
    suggestedFAQs: getAllFAQs().slice(0, 3),
    timestamp: new Date().toISOString(),
  };
}

export function getPopularQuestions(): FAQ[] {
  return getAllFAQs().slice(0, 5);
}

export function getCategories(): string[] {
  return ['general', 'trading', 'account', 'technical', 'pricing'];
}
