import { NextRequest, NextResponse } from 'next/server';
import { runGuruAgent, getAllCategories, getLessonCount } from '../../../../agents/guru/agent';
import { LESSONS, getLessonsByCategory, searchLessons } from '../../../../agents/guru/lessons';

const AGENT_SECRET = process.env.AGENT_SECRET;
if (!AGENT_SECRET) throw new Error('AGENT_SECRET not configured');

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json().catch(() => ({}));
    const category = body.category;
    
    console.log('[Guru API] Generating content...');
    const content = await runGuruAgent(category);
    
    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Guru agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    
    // Public endpoint for lessons
    if (query) {
      const results = searchLessons(query);
      return NextResponse.json({ lessons: results });
    }
    
    if (category) {
      const lessons = getLessonsByCategory(category as any);
      return NextResponse.json({ category, lessons });
    }
    
    // Return overview
    return NextResponse.json({
      categories: getAllCategories(),
      stats: getLessonCount(),
      sample: LESSONS.slice(0, 3).map(l => ({ id: l.id, title: l.title, category: l.category })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
