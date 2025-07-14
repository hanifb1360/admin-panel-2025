import React from 'react';
import { usePerformanceMonitor } from '../contexts/usePerformanceMonitor';
import { PerformanceOverlay } from '../features/performance';

export const ConditionalPerformanceOverlay: React.FC = () => {
  const { isVisible } = usePerformanceMonitor();
  
  if (!isVisible) {
    return null;
  }

  return <PerformanceOverlay />;
};
