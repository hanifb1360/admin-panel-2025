import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingFallback } from '../../../shared';
import { cn } from '../../../lib/utils';
import { tw } from '../../../design-system/utilities/tailwind';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
  className?: string;
  loadingMessage?: string;
}

// Error fallback component
const DefaultErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className={cn(tw.layout.flex.center, tw.layout.flex.col, tw.spacing.gap[4], 'h-64', tw.bg.primary)}>
    <div className={cn(tw.text.error, tw.typography.heading.md)}>
      Something went wrong
    </div>
    <p className={cn(tw.text.secondary, tw.typography.body.sm, 'text-center max-w-md')}>
      {error.message || 'An unexpected error occurred while loading this component.'}
    </p>
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
  </div>
);

// Main lazy wrapper component
export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback: FallbackComponent = LoadingFallback,
  errorFallback: ErrorFallbackComponent = DefaultErrorFallback,
  className,
  loadingMessage = 'Loading component...',
}) => {
  return (
    <div className={className}>
      <ErrorBoundary
        FallbackComponent={ErrorFallbackComponent}
        onError={(error: Error, errorInfo: React.ErrorInfo) => {
          console.error('Lazy component error:', error, errorInfo);
        }}
      >
        <Suspense fallback={<FallbackComponent message={loadingMessage} />}>
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// Component for lazy loading with intersection observer
interface LazyLoadOnViewProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export const LazyLoadOnView: React.FC<LazyLoadOnViewProps> = ({
  children,
  fallback = <LoadingFallback size="sm" />,
  threshold = 0.1,
  rootMargin = '50px',
  className,
}) => {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin]);

  return (
    <div ref={elementRef} className={className}>
      {shouldLoad ? children : fallback}
    </div>
  );
};

export default LazyWrapper;
