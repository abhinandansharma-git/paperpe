import { NextRequest, NextResponse } from 'next/server';
import { runVisualAgent, generateCSS, generateTailwind, reviewDesign } from '../../../../agents/visual/agent';
import { PAPERPE_PALETTE, COMPONENTS, LAYOUTS } from '../../../../agents/visual/design';

const AGENT_SECRET = process.env.AGENT_SECRET;
if (!AGENT_SECRET) throw new Error('AGENT_SECRET not configured');

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { task, component, description } = body;
    
    // Generate CSS for specific component
    if (component && body.format === 'css') {
      return NextResponse.json({ css: generateCSS(component) });
    }
    
    // Generate Tailwind for specific component
    if (component && body.format === 'tailwind') {
      return NextResponse.json({ tailwind: generateTailwind(component) });
    }
    
    // Review a design description
    if (description) {
      return NextResponse.json(reviewDesign(description));
    }
    
    // Run general task
    if (task) {
      const result = await runVisualAgent(task);
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Provide task, component, or description' }, { status: 400 });
  } catch (error: any) {
    console.error('Visual agent error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Public endpoint for design system
  return NextResponse.json({
    status: 'Visual Agent Active',
    designSystem: {
      palette: PAPERPE_PALETTE,
      components: COMPONENTS.map(c => ({ name: c.name, description: c.description })),
      layouts: LAYOUTS.map(l => ({ name: l.name, bestFor: l.bestFor })),
    },
    capabilities: ['colors', 'components', 'layouts', 'review'],
  });
}
