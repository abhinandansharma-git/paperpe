import { 
  PAPERPE_PALETTE, PALETTES, COMPONENTS, LAYOUTS,
  ColorPalette, ComponentStyle, LayoutSuggestion,
  getPalette, getComponent, getLayout
} from './design';

export interface DesignReview {
  score: number;
  feedback: string[];
  suggestions: string[];
}

export interface UIGeneratorResult {
  component: string;
  description: string;
  html: string;
  css: string;
  tailwind: string;
}

// UI/UX Best Practices
const UX_PRINCIPLES = [
  { rule: 'Contrast ratio should be at least 4.5:1 for text', category: 'accessibility' },
  { rule: 'Touch targets should be at least 44x44px on mobile', category: 'mobile' },
  { rule: 'Use consistent spacing (8px grid system)', category: 'layout' },
  { rule: 'Limit color palette to 3-5 main colors', category: 'color' },
  { rule: 'Typography hierarchy: max 3 font sizes per view', category: 'typography' },
  { rule: 'Loading states for all async actions', category: 'feedback' },
  { rule: 'Error messages should be helpful and actionable', category: 'feedback' },
  { rule: 'Primary CTA should be visually prominent', category: 'hierarchy' },
];

export async function runVisualAgent(task: string): Promise<any> {
  console.log(`[Visual Agent] Task: ${task}`);
  
  const lowerTask = task.toLowerCase();
  
  // Generate color palette
  if (lowerTask.includes('color') || lowerTask.includes('palette')) {
    return {
      type: 'palette',
      primary: PAPERPE_PALETTE,
      alternatives: PALETTES.filter(p => p.name !== PAPERPE_PALETTE.name),
      tip: 'Use primary orange (#F97316) for CTAs, green for profits, red for losses',
    };
  }
  
  // Generate component
  if (lowerTask.includes('button') || lowerTask.includes('card') || lowerTask.includes('input')) {
    const componentName = lowerTask.includes('button') ? 'button' : 
                          lowerTask.includes('card') ? 'card' : 'input';
    const component = getComponent(componentName);
    return {
      type: 'component',
      component,
      allComponents: COMPONENTS,
    };
  }
  
  // Suggest layout
  if (lowerTask.includes('layout') || lowerTask.includes('dashboard') || lowerTask.includes('page')) {
    const layoutType = lowerTask.includes('dashboard') ? 'dashboard' :
                       lowerTask.includes('trading') ? 'trading' :
                       lowerTask.includes('landing') ? 'landing' : 'mobile';
    const layout = getLayout(layoutType);
    return {
      type: 'layout',
      suggested: layout,
      allLayouts: LAYOUTS,
    };
  }
  
  // Review design
  if (lowerTask.includes('review') || lowerTask.includes('feedback')) {
    return {
      type: 'review',
      principles: UX_PRINCIPLES,
      checklist: [
        'Is the primary action clear?',
        'Is there enough contrast for readability?',
        'Are interactive elements easily tappable on mobile?',
        'Is the loading state handled?',
        'Are error states designed?',
        'Is the spacing consistent (8px grid)?',
      ],
    };
  }
  
  // Default: return design system overview
  return {
    type: 'overview',
    palette: PAPERPE_PALETTE,
    componentCount: COMPONENTS.length,
    layoutCount: LAYOUTS.length,
    components: COMPONENTS.map(c => c.name),
    layouts: LAYOUTS.map(l => l.name),
    tip: 'Ask me about colors, components, layouts, or design review!',
  };
}

export function generateCSS(componentName: string): string {
  const component = getComponent(componentName);
  if (!component) return '';
  
  return `.${componentName.toLowerCase().replace(/\s/g, '-')} {\n  ${component.css.split(';').join(';\n  ')}\n}`;
}

export function generateTailwind(componentName: string): string {
  const component = getComponent(componentName);
  return component?.tailwind || '';
}

export function reviewDesign(description: string): DesignReview {
  const feedback: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  const lower = description.toLowerCase();
  
  // Check for common issues
  if (!lower.includes('mobile') && !lower.includes('responsive')) {
    feedback.push('Consider mobile responsiveness');
    suggestions.push('Add responsive breakpoints for mobile users');
    score -= 10;
  }
  
  if (!lower.includes('loading') && !lower.includes('skeleton')) {
    feedback.push('No loading state mentioned');
    suggestions.push('Add loading skeletons or spinners for async content');
    score -= 5;
  }
  
  if (!lower.includes('error') && !lower.includes('validation')) {
    feedback.push('Error handling not mentioned');
    suggestions.push('Design error states and validation messages');
    score -= 5;
  }
  
  if (score === 100) {
    feedback.push('Design looks comprehensive!');
  }
  
  return { score, feedback, suggestions };
}
