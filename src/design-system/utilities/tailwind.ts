/**
 * Tailwind CSS Utilities for Design System
 * Converts design tokens to Tailwind classes for component usage
 */

/**
 * Convert semantic colors to Tailwind classes
 */
export const tw = {
  // Text colors with dark mode support
  text: {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    inverse: 'text-white dark:text-gray-900',
    disabled: 'text-gray-400 dark:text-gray-600',
    link: 'text-primary-600 dark:text-primary-400',
    linkHover: 'hover:text-primary-700 dark:hover:text-primary-300',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    // Legacy compatibility
    white: 'text-white',
    primaryAccent: 'text-primary-600 dark:text-primary-400',
    successLight: 'text-green-500 dark:text-green-400',
    errorLight: 'text-red-500 dark:text-red-400',
  },

  // Background colors with dark mode support
  bg: {
    primary: 'bg-white dark:bg-gray-900',
    secondary: 'bg-gray-50 dark:bg-gray-800',
    tertiary: 'bg-gray-100 dark:bg-gray-700',
    inverse: 'bg-gray-900 dark:bg-white',
    disabled: 'bg-gray-100 dark:bg-gray-700',
    success: 'bg-green-50 dark:bg-green-900/20',
    error: 'bg-red-50 dark:bg-red-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    info: 'bg-blue-50 dark:bg-blue-900/20',
    // Base colors
    white: 'bg-white dark:bg-gray-900',
    gray: {
      50: 'bg-gray-50 dark:bg-gray-900',
      100: 'bg-gray-100 dark:bg-gray-800',
      200: 'bg-gray-200 dark:bg-gray-700',
      300: 'bg-gray-300 dark:bg-gray-600',
      400: 'bg-gray-400 dark:bg-gray-500',
      500: 'bg-gray-500 dark:bg-gray-400',
      600: 'bg-gray-600 dark:bg-gray-300',
      700: 'bg-gray-700 dark:bg-gray-200',
      800: 'bg-gray-800 dark:bg-gray-100',
      900: 'bg-gray-900 dark:bg-gray-50',
    },
    primaryColors: {
      50: 'bg-primary-50 dark:bg-primary-900/20',
      100: 'bg-primary-100 dark:bg-primary-800/30',
      200: 'bg-primary-200 dark:bg-primary-700/40',
      300: 'bg-primary-300 dark:bg-primary-600/50',
      400: 'bg-primary-400 dark:bg-primary-500/60',
      500: 'bg-primary-500 dark:bg-primary-400',
      600: 'bg-primary-600 dark:bg-primary-300',
      700: 'bg-primary-700 dark:bg-primary-200',
      800: 'bg-primary-800 dark:bg-primary-100',
      900: 'bg-primary-900 dark:bg-primary-50',
    },
    red: {
      50: 'bg-red-50 dark:bg-red-900/20',
      100: 'bg-red-100 dark:bg-red-800/30',
      600: 'bg-red-600 dark:bg-red-400',
      700: 'bg-red-700 dark:bg-red-300',
      800: 'bg-red-800 dark:bg-red-200',
    },
    green: {
      50: 'bg-green-50 dark:bg-green-900/20',
      100: 'bg-green-100 dark:bg-green-800/30',
      600: 'bg-green-600 dark:bg-green-400',
      700: 'bg-green-700 dark:bg-green-300',
      800: 'bg-green-800 dark:bg-green-200',
    },
    yellow: {
      50: 'bg-yellow-50 dark:bg-yellow-900/20',
      100: 'bg-yellow-100 dark:bg-yellow-800/30',
      600: 'bg-yellow-600 dark:bg-yellow-400',
      700: 'bg-yellow-700 dark:bg-yellow-300',
      800: 'bg-yellow-800 dark:bg-yellow-200',
    },
    blue: {
      50: 'bg-blue-50 dark:bg-blue-900/20',
      100: 'bg-blue-100 dark:bg-blue-800/30',
      600: 'bg-blue-600 dark:bg-blue-400',
      700: 'bg-blue-700 dark:bg-blue-300',
      800: 'bg-blue-800 dark:bg-blue-200',
    },
  },

  // Border colors with dark mode support
  border: {
    primary: 'border-gray-200 dark:border-gray-700',
    secondary: 'border-gray-300 dark:border-gray-600',
    tertiary: 'border-gray-400 dark:border-gray-500',
    inverse: 'border-gray-700 dark:border-gray-300',
    focus: 'border-primary-500 dark:border-primary-400',
    error: 'border-red-300 dark:border-red-600',
    success: 'border-green-300 dark:border-green-600',
    warning: 'border-yellow-300 dark:border-yellow-600',
    info: 'border-blue-300 dark:border-blue-600',
    // Legacy compatibility
    default: 'border-gray-200 dark:border-gray-700',
    gray: 'border-gray-300 dark:border-gray-600',
    gray800: 'border-gray-800 dark:border-gray-200',
  },

  // Interactive colors with dark mode support
  interactive: {
    primary: 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white',
    primaryHover: 'hover:bg-primary-700 dark:hover:bg-primary-400',
    primaryActive: 'active:bg-primary-800 dark:active:bg-primary-300',
    primaryDisabled: 'disabled:bg-gray-300 dark:disabled:bg-gray-600',
    secondary: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100',
    secondaryHover: 'hover:bg-gray-300 dark:hover:bg-gray-600',
    secondaryActive: 'active:bg-gray-400 dark:active:bg-gray-500',
    destructive: 'bg-red-600 text-white dark:bg-red-500 dark:text-white',
    destructiveHover: 'hover:bg-red-700 dark:hover:bg-red-400',
    destructiveActive: 'active:bg-red-800 dark:active:bg-red-300',
  },

  // Typography
  typography: {
    // Font sizes
    text: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    // Font weights
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    // Headings
    heading: {
      xs: 'text-xs font-medium',
      sm: 'text-sm font-medium',
      md: 'text-lg font-semibold',
      lg: 'text-xl font-bold',
      xl: 'text-2xl font-bold',
      '2xl': 'text-3xl font-bold',
    },
    // Body text
    body: {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    },
    // Legacy compatibility
    display: {
      xl: 'text-3xl font-bold',
      lg: 'text-2xl font-bold',
    },
  },

  // Spacing
  spacing: {
    // Padding
    p: {
      0: 'p-0',
      1: 'p-1',
      2: 'p-2',
      3: 'p-3',
      4: 'p-4',
      5: 'p-5',
      6: 'p-6',
      8: 'p-8',
      10: 'p-10',
      12: 'p-12',
    },
    // Margin
    m: {
      0: 'm-0',
      1: 'm-1',
      2: 'm-2',
      3: 'm-3',
      4: 'm-4',
      5: 'm-5',
      6: 'm-6',
      8: 'm-8',
      10: 'm-10',
      12: 'm-12',
    },
    // Margin top
    mt: {
      0: 'mt-0',
      1: 'mt-1',
      2: 'mt-2',
      3: 'mt-3',
      4: 'mt-4',
      5: 'mt-5',
      6: 'mt-6',
      8: 'mt-8',
    },
    // Margin bottom
    mb: {
      0: 'mb-0',
      1: 'mb-1',
      2: 'mb-2',
      3: 'mb-3',
      4: 'mb-4',
      5: 'mb-5',
      6: 'mb-6',
      8: 'mb-8',
    },
    // Margin left
    ml: {
      0: 'ml-0',
      1: 'ml-1',
      2: 'ml-2',
      3: 'ml-3',
      4: 'ml-4',
      5: 'ml-5',
      6: 'ml-6',
      8: 'ml-8',
    },
    // Margin right
    mr: {
      0: 'mr-0',
      1: 'mr-1',
      2: 'mr-2',
      3: 'mr-3',
      4: 'mr-4',
      5: 'mr-5',
      6: 'mr-6',
      8: 'mr-8',
    },
    // Gap
    gap: {
      0: 'gap-0',
      1: 'gap-1',
      2: 'gap-2',
      3: 'gap-3',
      4: 'gap-4',
      5: 'gap-5',
      6: 'gap-6',
      8: 'gap-8',
      // Legacy compatibility
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
    // Legacy compatibility - margin object
    margin: {
      xs: 'm-2',
      sm: 'm-4',
      md: 'm-6',
      lg: 'm-8',
      xl: 'm-12',
      top: {
        xs: 'mt-1',
        sm: 'mt-2',
        md: 'mt-4',
        lg: 'mt-6',
      },
      bottom: {
        xs: 'mb-1',
        sm: 'mb-2',
        md: 'mb-4',
        lg: 'mb-6',
      },
      left: {
        xs: 'ml-1',
        sm: 'ml-2',
        md: 'ml-3',
        lg: 'ml-4',
      },
      right: {
        xs: 'mr-1',
        sm: 'mr-2',
        md: 'mr-3',
        lg: 'mr-4',
      },
    },
  },

  // Layout
  layout: {
    // Flexbox
    flex: {
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      start: 'flex items-start',
      end: 'flex items-end',
      col: 'flex flex-col',
      wrap: 'flex flex-wrap',
      nowrap: 'flex flex-nowrap',
    },
    // Grid
    grid: {
      cols1: 'grid grid-cols-1',
      cols2: 'grid grid-cols-2',
      cols3: 'grid grid-cols-3',
      cols4: 'grid grid-cols-4',
      responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
    // Container
    container: {
      full: 'w-full h-full',
      screen: 'min-h-screen',
      auto: 'w-auto h-auto',
    },
  },

  // Effects
  effects: {
    // Shadows
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    // Border radius
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    // Transitions
    transition: {
      all: 'transition-all duration-200',
      colors: 'transition-colors duration-200',
      transform: 'transition-transform duration-200',
    },
    // Hover effects
    hover: {
      scale: 'hover:scale-105',
      shadow: 'hover:shadow-md',
    },
  },

  // States with dark mode support
  states: {
    // Hover
    hover: {
      bg: {
        gray50: 'hover:bg-gray-50 dark:hover:bg-gray-800',
        gray100: 'hover:bg-gray-100 dark:hover:bg-gray-700',
        gray200: 'hover:bg-gray-200 dark:hover:bg-gray-600',
        gray300: 'hover:bg-gray-300 dark:hover:bg-gray-500',
        gray800: 'hover:bg-gray-800 dark:hover:bg-gray-200',
        primary50: 'hover:bg-primary-50 dark:hover:bg-primary-900/20',
        primary700: 'hover:bg-primary-700 dark:hover:bg-primary-300',
      },
      text: {
        white: 'hover:text-white dark:hover:text-gray-900',
        primary700: 'hover:text-primary-700 dark:hover:text-primary-300',
      },
    },
    // Focus
    focus: {
      ring: 'focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400',
      border: 'focus:border-transparent',
    },
    // Disabled
    disabled: {
      opacity: 'disabled:opacity-50',
      cursor: 'disabled:cursor-not-allowed',
    },
  },

  // Responsive
  responsive: {
    mobile: 'sm:',
    tablet: 'md:',
    desktop: 'lg:',
    wide: 'xl:',
  },
};

/**
 * Component variants using Tailwind classes
 */
export const componentVariants = {
  // Card variants
  card: {
    default: [
      tw.bg.white,
      tw.effects.rounded.lg,
      tw.effects.shadow.sm,
      tw.border.primary,
      'border',
      tw.spacing.p[6],
    ].join(' '),
    elevated: [
      tw.bg.white,
      tw.effects.rounded.lg,
      tw.effects.shadow.lg,
      tw.border.primary,
      'border',
      tw.spacing.p[6],
    ].join(' '),
    flat: [
      tw.bg.white,
      tw.effects.rounded.lg,
      tw.border.primary,
      'border',
      tw.spacing.p[6],
    ].join(' '),
  },

  // Button variants
  button: {
    primary: [
      tw.interactive.primary,
      tw.interactive.primaryHover,
      tw.typography.weight.medium,
      'py-2 px-4',
      tw.effects.rounded.lg,
      tw.effects.transition.colors,
      tw.states.focus.ring,
      tw.states.disabled.opacity,
      tw.states.disabled.cursor,
    ].join(' '),
    secondary: [
      tw.interactive.secondary,
      tw.interactive.secondaryHover,
      tw.typography.weight.medium,
      'py-2 px-4',
      tw.effects.rounded.lg,
      tw.effects.transition.colors,
      tw.states.focus.ring,
    ].join(' '),
    outline: [
      'bg-transparent',
      tw.text.link,
      'border border-primary-600',
      tw.states.hover.bg.primary50,
      tw.typography.weight.medium,
      'py-2 px-4',
      tw.effects.rounded.lg,
      tw.effects.transition.colors,
      tw.states.focus.ring,
    ].join(' '),
    ghost: [
      'bg-transparent',
      tw.text.secondary,
      tw.states.hover.bg.gray100,
      tw.typography.weight.medium,
      'py-2 px-4',
      tw.effects.rounded.lg,
      tw.effects.transition.colors,
      tw.states.focus.ring,
    ].join(' '),
    danger: [
      tw.interactive.destructive,
      tw.interactive.destructiveHover,
      tw.typography.weight.medium,
      'py-2 px-4',
      tw.effects.rounded.lg,
      tw.effects.transition.colors,
      tw.states.focus.ring,
    ].join(' '),
  },

  // Input variants
  input: {
    default: [
      'w-full px-3 py-2',
      tw.bg.white,
      tw.text.primary,
      tw.border.secondary,
      'border',
      tw.effects.rounded.lg,
      tw.states.focus.ring,
      tw.states.focus.border,
      tw.effects.transition.colors,
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    ].join(' '),
    search: [
      'pl-10 pr-4 py-2',
      tw.bg.white,
      tw.text.primary,
      tw.border.secondary,
      'border',
      tw.effects.rounded.lg,
      tw.states.focus.ring,
      tw.states.focus.border,
      tw.effects.transition.colors,
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    ].join(' '),
    error: [
      'w-full px-3 py-2',
      tw.bg.white,
      tw.text.primary,
      tw.border.error,
      'border',
      tw.effects.rounded.lg,
      'focus:ring-2 focus:ring-red-500',
      tw.states.focus.border,
      tw.effects.transition.colors,
      'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    ].join(' '),
  },

  // Icon containers
  iconContainer: {
    small: [
      'w-8 h-8',
      tw.effects.rounded.lg,
      tw.layout.flex.center,
    ].join(' '),
    medium: [
      'w-12 h-12',
      tw.effects.rounded.lg,
      tw.layout.flex.center,
    ].join(' '),
    large: [
      'w-16 h-16',
      tw.effects.rounded.lg,
      tw.layout.flex.center,
    ].join(' '),
  },

  // Status badges
  status: {
    success: [
      'px-2 py-1',
      tw.bg.success,
      tw.text.success,
      tw.effects.rounded.full,
      tw.typography.body.xs,
      tw.typography.weight.medium,
    ].join(' '),
    error: [
      'px-2 py-1',
      tw.bg.error,
      tw.text.error,
      tw.effects.rounded.full,
      tw.typography.body.xs,
      tw.typography.weight.medium,
    ].join(' '),
    warning: [
      'px-2 py-1',
      tw.bg.warning,
      tw.text.warning,
      tw.effects.rounded.full,
      tw.typography.body.xs,
      tw.typography.weight.medium,
    ].join(' '),
    info: [
      'px-2 py-1',
      tw.bg.info,
      tw.text.info,
      tw.effects.rounded.full,
      tw.typography.body.xs,
      tw.typography.weight.medium,
    ].join(' '),
  },

  // Layout components
  sidebar: {
    container: [
      tw.layout.flex.col,
      'h-screen',
      'bg-gray-900 dark:bg-gray-950',
      'text-white dark:text-gray-100',
      tw.effects.transition.all,
    ].join(' '),
    header: [
      tw.layout.flex.between,
      tw.spacing.p[6],
      'border-b border-gray-800 dark:border-gray-700',
    ].join(' '),
    nav: [
      'flex-1 px-4 py-6',
      tw.spacing.gap[2],
      'space-y-2',
    ].join(' '),
    footer: [
      tw.spacing.p[6],
      'border-t border-gray-800 dark:border-gray-700',
    ].join(' '),
  },

  // Table variants
  table: {
    container: [
      tw.bg.white,
      tw.effects.rounded.lg,
      tw.effects.shadow.sm,
      tw.border.primary,
      'border overflow-hidden overflow-x-auto table-container',
    ].join(' '),
    header: [
      tw.bg.gray[50],
      'px-6 py-3 text-left min-w-[120px]',
      tw.typography.body.xs,
      tw.typography.weight.medium,
      'text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    ].join(' '),
    cell: [
      'px-6 py-4 whitespace-nowrap min-w-[120px]',
      tw.typography.body.sm,
      tw.text.primary,
    ].join(' '),
    row: [
      tw.states.hover.bg.gray50,
      tw.effects.transition.colors,
    ].join(' '),
  },
};

/**
 * Utility functions for combining classes
 */
export const combineClasses = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Create responsive classes
 */
export const responsive = (
  mobile: string,
  tablet?: string,
  desktop?: string,
  wide?: string
): string => {
  const classes = [mobile];
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  if (wide) classes.push(`xl:${wide}`);
  return classes.join(' ');
};

/**
 * Create state-based classes
 */
export const withStates = (
  base: string,
  hover?: string,
  focus?: string,
  active?: string,
  disabled?: string
): string => {
  const classes = [base];
  if (hover) classes.push(hover);
  if (focus) classes.push(focus);
  if (active) classes.push(active);
  if (disabled) classes.push(disabled);
  return classes.join(' ');
};
