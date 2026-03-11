import { NextRequest, NextResponse } from 'next/server';
import { ALL_SKILLS, getSkill, getSkillsByCategory } from '../../../../agents/skills';
import { AGENTS, getAgent, getAgentSkills, executeAgentSkill } from '../../../../agents/skills/registry';

const AGENT_SECRET = process.env.AGENT_SECRET || 'paperpe-social-2026';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${AGENT_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { agentId, skillId, input } = body;
    
    if (!agentId || !skillId) {
      return NextResponse.json({ error: 'agentId and skillId required' }, { status: 400 });
    }
    
    const result = await executeAgentSkill(agentId, skillId, input || {});
    
    return NextResponse.json({
      agent: agentId,
      skill: skillId,
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Skills API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agent');
  const category = searchParams.get('category');
  
  // Get skills for specific agent
  if (agentId) {
    const agent = getAgent(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    const skills = getAgentSkills(agentId);
    return NextResponse.json({
      agent: {
        id: agent.id,
        name: agent.name,
        emoji: agent.emoji,
        role: agent.role,
        catchphrase: agent.catchphrase,
      },
      skills: skills.map(s => ({ id: s.id, name: s.name, description: s.description })),
    });
  }
  
  // Get skills by category
  if (category) {
    const skills = getSkillsByCategory(category as any);
    return NextResponse.json({ category, skills: skills.map(s => ({ id: s.id, name: s.name })) });
  }
  
  // Return full overview
  return NextResponse.json({
    agents: AGENTS.map(a => ({
      id: a.id,
      name: a.name,
      emoji: a.emoji,
      role: a.role,
      skillCount: a.skills.length,
      catchphrase: a.catchphrase,
    })),
    skills: ALL_SKILLS.map(s => ({ id: s.id, name: s.name, category: s.category })),
    totalAgents: AGENTS.length,
    totalSkills: ALL_SKILLS.length,
  });
}
