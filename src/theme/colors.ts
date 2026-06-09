export const Colors = {
  light: {
    background: '#f9fafb',
    surface: '#ffffff',
    surfaceSecondary: '#f3f4f6',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    accent: '#3b82f6',
    danger: '#ef4444',
    dangerBorder: '#fecaca',
    headerBackground: '#ffffff',
    tabBarBackground: '#ffffff',
    tabBarActiveTint: '#3b82f6',
    tabBarInactiveTint: '#9ca3af',
  },
  dark: {
    background: '#0f172a',
    surface: '#1e293b',
    surfaceSecondary: '#0f172a',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    accent: '#60a5fa',
    danger: '#f87171',
    dangerBorder: '#7f1d1d',
    headerBackground: '#1e293b',
    tabBarBackground: '#1e293b',
    tabBarActiveTint: '#60a5fa',
    tabBarInactiveTint: '#64748b',
  },
} as const;

export type ThemeColors = { readonly [K in keyof typeof Colors.light]: string };
