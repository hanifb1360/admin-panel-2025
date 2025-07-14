import { useEffect, useRef, useState, useCallback } from 'react';

// Extend Performance interface for memory property
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Extend Navigator interface for connection property
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    type?: string;
  };
}

// Extend PerformanceEntry for layout shift
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Extend PerformanceEntry for first input
interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface PerformanceMetrics {
  renderTime: number;
  firstContentfulPaint: number | null;
  largestContentfulPaint: number | null;
  firstInputDelay: number | null;
  cumulativeLayoutShift: number | null;
  memoryUsage: number | null;
  connectionType: string | null;
}

interface UseAdvancedPerformanceOptions {
  trackMemory?: boolean;
  trackNetwork?: boolean;
  trackRender?: boolean;
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
}

// Enhanced performance monitoring hook
export function useAdvancedPerformance(options: UseAdvancedPerformanceOptions = {}) {
  const {
    trackMemory = true,
    trackNetwork = true,
    trackRender = true,
    onMetricsUpdate
  } = options;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    firstContentfulPaint: null,
    largestContentfulPaint: null,
    firstInputDelay: null,
    cumulativeLayoutShift: null,
    memoryUsage: null,
    connectionType: null
  });

  const renderStartTime = useRef<number>(0);
  const observer = useRef<PerformanceObserver | null>(null);

  // Measure render performance
  const startRenderMeasurement = useCallback(() => {
    if (trackRender) {
      renderStartTime.current = performance.now();
    }
  }, [trackRender]);

  const endRenderMeasurement = useCallback(() => {
    if (trackRender && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
    }
  }, [trackRender]);

  // Get memory usage
  const getMemoryUsage = useCallback(() => {
    if (trackMemory) {
      const perfWithMemory = performance as PerformanceWithMemory;
      if (perfWithMemory.memory) {
        return perfWithMemory.memory.usedJSHeapSize / 1048576; // Convert to MB
      }
    }
    return null;
  }, [trackMemory]);

  // Get network information
  const getNetworkInfo = useCallback(() => {
    if (trackNetwork) {
      const navWithConnection = navigator as NavigatorWithConnection;
      if (navWithConnection.connection) {
        return navWithConnection.connection.effectiveType || navWithConnection.connection.type || 'unknown';
      }
    }
    return null;
  }, [trackNetwork]);

  // Setup performance observers
  useEffect(() => {
    if (!window.PerformanceObserver) return;

    const handlePerformanceEntry = (list: PerformanceObserverEntryList) => {
      const entries = list.getEntries();
      
      entries.forEach(entry => {
        setMetrics(prev => {
          const updated = { ...prev };
          
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                updated.firstContentfulPaint = entry.startTime;
              }
              break;
            
            case 'largest-contentful-paint':
              updated.largestContentfulPaint = entry.startTime;
              break;
            
            case 'first-input': {
              const firstInputEntry = entry as FirstInputEntry;
              updated.firstInputDelay = firstInputEntry.processingStart - firstInputEntry.startTime;
              break;
            }
            
            case 'layout-shift': {
              const layoutShiftEntry = entry as LayoutShiftEntry;
              if (!layoutShiftEntry.hadRecentInput) {
                updated.cumulativeLayoutShift = 
                  (prev.cumulativeLayoutShift || 0) + layoutShiftEntry.value;
              }
              break;
            }
          }
          
          return updated;
        });
      });
    };

    try {
      observer.current = new PerformanceObserver(handlePerformanceEntry);
      observer.current.observe({ 
        entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: getMemoryUsage(),
        connectionType: getNetworkInfo()
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [getMemoryUsage, getNetworkInfo]);

  // Call metrics update callback
  useEffect(() => {
    if (onMetricsUpdate) {
      onMetricsUpdate(metrics);
    }
  }, [metrics, onMetricsUpdate]);

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    getMemoryUsage,
    getNetworkInfo
  };
}

// Hook for component-level performance tracking
export function useComponentPerformance(componentName: string) {
  const startTime = useRef<number>(0);
  const [renderCount, setRenderCount] = useState(0);
  const [averageRenderTime, setAverageRenderTime] = useState(0);
  const totalRenderTime = useRef(0);

  useEffect(() => {
    startTime.current = performance.now();
    setRenderCount(prev => prev + 1);

    return () => {
      const renderTime = performance.now() - startTime.current;
      totalRenderTime.current += renderTime;
      const newAverage = totalRenderTime.current / renderCount;
      setAverageRenderTime(newAverage);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName, renderCount]);

  return {
    renderCount,
    averageRenderTime
  };
}

// Hook for measuring async operations
export function useAsyncPerformance() {
  const [pendingOperations, setPendingOperations] = useState<Map<string, number>>(new Map());

  const startOperation = useCallback((operationName: string) => {
    setPendingOperations(prev => new Map(prev.set(operationName, performance.now())));
    return operationName;
  }, []);

  const endOperation = useCallback((operationName: string) => {
    setPendingOperations(prev => {
      const startTime = prev.get(operationName);
      if (startTime) {
        const duration = performance.now() - startTime;
        console.log(`${operationName} completed in ${duration.toFixed(2)}ms`);
        const newMap = new Map(prev);
        newMap.delete(operationName);
        return newMap;
      }
      return prev;
    });
  }, []);

  return {
    startOperation,
    endOperation,
    pendingOperations: Array.from(pendingOperations.keys())
  };
}

// Hook for bundle size monitoring (development only)
export function useBundleAnalysis() {
  const [bundleStats, setBundleStats] = useState<{
    totalSize: number;
    chunkCount: number;
    largestChunk: string;
  } | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Simulate bundle analysis - in a real app, this would come from build tools
      const mockStats = {
        totalSize: Math.random() * 2000 + 500, // KB
        chunkCount: Math.floor(Math.random() * 10) + 5,
        largestChunk: 'vendor-react'
      };
      setBundleStats(mockStats);
    }
  }, []);

  return bundleStats;
}

// Hook for memory leak detection
export function useMemoryLeakDetection() {
  const [memoryTrend, setMemoryTrend] = useState<number[]>([]);
  const [isLeakDetected, setIsLeakDetected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const perfWithMemory = performance as PerformanceWithMemory;
      if (perfWithMemory.memory) {
        const currentUsage = perfWithMemory.memory.usedJSHeapSize / 1048576; // MB
        
        setMemoryTrend(prev => {
          const newTrend = [...prev.slice(-9), currentUsage]; // Keep last 10 measurements
          
          // Simple leak detection: memory increases consistently
          if (newTrend.length >= 5) {
            const isIncreasing = newTrend.slice(-5).every((val, i, arr) => 
              i === 0 || val > arr[i - 1]
            );
            setIsLeakDetected(isIncreasing && currentUsage > 50); // 50MB threshold
          }
          
          return newTrend;
        });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    memoryTrend,
    isLeakDetected,
    currentMemoryUsage: memoryTrend[memoryTrend.length - 1] || 0
  };
}
