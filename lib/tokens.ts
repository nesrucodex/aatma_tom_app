/**
 * Design tokens — mirrors tailwind.config.js colors.
 * Use these when you need a raw hex value (e.g. icon color props).
 *
 * For className usage just use the Tailwind classes directly:
 *   text-primary, bg-destructive, border-warning, etc.
 */
export const colors = {
  primary:     { DEFAULT: '#1d4ed8', foreground: '#ffffff', light: '#eff6ff', muted: '#bfdbfe' },
  secondary:   { DEFAULT: '#64748b', foreground: '#ffffff', light: '#f8fafc', muted: '#e2e8f0' },
  accent:      { DEFAULT: '#7c3aed', foreground: '#ffffff', light: '#f5f3ff', muted: '#ddd6fe' },
  destructive: { DEFAULT: '#dc2626', foreground: '#ffffff', light: '#fef2f2', muted: '#fecaca' },
  success:     { DEFAULT: '#16a34a', foreground: '#ffffff', light: '#f0fdf4', muted: '#bbf7d0' },
  warning:     { DEFAULT: '#d97706', foreground: '#ffffff', light: '#fffbeb', muted: '#fde68a' },
  info:        { DEFAULT: '#0284c7', foreground: '#ffffff', light: '#f0f9ff', muted: '#bae6fd' },

  background: '#ffffff',
  surface:    '#f8fafc',
  border:     '#e2e8f0',
  input:      '#f1f5f9',
  ring:       '#1d4ed8',

  foreground:        '#0f172a',
  mutedForeground:   '#64748b',
} as const;

export type ColorToken = keyof typeof colors;
