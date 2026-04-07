/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './lib/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        // Brand — blue-based primary
        primary: {
          DEFAULT: '#1d4ed8', // blue-700
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          foreground: '#ffffff',
        },

        // Secondary — neutral slate
        secondary: {
          DEFAULT: '#64748b', // slate-500
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          foreground: '#ffffff',
        },

        // Accent — violet
        accent: {
          DEFAULT: '#7c3aed', // violet-600
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          foreground: '#ffffff',
        },

        // Destructive — red
        destructive: {
          DEFAULT: '#dc2626', // red-600
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          foreground: '#ffffff',
        },

        // Success — green
        success: {
          DEFAULT: '#16a34a', // green-600
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          foreground: '#ffffff',
        },

        // Warning — amber
        warning: {
          DEFAULT: '#d97706', // amber-600
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          foreground: '#ffffff',
        },

        // Info — sky
        info: {
          DEFAULT: '#0284c7', // sky-600
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          foreground: '#ffffff',
        },

        // Surface / background tokens
        background: '#ffffff',
        surface:    '#f8fafc', // slightly off-white card bg
        border:     '#e2e8f0',
        input:      '#f1f5f9',
        ring:       '#1d4ed8',

        // Text tokens
        foreground:       '#0f172a', // near-black
        'muted-foreground': '#64748b',
      },
    },
  },

  plugins: [],
};
