import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingFallback } from '../../../shared';
import { cn } from '../../../lib/utils';
import { tw } from '../../../design-system/utilities/tailwind';

// Note: VirtualScroll and LazyImage components were removed as they were unused.
// For virtual scrolling or lazy images, implement using intersection observer patterns
// or the performance utilities from the performanceUtils.ts file.

// Advanced lazy wrapper with resource hints
interface AdvancedLazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ message?: string }>;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  className?: string;
  loadingMessage?: string;
  enablePrefetch?: boolean;
  priority?: 'high' | 'normal' | 'low';
  prefetchResources?: string[]; // URLs of resources to prefetch
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
  priority = 'normal',
  prefetchResources = []
}) => {
  // Add resource hints for better loading performance
  React.useEffect(() => {
    if (enablePrefetch && priority === 'high' && prefetchResources.length > 0) {
      const links: HTMLLinkElement[] = [];
      
      prefetchResources.forEach(resourceUrl => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = resourceUrl;
        
        // Determine resource type from URL or default to script
        if (resourceUrl.endsWith('.css')) {
          link.as = 'style';
        } else if (resourceUrl.endsWith('.js') || resourceUrl.endsWith('.mjs')) {
          link.as = 'script';
        } else if (resourceUrl.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
          link.as = 'image';
        } else {
          link.as = 'fetch';
          link.setAttribute('crossorigin', 'anonymous');
        }
        
        document.head.appendChild(link);
        links.push(link);
      });

      return () => {
        links.forEach(link => {
          if (document.head.contains(link)) {
            document.head.removeChild(link);
          }
        });
      };
    }
  }, [enablePrefetch, priority, prefetchResources]);

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


