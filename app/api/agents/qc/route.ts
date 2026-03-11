import { NextRequest, NextResponse } from 'next/server';
import { runQCAgent, ContentType } from '../../../../agents/qc/agent';

const AGENT_SECRET = process.env.AGENT_SECRET || 'paperpe-social-2026';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { content, type } = body;
    
    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    
    const contentType: ContentType = type || 'tweet';
    
    console.log('[QC API] Checking content...');
    const result = await runQCAgent(content, contentType);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('QC agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${AGENT_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({
    status: 'QC Agent Active',
    contentTypes: ['tweet', 'article', 'response', 'analysis'],
    checks: ['Length', 'Content Policy', 'Disclaimer', 'Grammar', 'Emoji', 'Hashtags'],
  });
}
