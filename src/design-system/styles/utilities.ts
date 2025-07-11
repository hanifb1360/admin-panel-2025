import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing, borderRadius, shadows } from '../tokens/spacing';
import { transitions } from '../tokens/layout';

// CSS-in-JS utility functions
export function createStyle(styleObject: Record<string, string | number>): string {
  return Object.entries(styleObject)
    .map(([key, value]) => {
      const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value};`;
    })
    .join(' ');
}

export function generateColorClasses() {
  const classes: Record<string, string> = {};
  
  // Text colors
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      classes[`text-${colorName}`] = `color: ${colorValue};`;
    } else {
      Object.entries(colorValue).forEach(([shade, hex]) => {
        classes[`text-${colorName}-${shade}`] = `color: ${hex};`;
      });
    }
  });

  // Background colors
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      classes[`bg-${colorName}`] = `background-color: ${colorValue};`;
    } else {
      Object.entries(colorValue).forEach(([shade, hex]) => {
        classes[`bg-${colorName}-${shade}`] = `background-color: ${hex};`;
      });
    }
  });

  // Border colors
  Object.entries(colors).forEach(([colorName, colorValue]) => {
    if (typeof colorValue === 'string') {
      classes[`border-${colorName}`] = `border-color: ${colorValue};`;
    } else {
      Object.entries(colorValue).forEach(([shade, hex]) => {
        classes[`border-${colorName}-${shade}`] = `border-color: ${hex};`;
      });
    }
  });

  return classes;
}

export function generateSpacingClasses() {
  const classes: Record<string, string> = {};
  
  Object.entries(spacing).forEach(([key, value]) => {
    // Padding
    classes[`p-${key}`] = `padding: ${value};`;
    classes[`pt-${key}`] = `padding-top: ${value};`;
    classes[`pr-${key}`] = `padding-right: ${value};`;
    classes[`pb-${key}`] = `padding-bottom: ${value};`;
    classes[`pl-${key}`] = `padding-left: ${value};`;
    classes[`px-${key}`] = `padding-left: ${value}; padding-right: ${value};`;
    classes[`py-${key}`] = `padding-top: ${value}; padding-bottom: ${value};`;
    
    // Margin
    classes[`m-${key}`] = `margin: ${value};`;
    classes[`mt-${key}`] = `margin-top: ${value};`;
    classes[`mr-${key}`] = `margin-right: ${value};`;
    classes[`mb-${key}`] = `margin-bottom: ${value};`;
    classes[`ml-${key}`] = `margin-left: ${value};`;
    classes[`mx-${key}`] = `margin-left: ${value}; margin-right: ${value};`;
    classes[`my-${key}`] = `margin-top: ${value}; margin-bottom: ${value};`;
    
    // Gap
    classes[`gap-${key}`] = `gap: ${value};`;
  });

  return classes;
}

export function generateTypographyClasses() {
  const classes: Record<string, string> = {};
  
  // Font sizes
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    classes[`text-${key}`] = `font-size: ${value};`;
  });

  // Font weights
  Object.entries(typography.fontWeight).forEach(([key, value]) => {
    classes[`font-${key}`] = `font-weight: ${value};`;
  });

  // Line heights
  Object.entries(typography.lineHeight).forEach(([key, value]) => {
    classes[`leading-${key}`] = `line-height: ${value};`;
  });

  return classes;
}

export function generateUtilityClasses() {
  const classes: Record<string, string> = {};
  
  // Border radius
  Object.entries(borderRadius).forEach(([key, value]) => {
    classes[`rounded-${key}`] = `border-radius: ${value};`;
  });

  // Shadows
  Object.entries(shadows).forEach(([key, value]) => {
    classes[`shadow-${key}`] = `box-shadow: ${value};`;
  });

  // Transitions
  Object.entries(transitions).forEach(([key, value]) => {
    classes[`transition-${key}`] = `transition: ${value};`;
  });

  return classes;
}
