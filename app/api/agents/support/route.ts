import { NextRequest, NextResponse } from 'next/server';
import { runSupportAgent, getPopularQuestions, getCategories } from '../../../../agents/support/agent';
import { getAllFAQs, getFAQsByCategory } from '../../../../agents/support/knowledge';

const AGENT_SECRET = process.env.AGENT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!AGENT_SECRET || authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const query = body.query || body.message || body.q;
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }
    
    console.log('[Support API] Processing:', query);
    const response = await runSupportAgent(query);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Support agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (category) {
      const faqs = getFAQsByCategory(category as any);
      return NextResponse.json({ category, faqs });
    }
    
    // Return overview
    return NextResponse.json({
      status: 'Support Agent Active',
      categories: getCategories(),
      popularQuestions: getPopularQuestions(),
      totalFAQs: getAllFAQs().length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
