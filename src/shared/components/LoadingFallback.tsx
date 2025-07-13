import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { tw } from '../../design-system/utilities/tailwind';

interface LoadingFallbackProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-32',
  md: 'h-64',
  lg: 'h-96',
};

const spinnerSizes = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
  showSpinner = true,
  className,
  size = 'md',
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        tw.layout.flex.center,
        tw.layout.flex.col,
        tw.spacing.gap[4],
        sizeClasses[size],
        tw.bg.primary,
        className
      )}
    >
      {showSpinner && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className={cn(
            'border-2 border-primary-200 dark:border-gray-700 rounded-full',
            'border-t-primary-600 dark:border-t-primary-400',
            spinnerSizes[size]
          )}
        />
      )}
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={cn(tw.text.secondary, tw.typography.body.sm)}
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

// Skeleton loader for specific components
export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-5/6"></div>
      </div>
    </div>
  );
};

// Chart skeleton loader
export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => {
  return (
    <div className={cn(tw.bg.primary, 'rounded-lg p-6 animate-pulse')} style={{ height }}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3 mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-8"></div>
            <div className={`h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-${Math.floor(Math.random() * 6) + 2}/12`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className={cn(tw.bg.primary, 'rounded-lg overflow-hidden')}>
      <div className="p-6 animate-pulse">
        {/* Header */}
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 mb-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingFallback;
