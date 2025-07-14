import { createContext, useContext } from 'react';

export interface PerformanceMonitorContextType {
  isVisible: boolean;
  toggle: () => void;
  show: () => void;
  hide: () => void;
}

export const PerformanceMonitorContext = createContext<PerformanceMonitorContextType | undefined>(undefined);

export const usePerformanceMonitor = () => {
  const context = useContext(PerformanceMonitorContext);
  if (context === undefined) {
    throw new Error('usePerformanceMonitor must be used within a PerformanceMonitorProvider');
  }
  return context;
};
