/**
 * Main Design System Export
 * Centralized access to all design system components
 */

// Export all tokens
export * from './tokens';

// Export all components
export * from './components';

// Export utilities
export * from './utilities/tailwind';

// Export styles
export * from './styles';

// Re-export the utilities with more convenient names
export { tw as tailwind, componentVariants, combineClasses, responsive, withStates } from './utilities/tailwind';
