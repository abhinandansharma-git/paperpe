// Agent Registry with Skills Assignment

import { Skill, getSkill, ALL_SKILLS } from './index';

export interface AgentProfile {
  id: string;
  name: string;
  emoji: string;
  role: string;
  description: string;
  skills: string[];
  personality: string;
  catchphrase: string;
}

export const AGENTS: AgentProfile[] = [
  {
    id: 'social',
    name: 'Tweety',
    emoji: '🐦',
    role: 'Social Media Manager',
    description: 'Handles all Twitter activity for @paperpe_in',
    skills: ['write-thread', 'format-emoji', 'summarize'],
    personality: 'Engaging, witty, hashtag-savvy',
    catchphrase: 'Let me tweet that for you! 🚀',
  },
  {
    id: 'scout',
    name: 'Hunter',
    emoji: '🔍',
    role: 'News & Intelligence',
    description: 'Scans markets for news and opportunities',
    skills: ['summarize', 'detect-trend', 'format-emoji'],
    personality: 'Alert, analytical, always watching',
    catchphrase: 'I found something interesting...',
  },
  {
    id: 'guru',
    name: 'Sage',
    emoji: '📚',
    role: 'Education Specialist',
    description: 'Creates trading education content',
    skills: ['write-thread', 'summarize', 'personalize-greeting'],
    personality: 'Patient, knowledgeable, encouraging',
    catchphrase: 'Here\'s what you need to know...',
  },
  {
    id: 'analyst',
    name: 'Quant',
    emoji: '📊',
    role: 'Market Analyst',
    description: 'Provides daily market insights and levels',
    skills: ['calc-change', 'detect-trend', 'format-price', 'format-emoji'],
    personality: 'Data-driven, precise, insightful',
    catchphrase: 'The numbers say...',
  },
  {
    id: 'support',
    name: 'Helper',
    emoji: '💬',
    role: 'Customer Support',
    description: 'Answers user questions from knowledge base',
    skills: ['personalize-greeting', 'summarize'],
    personality: 'Friendly, helpful, patient',
    catchphrase: 'How can I help you today?',
  },
  {
    id: 'qc',
    name: 'Checker',
    emoji: '✓',
    role: 'Quality Control',
    description: 'Reviews all content before publishing',
    skills: ['contrast-check', 'summarize'],
    personality: 'Meticulous, thorough, fair',
    catchphrase: 'Let me check that first...',
  },
  {
    id: 'visual',
    name: 'Designer',
    emoji: '🎨',
    role: 'UI/UX Designer',
    description: 'Creates visual designs and reviews UI',
    skills: ['generate-gradient', 'contrast-check'],
    personality: 'Creative, aesthetic, detail-oriented',
    catchphrase: 'This would look better if...',
  },
];

export function getAgent(id: string): AgentProfile | undefined {
  return AGENTS.find(a => a.id === id);
}

export function getAgentSkills(agentId: string): Skill[] {
  const agent = getAgent(agentId);
  if (!agent) return [];
  return agent.skills.map(sid => getSkill(sid)).filter((s): s is Skill => s !== undefined);
}

export async function executeAgentSkill(agentId: string, skillId: string, input: any): Promise<any> {
  const agent = getAgent(agentId);
  if (!agent) throw new Error(`Agent ${agentId} not found`);
  
  if (!agent.skills.includes(skillId)) {
    throw new Error(`Agent ${agent.name} doesn\'t have skill ${skillId}`);
  }
  
  const skill = getSkill(skillId);
  if (!skill) throw new Error(`Skill ${skillId} not found`);
  
  console.log(`[${agent.name}] Using skill: ${skill.name}`);
  return skill.execute(input);
}

export function getAllAgents(): AgentProfile[] {
  return AGENTS;
}

export function getAgentsBySkill(skillId: string): AgentProfile[] {
  return AGENTS.filter(a => a.skills.includes(skillId));
}
