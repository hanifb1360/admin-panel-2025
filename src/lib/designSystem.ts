import { cn } from './utils';

// Design System Configuration
export const designSystem = {
  // Colors
  colors: {
    primary: {
      50: 'bg-primary-50',
      100: 'bg-primary-100',
      500: 'bg-primary-500',
      600: 'bg-primary-600',
      700: 'bg-primary-700',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      success: 'text-green-600',
      error: 'text-red-600',
      white: 'text-white',
      primaryAccent: 'text-primary-600',
      successLight: 'text-green-500',
      errorLight: 'text-red-500',
    },
    bg: {
      white: 'bg-white',
      gray: {
        50: 'bg-gray-50',
        100: 'bg-gray-100',
        200: 'bg-gray-200',
        300: 'bg-gray-300',
        800: 'bg-gray-800',
        900: 'bg-gray-900',
      },
      success: 'bg-green-100',
      error: 'bg-red-100',
      warning: 'bg-yellow-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
    },
    border: {
      default: 'border-gray-200',
      gray: 'border-gray-300',
      gray800: 'border-gray-800',
      focus: 'focus:border-transparent',
    },
  },

  // Typography
  typography: {
    heading: {
      xl: 'text-2xl font-bold',
      lg: 'text-xl font-bold',
      md: 'text-lg font-semibold',
      sm: 'text-sm font-medium',
      xs: 'text-xs font-medium',
    },
    body: {
      lg: 'text-lg',
      base: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
    },
    display: {
      xl: 'text-3xl font-bold',
      lg: 'text-2xl font-bold',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
  },

  // Spacing
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
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
    gap: {
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    },
  },

  // Layout
  layout: {
    flex: {
      center: 'flex items-center justify-center',
      between: 'flex items-center justify-between',
      start: 'flex items-start',
      end: 'flex items-end',
      col: 'flex flex-col',
      wrap: 'flex flex-wrap',
    },
    grid: {
      cols1: 'grid grid-cols-1',
      cols2: 'grid grid-cols-2',
      cols3: 'grid grid-cols-3',
      cols4: 'grid grid-cols-4',
      responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
    container: {
      full: 'w-full h-full',
      screen: 'min-h-screen',
      auto: 'w-auto h-auto',
    },
  },

  // Shadows and Effects
  effects: {
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    rounded: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    transition: {
      all: 'transition-all duration-200',
      colors: 'transition-colors duration-200',
      transform: 'transition-transform duration-200',
    },
    hover: {
      scale: 'hover:scale-105',
      shadow: 'hover:shadow-md',
    },
  },

  // Interactive States
  states: {
    hover: {
      bg: {
        gray100: 'hover:bg-gray-100',
        gray800: 'hover:bg-gray-800',
        primary700: 'hover:bg-primary-700',
      },
      text: {
        primary700: 'hover:text-primary-700',
        white: 'hover:text-white',
      },
    },
    focus: {
      ring: 'focus:outline-none focus:ring-2 focus:ring-primary-500',
      border: 'focus:border-transparent',
    },
    disabled: {
      opacity: 'disabled:opacity-50',
      cursor: 'disabled:cursor-not-allowed',
    },
  },

  // Responsive Design
  responsive: {
    mobile: 'sm:',
    tablet: 'md:',
    desktop: 'lg:',
    wide: 'xl:',
  },
};

// Component Variants
export const componentVariants = {
  // Card variants
  card: {
    default: cn(
      designSystem.colors.bg.white,
      designSystem.effects.rounded.lg,
      designSystem.effects.shadow.sm,
      designSystem.colors.border.default,
      'border',
      designSystem.spacing.md
    ),
    elevated: cn(
      designSystem.colors.bg.white,
      designSystem.effects.rounded.lg,
      designSystem.effects.shadow.lg,
      designSystem.colors.border.default,
      'border',
      designSystem.spacing.md
    ),
    flat: cn(
      designSystem.colors.bg.white,
      designSystem.effects.rounded.lg,
      designSystem.colors.border.default,
      'border',
      designSystem.spacing.md
    ),
  },

  // Button variants
  button: {
    primary: cn(
      designSystem.colors.primary[600],
      designSystem.states.hover.bg.primary700,
      designSystem.colors.text.white,
      designSystem.typography.weight.medium,
      'py-2 px-4',
      designSystem.effects.rounded.lg,
      designSystem.effects.transition.colors
    ),
    secondary: cn(
      designSystem.colors.bg.gray[200],
      'hover:bg-gray-300',
      designSystem.colors.text.primary,
      designSystem.typography.weight.medium,
      'py-2 px-4',
      designSystem.effects.rounded.lg,
      designSystem.effects.transition.colors
    ),
    ghost: cn(
      'bg-transparent',
      designSystem.states.hover.bg.gray100,
      designSystem.colors.text.primary,
      designSystem.typography.weight.medium,
      'py-2 px-4',
      designSystem.effects.rounded.lg,
      designSystem.effects.transition.colors
    ),
  },

  // Input variants
  input: {
    default: cn(
      'w-full px-3 py-2',
      designSystem.colors.border.gray,
      'border',
      designSystem.effects.rounded.lg,
      designSystem.states.focus.ring,
      designSystem.states.focus.border
    ),
    search: cn(
      'pl-10 pr-4 py-2',
      designSystem.colors.border.gray,
      'border',
      designSystem.effects.rounded.lg,
      designSystem.states.focus.ring,
      designSystem.states.focus.border
    ),
  },

  // Icon containers
  iconContainer: {
    small: cn(
      'w-8 h-8',
      designSystem.effects.rounded.lg,
      designSystem.layout.flex.center
    ),
    medium: cn(
      'w-12 h-12',
      designSystem.effects.rounded.lg,
      designSystem.layout.flex.center
    ),
    large: cn(
      'w-16 h-16',
      designSystem.effects.rounded.lg,
      designSystem.layout.flex.center
    ),
  },

  // Status indicators
  status: {
    success: cn(
      'px-2 py-1',
      designSystem.colors.bg.success,
      designSystem.colors.text.success,
      designSystem.effects.rounded.full,
      designSystem.typography.body.xs,
      designSystem.typography.weight.medium
    ),
    error: cn(
      'px-2 py-1',
      designSystem.colors.bg.error,
      designSystem.colors.text.error,
      designSystem.effects.rounded.full,
      designSystem.typography.body.xs,
      designSystem.typography.weight.medium
    ),
    warning: cn(
      'px-2 py-1',
      designSystem.colors.bg.warning,
      'text-yellow-800',
      designSystem.effects.rounded.full,
      designSystem.typography.body.xs,
      designSystem.typography.weight.medium
    ),
    info: cn(
      'px-2 py-1',
      designSystem.colors.bg.blue,
      'text-blue-800',
      designSystem.effects.rounded.full,
      designSystem.typography.body.xs,
      designSystem.typography.weight.medium
    ),
  },

  // Layout components
  sidebar: {
    container: cn(
      designSystem.layout.flex.col,
      'h-screen',
      designSystem.colors.bg.gray[900],
      designSystem.colors.text.white,
      designSystem.effects.transition.all
    ),
    header: cn(
      designSystem.layout.flex.between,
      designSystem.spacing.md,
      designSystem.colors.border.gray800,
      'border-b'
    ),
    nav: cn(
      'flex-1 px-4 py-6',
      designSystem.spacing.gap.sm,
      'space-y-2'
    ),
    footer: cn(
      designSystem.spacing.md,
      designSystem.colors.border.gray800,
      'border-t'
    ),
  },

  // Table variants
  table: {
    container: cn(
      designSystem.colors.bg.white,
      designSystem.effects.rounded.lg,
      designSystem.effects.shadow.sm,
      designSystem.colors.border.default,
      'border overflow-hidden'
    ),
    header: cn(
      designSystem.colors.bg.gray[50],
      'px-6 py-3 text-left',
      designSystem.typography.body.xs,
      designSystem.typography.weight.medium,
      'text-gray-500 uppercase tracking-wider'
    ),
    cell: cn(
      'px-6 py-4 whitespace-nowrap',
      designSystem.typography.body.sm,
      designSystem.colors.text.primary
    ),
    row: cn(
      'hover:bg-gray-50',
      designSystem.effects.transition.colors
    ),
  },
};

// Utility functions for design system
export const ds = {
  // Combine multiple design system classes
  combine: (...classes: string[]) => cn(...classes),
  
  // Create responsive classes
  responsive: (mobile: string, tablet?: string, desktop?: string) => {
    const classes = [mobile];
    if (tablet) classes.push(`md:${tablet}`);
    if (desktop) classes.push(`lg:${desktop}`);
    return cn(...classes);
  },
  
  // Create state variants
  withStates: (base: string, hover?: string, focus?: string, active?: string) => {
    const classes = [base];
    if (hover) classes.push(hover);
    if (focus) classes.push(focus);
    if (active) classes.push(active);
    return cn(...classes);
  },
};

export default designSystem;
