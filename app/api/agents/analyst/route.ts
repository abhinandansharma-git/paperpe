import { NextRequest, NextResponse } from 'next/server';
import { runAnalystAgent, getQuickLevels } from '../../../../agents/analyst/agent';

const AGENT_SECRET = process.env.AGENT_SECRET || 'paperpe-social-2026';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[Analyst API] Running daily analysis...');
    const analysis = await runAnalystAgent();
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Analyst agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Public endpoint for quick levels
    const levels = getQuickLevels();
    return NextResponse.json({
      status: 'Analyst Agent Active',
      quickLevels: levels,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
