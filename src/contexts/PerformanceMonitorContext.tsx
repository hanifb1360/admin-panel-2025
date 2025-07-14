import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { PerformanceMonitorContext } from './usePerformanceMonitor';

interface PerformanceMonitorProviderProps {
  children: ReactNode;
}

export const PerformanceMonitorProvider: React.FC<PerformanceMonitorProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggle = () => setIsVisible(prev => !prev);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const value = {
    isVisible,
    toggle,
    show,
    hide
  };

  return (
    <PerformanceMonitorContext.Provider value={value}>
      {children}
    </PerformanceMonitorContext.Provider>
  );
};
