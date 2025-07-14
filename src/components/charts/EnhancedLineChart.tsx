import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { chartColors, chartA11yConfig, formatters } from './index';

interface DataPoint {
  [key: string]: string | number | Date | undefined;
}

interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
  type?: 'line' | 'area';
  strokeWidth?: number;
  strokeDasharray?: string;
  opacity?: number;
}

interface AdvancedLineChartProps {
  data: DataPoint[];
  series: ChartSeries[];
  width?: number;
  height?: number;
  className?: string;
  
  // Animation options
  animationDuration?: number;
  staggerDelay?: number;
  enableAnimations?: boolean;
  
  // Accessibility options
  title?: string;
  description?: string;
  ariaLabel?: string;
  keyboardNavigation?: boolean;
  announceData?: boolean;
  highContrast?: boolean;
  
  // Interaction options
  onDataPointClick?: (data: DataPoint, series: string) => void;
  showTooltip?: boolean;
  
  // Style options
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  theme?: 'light' | 'dark';
  
  // Data formatting
  xDataKey?: string;
  formatXAxis?: (value: string | number) => string;
  formatYAxis?: (value: number) => string;
}

const AdvancedLineChart: React.FC<AdvancedLineChartProps> = ({
  data,
  series,
  width = 600,
  height = 400,
  className,
  animationDuration = 1500,
  staggerDelay = 200,
  enableAnimations = true,
  title,
  description,
  ariaLabel,
  keyboardNavigation = true,
  announceData = true,
  highContrast = false,
  onDataPointClick,
  showTooltip = true,
  showGrid = true,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  theme = 'light',
  xDataKey = 'name',
  formatXAxis,
  formatYAxis
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ data: DataPoint; series: string } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

  // Calculate chart dimensions and scales
  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Get min/max values for scaling
  const allValues = data.flatMap(point => 
    series.map(s => point[s.dataKey] as number).filter(val => typeof val === 'number')
  );
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  // Simple linear scale functions
  const xScale = (index: number) => (index / Math.max(data.length - 1, 1)) * innerWidth;
  const yScale = (value: number) => {
    const range = maxValue - minValue;
    if (range === 0) return innerHeight / 2;
    return innerHeight - ((value - minValue) / range) * innerHeight;
  };

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Generate chart ID for accessibility
  const chartId = React.useId();
  const titleId = title ? `${chartId}-title` : undefined;
  const descId = description ? `${chartId}-desc` : undefined;

  // Generate path data for line/area charts
  const generatePath = (seriesData: ChartSeries, isArea: boolean = false) => {
    const points = data.map((point, index) => {
      const value = point[seriesData.dataKey] as number;
      if (typeof value !== 'number') return null;
      return `${xScale(index)},${yScale(value)}`;
    }).filter(Boolean);

    if (points.length === 0) return '';

    let path = `M${points[0]}`;
    for (let i = 1; i < points.length; i++) {
      path += `L${points[i]}`;
    }

    if (isArea) {
      path += `L${xScale(data.length - 1)},${innerHeight}L${xScale(0)},${innerHeight}Z`;
    }

    return path;
  };

  if (!data.length || !series.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 text-gray-500', className)}>
        No data available
      </div>
    );
  }

  return (
    <motion.div
      ref={chartRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-label={ariaLabel || `Line chart with ${series.length} data series`}
      tabIndex={keyboardNavigation ? 0 : -1}
    >
      {/* Title and description */}
      {title && (
        <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p id={descId} className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      {/* Chart container */}
      <div className="w-full" style={{ height: height }}>
        <svg width={width} height={height} className="overflow-visible">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Grid */}
            {showGrid && (
              <g className="opacity-30">
                {/* Horizontal grid lines */}
                {Array.from({ length: 5 }, (_, i) => {
                  const y = (i / 4) * innerHeight;
                  return (
                    <line
                      key={`h-grid-${i}`}
                      x1={0}
                      y1={y}
                      x2={innerWidth}
                      y2={y}
                      stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                      strokeDasharray="3 3"
                    />
                  );
                })}
                {/* Vertical grid lines */}
                {data.map((_, i) => (
                  <line
                    key={`v-grid-${i}`}
                    x1={xScale(i)}
                    y1={0}
                    x2={xScale(i)}
                    y2={innerHeight}
                    stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
                    strokeDasharray="3 3"
                  />
                ))}
              </g>
            )}

            {/* Series */}
            {series.map((seriesData, seriesIndex) => {
              const color = seriesData.color || colors[seriesIndex % colors.length];
              const isArea = seriesData.type === 'area';
              
              return (
                <g key={seriesData.dataKey}>
                  {/* Area fill */}
                  {isArea && (
                    <motion.path
                      d={generatePath(seriesData, true)}
                      fill={color}
                      fillOpacity={seriesData.opacity || 0.3}
                      initial={enableAnimations ? { pathLength: 0 } : {}}
                      animate={isVisible ? { pathLength: 1 } : {}}
                      transition={{
                        duration: animationDuration / 1000,
                        delay: (seriesIndex * staggerDelay) / 1000,
                        ease: 'easeOut'
                      }}
                    />
                  )}
                  
                  {/* Line */}
                  <motion.path
                    d={generatePath(seriesData, false)}
                    fill="none"
                    stroke={color}
                    strokeWidth={seriesData.strokeWidth || 2}
                    strokeDasharray={seriesData.strokeDasharray}
                    initial={enableAnimations ? { pathLength: 0 } : {}}
                    animate={isVisible ? { pathLength: 1 } : {}}
                    transition={{
                      duration: animationDuration / 1000,
                      delay: (seriesIndex * staggerDelay) / 1000,
                      ease: 'easeOut'
                    }}
                  />
                  
                  {/* Data points */}
                  {data.map((point, pointIndex) => {
                    const value = point[seriesData.dataKey] as number;
                    if (typeof value !== 'number') return null;
                    
                    return (
                      <motion.circle
                        key={`${seriesData.dataKey}-${pointIndex}`}
                        cx={xScale(pointIndex)}
                        cy={yScale(value)}
                        r={4}
                        fill={color}
                        stroke="white"
                        strokeWidth={2}
                        className="cursor-pointer"
                        initial={enableAnimations ? { scale: 0, opacity: 0 } : {}}
                        animate={isVisible ? { scale: 1, opacity: 1 } : {}}
                        whileHover={{ scale: 1.5 }}
                        transition={{
                          duration: 0.3,
                          delay: enableAnimations ? (seriesIndex * staggerDelay + pointIndex * 50) / 1000 : 0
                        }}
                        onClick={() => onDataPointClick?.(point, seriesData.dataKey)}
                        onMouseEnter={() => setHoveredPoint({ data: point, series: seriesData.name })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* Axes */}
            <g>
              {/* X Axis */}
              <line
                x1={0}
                y1={innerHeight}
                x2={innerWidth}
                y2={innerHeight}
                stroke={theme === 'dark' ? '#6b7280' : '#374151'}
                strokeWidth={1}
              />
              
              {/* Y Axis */}
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={innerHeight}
                stroke={theme === 'dark' ? '#6b7280' : '#374151'}
                strokeWidth={1}
              />
              
              {/* X Axis Labels */}
              {data.map((point, index) => (
                <text
                  key={`x-label-${index}`}
                  x={xScale(index)}
                  y={innerHeight + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {formatXAxis ? formatXAxis(point[xDataKey] as string | number) : String(point[xDataKey])}
                </text>
              ))}
              
              {/* Y Axis Labels */}
              {Array.from({ length: 5 }, (_, i) => {
                const value = minValue + (i / 4) * (maxValue - minValue);
                const y = innerHeight - (i / 4) * innerHeight;
                return (
                  <text
                    key={`y-label-${i}`}
                    x={-10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                  >
                    {formatYAxis ? formatYAxis(value) : formatters.number(value)}
                  </text>
                );
              })}
              
              {/* Axis Labels */}
              {xAxisLabel && (
                <text
                  x={innerWidth / 2}
                  y={innerHeight + 50}
                  textAnchor="middle"
                  className="text-sm fill-gray-700 dark:fill-gray-300"
                >
                  {xAxisLabel}
                </text>
              )}
              
              {yAxisLabel && (
                <text
                  x={-40}
                  y={innerHeight / 2}
                  textAnchor="middle"
                  transform={`rotate(-90, -40, ${innerHeight / 2})`}
                  className="text-sm fill-gray-700 dark:fill-gray-300"
                >
                  {yAxisLabel}
                </text>
              )}
            </g>
          </g>
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4">
          {series.map((seriesData, index) => {
            const color = seriesData.color || colors[index % colors.length];
            return (
              <div key={seriesData.dataKey} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {seriesData.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none z-10"
          style={{
            top: '10px',
            right: '10px'
          }}
        >
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {hoveredPoint.series}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {String(hoveredPoint.data[xDataKey])}: {hoveredPoint.data[series.find(s => s.name === hoveredPoint.series)?.dataKey || ''] as number}
          </p>
        </motion.div>
      )}

      {/* Accessibility announcements */}
      {announceData && (
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          Chart contains {data.length} data points across {series.length} series.
        </div>
      )}
    </motion.div>
  );
};

export default AdvancedLineChart;
