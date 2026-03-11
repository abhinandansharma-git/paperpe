// Design system and UI/UX utilities

export interface ColorPalette {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  success: string;
  warning: string;
  error: string;
}

export interface ComponentStyle {
  name: string;
  description: string;
  css: string;
  tailwind: string;
}

export interface LayoutSuggestion {
  name: string;
  description: string;
  structure: string;
  bestFor: string[];
}

// PaperPe Brand Colors
export const PAPERPE_PALETTE: ColorPalette = {
  name: 'PaperPe Dark',
  primary: '#F97316',      // Orange
  secondary: '#2962ff',    // TradingView Blue
  accent: '#10b981',       // Green for profits
  background: '#0a0e17',   // Deep dark
  surface: '#131722',      // TradingView dark
  text: '#ffffff',
  textMuted: '#94a3b8',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
};

// Alternative palettes
export const PALETTES: ColorPalette[] = [
  PAPERPE_PALETTE,
  {
    name: 'Light Mode',
    primary: '#F97316',
    secondary: '#2962ff',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
  },
  {
    name: 'Midnight Blue',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
  },
];

// Common UI Components
export const COMPONENTS: ComponentStyle[] = [
  {
    name: 'Primary Button',
    description: 'Main call-to-action button',
    css: 'background: #F97316; color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600;',
    tailwind: 'bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors',
  },
  {
    name: 'Card',
    description: 'Content container with subtle border',
    css: 'background: #131722; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;',
    tailwind: 'bg-[#131722] border border-white/10 rounded-xl p-5',
  },
  {
    name: 'Input Field',
    description: 'Text input with dark theme',
    css: 'background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px 16px; color: white;',
    tailwind: 'bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-orange-500/50 focus:outline-none',
  },
  {
    name: 'Badge',
    description: 'Small status indicator',
    css: 'background: rgba(249,115,22,0.1); color: #F97316; padding: 4px 12px; border-radius: 9999px; font-size: 12px;',
    tailwind: 'bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs',
  },
  {
    name: 'Profit Text',
    description: 'Green text for positive values',
    css: 'color: #22c55e; font-weight: 600;',
    tailwind: 'text-green-500 font-semibold',
  },
  {
    name: 'Loss Text',
    description: 'Red text for negative values',
    css: 'color: #ef4444; font-weight: 600;',
    tailwind: 'text-red-500 font-semibold',
  },
];

// Layout patterns
export const LAYOUTS: LayoutSuggestion[] = [
  {
    name: 'Dashboard Grid',
    description: 'Multi-panel dashboard layout',
    structure: 'Header | Sidebar (left) | Main Content (grid of cards) | Footer',
    bestFor: ['dashboards', 'admin panels', 'analytics'],
  },
  {
    name: 'Trading Layout',
    description: 'TradingView-style layout',
    structure: 'Toolbar (top) | Sidebar (tools) | Chart (center) | Watchlist (right) | Orders (bottom)',
    bestFor: ['trading platforms', 'charts', 'real-time data'],
  },
  {
    name: 'Landing Page',
    description: 'Marketing page layout',
    structure: 'Hero | Features Grid | Social Proof | Pricing | CTA | Footer',
    bestFor: ['marketing', 'landing pages', 'product pages'],
  },
  {
    name: 'Mobile First',
    description: 'Single column responsive',
    structure: 'Header (sticky) | Content (scrollable) | Bottom Nav (fixed)',
    bestFor: ['mobile apps', 'responsive design', 'simple flows'],
  },
];

export function getPalette(name?: string): ColorPalette {
  if (name) {
    return PALETTES.find(p => p.name.toLowerCase().includes(name.toLowerCase())) || PAPERPE_PALETTE;
  }
  return PAPERPE_PALETTE;
}

export function getComponent(name: string): ComponentStyle | undefined {
  return COMPONENTS.find(c => c.name.toLowerCase().includes(name.toLowerCase()));
}

export function getLayout(type: string): LayoutSuggestion | undefined {
  return LAYOUTS.find(l => l.bestFor.some(b => b.includes(type.toLowerCase())));
}
