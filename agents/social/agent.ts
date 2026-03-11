import { postTweet } from './twitter';
import { generateTweet, TWEET_TEMPLATES } from './content';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export type TweetType = keyof typeof TWEET_TEMPLATES;

interface PostHistory {
  id: string;
  tweet_text: string;
  tweet_type: string;
  tweet_id: string | null;
  posted_at: string;
  success: boolean;
}

export async function runSocialAgent(tweetType?: TweetType) {
  const type = tweetType || getScheduledType();
  const tweet = generateTweet(type);
  
  console.log(`[Social Agent] Generating ${type} tweet...`);
  console.log(`[Social Agent] Content: ${tweet}`);
  
  // Check if we posted recently (within 2 hours)
  const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from('social_posts')
    .select('*')
    .gte('posted_at', twoHoursAgo)
    .limit(1);
  
  if (recent && recent.length > 0) {
    console.log('[Social Agent] Posted recently, skipping...');
    return { skipped: true, reason: 'Posted within last 2 hours' };
  }
  
  // Post the tweet
  const result = await postTweet(tweet);
  
  // Log to database
  await supabase.from('social_posts').insert({
    tweet_text: tweet,
    tweet_type: type,
    tweet_id: result.success ? result.id : null,
    success: result.success,
    posted_at: new Date().toISOString(),
  });
  
  return {
    success: result.success,
    type,
    tweet,
    tweetId: result.success ? result.id : null,
    error: result.success ? null : result.error,
  };
}

function getScheduledType(): TweetType {
  const hour = new Date().getHours();
  
  // Morning (9 AM) - Educational
  if (hour >= 8 && hour < 11) return 'lesson';
  
  // Midday (12 PM) - Tips
  if (hour >= 11 && hour < 14) return 'marketTip';
  
  // Afternoon (3 PM) - Engagement
  if (hour >= 14 && hour < 17) return 'engagement';
  
  // Evening (6 PM) - Motivation
  if (hour >= 17 && hour < 20) return 'motivation';
  
  // Default
  return 'marketTip';
}

export async function getPostHistory(limit = 10): Promise<PostHistory[]> {
  const { data } = await supabase
    .from('social_posts')
    .select('*')
    .order('posted_at', { ascending: false })
    .limit(limit);
  
  return data || [];
}
