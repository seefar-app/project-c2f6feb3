const tintColorLight = '#9333ea';
const tintColorDark = '#c084fc';

export const Colors = {
  light: {
    text: '#1e293b',
    textSecondary: '#64748b',
    background: '#f8fafc',
    backgroundSecondary: '#f1f5f9',
    tint: tintColorLight,
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    border: '#e2e8f0',
    card: '#ffffff',
    primary: '#9333ea',
    primaryLight: '#c084fc',
    secondary: '#fae8ff',
    accent: '#22d3ee',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    tint: tintColorDark,
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    border: '#334155',
    card: '#1e293b',
    primary: '#a855f7',
    primaryLight: '#c084fc',
    secondary: '#3b0764',
    accent: '#22d3ee',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  gradient: {
    primary: ['#9333ea', '#c026d3', '#7c3aed'] as const,
    hero: ['#9333ea', '#7c3aed', '#4f46e5'] as const,
    card: ['#9333ea', '#c026d3'] as const,
    dark: ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.8)', 'rgba(15, 23, 42, 1)'] as const,
  },
};

export type ColorScheme = 'light' | 'dark';

export const getColors = (scheme: ColorScheme) => Colors[scheme];