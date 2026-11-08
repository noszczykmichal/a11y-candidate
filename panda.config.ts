import { defineConfig, defineSemanticTokens, defineTextStyles } from '@pandacss/dev';

/**
 * Self-contained Panda setup for the Championship Day exercise.
 * Every token below is a small, purpose-built set that reproduces the exact
 * visual values this app uses — nothing more. There is no dependency on an
 * external design system: this file is the single source of truth for styling.
 */

const inter = 'Inter, ui-sans-serif, system-ui, sans-serif';

const sv = (light: string, dark: string) => ({ value: { _light: light, _dark: dark } });

const colors = defineSemanticTokens.colors({
  surface: {
    base: sv('#ffffff', '#161923'),
    base_alt: sv('#f5f6f9', '#282d3a'),
    subtle: sv('#eff0f3', '#3d4251'),
    elevated: sv('#e2e3e8', '#3d4251'),
    brand: sv('#5329ff', '#6e49ff'),
    scrim: sv('rgba(22, 25, 35, 0.6)', 'rgba(22, 25, 35, 0.6)'),
  },
  border: {
    primary: sv('#d7d9de', '#5f6573'),
    secondary: sv('rgba(215, 217, 225, 0.4)', 'rgba(183, 185, 198, 0.4)'),
    brand: sv('#5329ff', '#6e49ff'),
    selected: sv('#5329ff', '#6e49ff'),
  },
  feedback: {
    success: { bg: sv('#d6f1e8', '#282d3a') },
    error: { bg: sv('#fde2e7', '#282d3a') },
  },
  focus: {
    default: sv('#0078d0', '#72baef'),
  },
  action: {
    brand_hover: sv('#6e49ff', '#a18afc'),
  },
  graphics: {
    brand: sv('#5329ff', '#6e49ff'),
    primary_text: sv('#161923', '#ffffff'),
  },
  text: {
    primary: sv('#161923', '#ffffff'),
    secondary: sv('#5f6573', '#b3b5bd'),
    on_brand: sv('#ffffff', '#ffffff'),
    link_hover: sv('#5329ff', '#6e49ff'),
    selected: sv('#5329ff', '#6e49ff'),
  },
});

const radii = defineSemanticTokens.radii({
  md: { value: '0.5rem' },
  lg: { value: '0.75rem' },
  full: { value: '62.4375rem' },
});

const borderWidths = defineSemanticTokens.borderWidths({
  xs: { value: '1px' },
  sm: { value: '0.125rem' },
});

const textStyles = defineTextStyles({
  h_large: {
    value: {
      fontFamily: inter,
      fontSize: '1.125rem',
      fontWeight: '700',
      letterSpacing: '0',
      lineHeight: '1.375rem',
    },
  },
  h_small: {
    value: {
      fontFamily: inter,
      fontSize: '0.875rem',
      fontWeight: '700',
      letterSpacing: '0',
      lineHeight: '1rem',
    },
  },
  t_medium: {
    value: {
      fontFamily: inter,
      fontSize: '1rem',
      fontWeight: '500',
      letterSpacing: '0',
      lineHeight: '1.5rem',
    },
  },
  t_small: {
    value: {
      fontFamily: inter,
      fontSize: '0.875rem',
      fontWeight: '500',
      letterSpacing: '0',
      lineHeight: '1.375rem',
    },
  },
  t_small_b: {
    value: {
      fontFamily: inter,
      fontSize: '0.875rem',
      fontWeight: '700',
      letterSpacing: '0',
      lineHeight: '1.375rem',
    },
  },
});

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,tsx}'],
  exclude: ['./src/**/*.test.ts', './src/**/*.test.tsx'],
  outdir: '.panda',
  jsxFramework: 'react',
  importMap: 'styled-system',
  theme: {
    breakpoints: {
      md: '64rem',
    },
    extend: {
      tokens: {
        spacing: {
          '0': { value: '0' },
          '1': { value: '0.25rem' },
          '2': { value: '0.5rem' },
          '3': { value: '0.75rem' },
          '4': { value: '1rem' },
          '5': { value: '1.25rem' },
          '6': { value: '1.5rem' },
          '8': { value: '2rem' },
          '10': { value: '2.5rem' },
        },
        sizes: {
          '5': { value: '1.25rem' },
          '10': { value: '2.5rem' },
        },
      },
      semanticTokens: {
        colors,
        radii,
        borderWidths,
      },
      textStyles,
    },
  },
});
