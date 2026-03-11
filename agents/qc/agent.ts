import { 
  QCResult, QCCheck,
  checkLength, checkBlockedWords, checkDisclaimer, 
  checkGrammar, checkEmoji, checkHashtags 
} from './rules';

export type ContentType = 'tweet' | 'article' | 'response' | 'analysis';

export async function runQCAgent(content: string, contentType: ContentType): Promise<QCResult> {
  console.log(`[QC Agent] Checking ${contentType}: ${content.slice(0, 50)}...`);
  
  const checks: QCCheck[] = [];
  
  // Run all checks
  checks.push(checkLength(content, contentType));
  checks.push(checkBlockedWords(content));
  checks.push(checkDisclaimer(content, contentType === 'tweet' || contentType === 'analysis'));
  checks.push(checkGrammar(content));
  checks.push(checkEmoji(content, contentType));
  checks.push(checkHashtags(content, contentType));
  
  // Calculate score
  const errorCount = checks.filter(c => !c.passed && c.severity === 'error').length;
  const warningCount = checks.filter(c => !c.passed && c.severity === 'warning').length;
  
  let score = 100;
  score -= errorCount * 25;
  score -= warningCount * 10;
  score = Math.max(0, score);
  
  // Generate suggestions
  const suggestions: string[] = [];
  checks.forEach(check => {
    if (!check.passed) {
      if (check.name === 'Length Check') suggestions.push('Adjust content length');
      if (check.name === 'Content Policy') suggestions.push('Remove blocked words');
      if (check.name === 'Disclaimer') suggestions.push('Add disclaimer about paper trading');
      if (check.name === 'Grammar') suggestions.push('Fix grammar issues');
      if (check.name === 'Hashtags') suggestions.push('Optimize hashtag count');
    }
  });
  
  const result: QCResult = {
    content,
    contentType,
    passed: errorCount === 0,
    score,
    checks,
    suggestions,
    timestamp: new Date().toISOString(),
  };
  
  console.log(`[QC Agent] Score: ${score}/100, Passed: ${result.passed}`);
  
  return result;
}

export function getQCStats(results: QCResult[]): {
  totalChecked: number;
  passRate: number;
  avgScore: number;
  commonIssues: string[];
} {
  if (results.length === 0) {
    return { totalChecked: 0, passRate: 0, avgScore: 0, commonIssues: [] };
  }
  
  const passed = results.filter(r => r.passed).length;
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
  
  // Find common issues
  const issueCount: Record<string, number> = {};
  results.forEach(r => {
    r.checks.filter(c => !c.passed).forEach(c => {
      issueCount[c.name] = (issueCount[c.name] || 0) + 1;
    });
  });
  
  const commonIssues = Object.entries(issueCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
  
  return {
    totalChecked: results.length,
    passRate: Math.round((passed / results.length) * 100),
    avgScore: Math.round(avgScore),
    commonIssues,
  };
}
