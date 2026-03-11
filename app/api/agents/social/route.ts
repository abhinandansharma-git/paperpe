import { NextRequest, NextResponse } from 'next/server';
import { postTweet } from '../../../../agents/social/twitter';
import { generateTweet } from '../../../../agents/social/content';

const AGENT_SECRET = process.env.AGENT_SECRET || 'paperpe-social-2026';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json().catch(() => ({}));
    const tweetType = body.type || 'marketTip';
    
    const tweet = generateTweet(tweetType);
    console.log(`[Social Agent] Generated ${tweetType}:`, tweet);
    
    const result = await postTweet(tweet);
    
    return NextResponse.json({
      success: result.success,
      type: tweetType,
      tweet,
      tweetId: result.success ? result.id : null,
      error: result.success ? null : result.error,
    });
  } catch (error: any) {
    console.error('Social agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${AGENT_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    status: 'Social Agent Active',
    endpoints: {
      POST: 'Trigger tweet (body: { type: marketTip|lesson|motivation|engagement })'
    }
  });
}
