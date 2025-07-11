/**
 * Design System Compatibility Layer
 * Provides backwards compatibility with the old designSystem.ts structure
 * while using the new organized design system
 */

import { cn } from './utils';
import { tw, componentVariants } from '../design-system';

// Backwards compatible designSystem object
export const designSystem = {
  // Colors - mapped to new tailwind utilities
  colors: {
    primary: tw.bg.primaryColors,
    text: tw.text,
    bg: tw.bg,
    border: tw.border,
  },

  // Typography - mapped to new structure
  typography: tw.typography,

  // Spacing - mapped to new structure
  spacing: tw.spacing,

  // Layout - mapped to new structure
  layout: tw.layout,

  // Effects - mapped to new structure
  effects: tw.effects,

  // States - mapped to new structure
  states: tw.states,

  // Responsive - mapped to new structure
  responsive: tw.responsive,

  // Interactive - mapped to new structure
  interactive: tw.interactive,
};

// Export component variants for backwards compatibility
export { componentVariants };

// Export the new design system exports
export * from '../design-system';

// Keep cn utility for backwards compatibility
export { cn };

// Legacy support
export default designSystem;
