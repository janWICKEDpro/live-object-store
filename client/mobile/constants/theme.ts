/**
 * Design system tokens based on design.json
 */

export const Colors = {
  light: {
    primary: '#F05A28',
    primaryLight: '#FEF2EE',
    primaryForeground: '#FFFFFF',

    background: '#FAFAFA',
    surface: '#FFFFFF',

    text: '#171717',
    textSecondary: '#525252',
    muted: '#737373',
    mutedForeground: '#A3A3A3',

    border: '#E5E5E5',
    borderLight: '#F0F0F0',

    error: '#EF4444',
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#3B82F6',

    tint: '#F05A28',
    tabIconDefault: '#737373',
    tabIconSelected: '#F05A28',
  },
  dark: {
    // Basic dark mode mapping (can be refined later)
    primary: '#F05A28',
    primaryLight: '#3A150A',
    primaryForeground: '#FFFFFF',

    background: '#09090b',
    surface: '#18181b',

    text: '#FAFAFA',
    textSecondary: '#A1A1AA',
    muted: '#71717A',
    mutedForeground: '#52525B',

    border: '#27272A',
    borderLight: '#3F3F46',

    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    info: '#2563EB',

    tint: '#F05A28',
    tabIconDefault: '#71717A',
    tabIconSelected: '#F05A28',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  section: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const Typography = {
  sizes: {
    xs: 12,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
    title: 24,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
};
