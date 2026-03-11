import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.TWITTER_CONSUMER_KEY!,
  appSecret: process.env.TWITTER_CONSUMER_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
});

export const twitter = client.readWrite;

export async function postTweet(text: string) {
  try {
    const result = await twitter.v2.tweet(text);
    console.log('Tweet posted:', result.data.id);
    return { success: true, id: result.data.id };
  } catch (error: any) {
    console.error('Tweet failed:', error.message);
    return { success: false, error: error.message };
  }
}

export async function postThread(tweets: string[]) {
  try {
    let lastTweetId: string | undefined;
    const results = [];
    
    for (const text of tweets) {
      const result = await twitter.v2.tweet(text, {
        reply: lastTweetId ? { in_reply_to_tweet_id: lastTweetId } : undefined,
      });
      lastTweetId = result.data.id;
      results.push(result.data.id);
    }
    
    return { success: true, ids: results };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
