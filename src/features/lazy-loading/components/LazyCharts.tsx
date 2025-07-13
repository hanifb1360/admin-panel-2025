import React, { Suspense } from 'react';
import { LazyLoadOnView } from './LazyWrapper';
import { ChartSkeleton } from '../../../shared';
import { AdvancedLazyWrapper } from '../utils/advancedLazyUtils';

// Lazy load advanced chart components with enhanced performance features
const AdvancedAnimatedChart = React.lazy(() => import('../../../components/charts/advanced/AdvancedAnimatedChart'));
const AdvancedHeatmap = React.lazy(() => import('../../../components/charts/advanced/AdvancedHeatmap'));
const AdvancedTreemap = React.lazy(() => import('../../../components/charts/advanced/AdvancedTreemap'));
const AdvancedRadarChart = React.lazy(() => import('../../../components/charts/advanced/AdvancedRadarChart'));
const AdvancedParallelCoordinates = React.lazy(() => import('../../../components/charts/advanced/AdvancedParallelCoordinates'));
const AdvancedLineChart = React.lazy(() => import('../../../components/charts/advanced/AdvancedLineChart'));

// Basic charts with standard lazy loading
const LineChart = React.lazy(() => import('../../../components/charts/LineChart'));
const BarChart = React.lazy(() => import('../../../components/charts/BarChart'));
const PieChart = React.lazy(() => import('../../../components/charts/PieChart'));
const AreaChart = React.lazy(() => import('../../../components/charts/AreaChart'));

// Enhanced lazy wrapper for charts that load when they come into view
interface LazyChartProps {
  children: React.ReactNode;
  height?: number;
  fallback?: React.ReactNode;
  priority?: 'high' | 'normal' | 'low';
  enableIntersectionObserver?: boolean;
}

export const LazyChart: React.FC<LazyChartProps> = ({ 
  children, 
  height = 400,
  fallback,
  priority = 'normal',
  enableIntersectionObserver = true
}) => {
  const chartFallback = fallback || <ChartSkeleton height={height} />;

  if (enableIntersectionObserver) {
    return (
      <LazyLoadOnView 
        fallback={chartFallback}
        threshold={0.1}
        rootMargin="100px"
      >
        <AdvancedLazyWrapper
          fallback={() => <ChartSkeleton height={height} />}
          loadingMessage="Loading chart..."
          priority={priority}
          enablePrefetch={priority === 'high'}
        >
          {children}
        </AdvancedLazyWrapper>
      </LazyLoadOnView>
    );
  }

  return (
    <AdvancedLazyWrapper
      fallback={() => <ChartSkeleton height={height} />}
      loadingMessage="Loading chart..."
      priority={priority}
      enablePrefetch={priority === 'high'}
    >
      <Suspense fallback={chartFallback}>
        {children}
      </Suspense>
    </AdvancedLazyWrapper>
  );
};

// Export lazy chart components
export {
  // Advanced charts
  AdvancedAnimatedChart,
  AdvancedHeatmap,
  AdvancedTreemap,
  AdvancedRadarChart,
  AdvancedParallelCoordinates,
  AdvancedLineChart,
  
  // Basic charts
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
};
