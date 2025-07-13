import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingFallback } from '../components/LoadingFallback';
import { cn } from '../lib/utils';
import { tw } from '../design-system/utilities/tailwind';

// Note: VirtualScroll and LazyImage components were removed as they were unused.
// For virtual scrolling, use the useVirtualScroll hook from usePerformance.ts if needed.
// For lazy images, implement using the useIntersectionObserver hook.

// Advanced lazy wrapper with resource hints
interface AdvancedLazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ message?: string }>;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  className?: string;
  loadingMessage?: string;
  enablePrefetch?: boolean;
  priority?: 'high' | 'normal' | 'low';
}

const AdvancedErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className={cn(tw.layout.flex.center, tw.layout.flex.col, tw.spacing.gap[4], 'h-64', tw.bg.primary)}>
    <div className={cn(tw.text.error, tw.typography.heading.md)}>
      Component failed to load
    </div>
    <p className={cn(tw.text.secondary, tw.typography.body.sm, 'text-center max-w-md')}>
      {error.message || 'An unexpected error occurred while loading this component.'}
    </p>
    <div className="flex gap-2">
      <button
        onClick={resetErrorBoundary}
        className={cn(
          tw.interactive.primary,
          tw.interactive.primaryHover,
          'px-4 py-2 rounded-lg font-medium',
          tw.effects.transition.colors
        )}
      >
        Try again
      </button>
      <button
        onClick={() => window.location.reload()}
        className={cn(
          tw.interactive.secondary,
          tw.interactive.secondaryHover,
          'px-4 py-2 rounded-lg font-medium',
          tw.effects.transition.colors
        )}
      >
        Reload page
      </button>
    </div>
  </div>
);

export const AdvancedLazyWrapper: React.FC<AdvancedLazyWrapperProps> = ({
  children,
  fallback: FallbackComponent = LoadingFallback,
  errorFallback: ErrorFallbackComponent = AdvancedErrorFallback,
  className,
  loadingMessage = 'Loading component...',
  enablePrefetch = true,
  priority = 'normal'
}) => {
  // Add resource hints for better loading performance
  React.useEffect(() => {
    if (enablePrefetch && priority === 'high') {
      // Add prefetch hints for critical resources
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'script';
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [enablePrefetch, priority]);

  return (
    <div className={className}>
      <ErrorBoundary
        FallbackComponent={ErrorFallbackComponent}
        onError={(error: Error, errorInfo: React.ErrorInfo) => {
          console.error('Advanced lazy component error:', error, errorInfo);
          // Send to error reporting service in production
          if (process.env.NODE_ENV === 'production') {
            // analytics.reportError(error, errorInfo);
          }
        }}
      >
        <Suspense fallback={<FallbackComponent message={loadingMessage} />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};


