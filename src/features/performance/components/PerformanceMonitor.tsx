import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { tw } from '../../../design-system/utilities/tailwind';
import { useAdvancedPerformance, useMemoryLeakDetection } from '../hooks/useAdvancedPerformance';
import { bundleUtils, memoryUtils } from '../utils/performanceUtils';
import { Activity, Cpu, HardDrive, Network, Zap } from 'lucide-react';

interface PerformanceMonitorProps {
  className?: string;
  showDetailed?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  className,
  showDetailed = false
}) => {
  const { metrics } = useAdvancedPerformance();
  const { isLeakDetected, currentMemoryUsage } = useMemoryLeakDetection();

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  const formatTime = (time: number | null) => {
    if (time === null) return 'N/A';
    return time < 1000 ? `${time.toFixed(1)}ms` : `${(time / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number | null) => {
    if (bytes === null) return 'N/A';
    return `${bytes.toFixed(1)} MB`;
  };

  const getPerformanceColor = (metric: number | null, thresholds: { good: number; poor: number }) => {
    if (metric === null) return 'text-gray-500';
    if (metric <= thresholds.good) return 'text-green-500';
    if (metric <= thresholds.poor) return 'text-yellow-500';
    return 'text-red-500';
  };

  const performanceItems = [
    {
      icon: Zap,
      label: 'Render Time',
      value: formatTime(metrics.renderTime),
      color: getPerformanceColor(metrics.renderTime, { good: 16, poor: 50 })
    },
    {
      icon: Activity,
      label: 'FCP',
      value: formatTime(metrics.firstContentfulPaint),
      color: getPerformanceColor(metrics.firstContentfulPaint, { good: 1800, poor: 3000 })
    },
    {
      icon: Cpu,
      label: 'LCP',
      value: formatTime(metrics.largestContentfulPaint),
      color: getPerformanceColor(metrics.largestContentfulPaint, { good: 2500, poor: 4000 })
    },
    {
      icon: HardDrive,
      label: 'Memory',
      value: formatBytes(currentMemoryUsage),
      color: isLeakDetected ? 'text-red-500' : getPerformanceColor(currentMemoryUsage, { good: 20, poor: 50 })
    },
    {
      icon: Network,
      label: 'Connection',
      value: metrics.connectionType || 'Unknown',
      color: 'text-blue-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'fixed top-4 right-4 z-50',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'rounded-lg shadow-lg p-3 min-w-[280px]',
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className={cn(tw.typography.heading.sm, tw.text.primary)}>
          Performance
        </h3>
        {isLeakDetected && (
          <div className="text-red-500 text-xs px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded">
            Memory Leak
          </div>
        )}
      </div>

      <div className="space-y-2">
        {performanceItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className={cn(tw.typography.body.xs, tw.text.secondary)}>
                  {item.label}
                </span>
              </div>
              <span className={cn(tw.typography.body.xs, item.color, 'font-mono')}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {showDetailed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">FID:</span>
              <span className={getPerformanceColor(metrics.firstInputDelay, { good: 100, poor: 300 })}>
                {formatTime(metrics.firstInputDelay)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CLS:</span>
              <span className={getPerformanceColor(metrics.cumulativeLayoutShift, { good: 0.1, poor: 0.25 })}>
                {metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <button
            onClick={() => memoryUtils.cleanupUnusedComponents()}
            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Cleanup
          </button>
          <button
            onClick={() => bundleUtils.analyzeChunks()}
            className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Analyze
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Lightweight performance overlay for production builds
export const PerformanceOverlay: React.FC = () => {
  const [showMonitor, setShowMonitor] = React.useState(false);

  // Only enable in development or when explicitly enabled
  React.useEffect(() => {
    const enablePerformanceMonitor = 
      process.env.NODE_ENV === 'development' || 
      localStorage.getItem('enable-performance-monitor') === 'true';
    
    setShowMonitor(enablePerformanceMonitor);
  }, []);

  if (!showMonitor) return null;

  return <PerformanceMonitor />;
};
