import { NextRequest, NextResponse } from 'next/server';
import { runScoutAgent, getLatestInsights } from '../../../../agents/scout/agent';

const AGENT_SECRET = process.env.AGENT_SECRET || 'paperpe-social-2026';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log('[Scout API] Running full scan...');
    const report = await runScoutAgent();
    
    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Scout agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const insights = await getLatestInsights();
    return NextResponse.json(insights);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
