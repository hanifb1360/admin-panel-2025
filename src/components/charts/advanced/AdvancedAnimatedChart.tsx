import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { cn } from '../../../lib/utils';
import { chartColors, chartA11yConfig, formatters } from '../index';

interface DataPoint {
  [key: string]: string | number | Date | undefined;
}

interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
  type?: 'line' | 'area' | 'bar';
  strokeDasharray?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
}

interface AdvancedAnimatedChartProps {
  data: DataPoint[];
  series: ChartSeries[];
  chartType?: 'line' | 'area' | 'bar' | 'pie' | 'mixed';
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
  gradientFill?: boolean;
  theme?: 'light' | 'dark';
  
  // Data formatting
  xDataKey?: string;
  formatXAxis?: (value: string | number) => string;
  formatYAxis?: (value: number) => string;
  formatTooltip?: (value: number, name: string) => [string, string];
}

const AdvancedAnimatedChart: React.FC<AdvancedAnimatedChartProps> = ({
  data,
  series,
  chartType = 'line',
  width,
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
  gradientFill = false,
  theme = 'light',
  xDataKey = 'name',
  formatXAxis,
  formatYAxis,
  formatTooltip
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedDataIndex, setFocusedDataIndex] = useState(-1);
  const [focusedSeriesIndex, setFocusedSeriesIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const chartRef = useRef<HTMLDivElement>(null);

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

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

  // Enhanced tooltip component
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      value: number;
      name: string;
      color: string;
      dataKey: string;
    }>;
    label?: string;
  }) => {
    if (!active || !payload || !showTooltip) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          'rounded-lg shadow-lg p-3 max-w-xs'
        )}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
          {label}
        </p>
        {payload.map((entry, index) => {
          const [value, name] = formatTooltip 
            ? formatTooltip(entry.value, entry.name)
            : [formatters.number(entry.value), entry.name];
          
          return (
            <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {name}: <span className="font-medium">{value}</span>
              </span>
            </div>
          );
        })}
      </motion.div>
    );
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;

    const totalData = data.length;
    const totalSeries = series.length;
    let newDataIndex = focusedDataIndex;
    let newSeriesIndex = focusedSeriesIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newDataIndex = Math.min(focusedDataIndex + 1, totalData - 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newDataIndex = Math.max(focusedDataIndex - 1, 0);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newSeriesIndex = Math.max(focusedSeriesIndex - 1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newSeriesIndex = Math.min(focusedSeriesIndex + 1, totalSeries - 1);
        break;
      case 'Home':
        event.preventDefault();
        newDataIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newDataIndex = totalData - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedDataIndex >= 0 && onDataPointClick) {
          const point = data[focusedDataIndex];
          const seriesKey = series[focusedSeriesIndex]?.dataKey;
          onDataPointClick(point, seriesKey);
        }
        break;
    }

    if (newDataIndex !== focusedDataIndex || newSeriesIndex !== focusedSeriesIndex) {
      setFocusedDataIndex(newDataIndex);
      setFocusedSeriesIndex(newSeriesIndex);
      
      if (announceData && newDataIndex >= 0) {
        const point = data[newDataIndex];
        const seriesData = series[newSeriesIndex];
        const value = point[seriesData.dataKey];
        const announcement = `${seriesData.name}: ${value} at ${point[xDataKey]}. Data point ${newDataIndex + 1} of ${totalData}.`;
        setAnnouncement(announcement);
      }
    }
  }, [keyboardNavigation, focusedDataIndex, focusedSeriesIndex, data, series, onDataPointClick, announceData, xDataKey]);

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    const renderSeries = () => {
      return series.map((s, index) => {
        const color = s.color || colors[index % colors.length];
        const seriesProps = {
          key: s.dataKey,
          dataKey: s.dataKey,
          name: s.name,
          stroke: color,
          fill: s.fill || color,
          strokeWidth: s.strokeWidth || 2,
          strokeDasharray: s.strokeDasharray,
          animationDuration: enableAnimations ? animationDuration + (index * staggerDelay) : 0,
          dot: { 
            fill: color, 
            strokeWidth: 2,
            r: focusedDataIndex >= 0 ? 6 : 4
          },
          activeDot: { 
            r: 8, 
            stroke: color,
            strokeWidth: 3,
            fill: 'white'
          }
        };

        switch (chartType) {
          case 'area':
            return (
              <Area
                {...seriesProps}
                fill={gradientFill ? `url(#gradient${index})` : color}
                fillOpacity={s.opacity || 0.6}
              />
            );
          case 'bar':
            return (
              <Bar
                {...seriesProps}
                fill={color}
              />
            );
          case 'line':
          default:
            return (
              <Line
                {...seriesProps}
                type="monotone"
                connectNulls={false}
              />
            );
        }
      });
    };

    switch (chartType) {
      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              dataKey={series[0]?.dataKey || 'value'}
              nameKey={xDataKey}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height, width || 400) / 3}
              animationDuration={enableAnimations ? animationDuration : 0}
              label={({ name, value }) => `${name}: ${formatters.number(value as number)}`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {/* Gradients */}
            <defs>
              {gradientFill && series.map((s, index) => {
                const color = s.color || colors[index % colors.length];
                return (
                  <linearGradient key={index} id={`gradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                  </linearGradient>
                );
              })}
            </defs>
            
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
            )}
            
            <XAxis 
              dataKey={xDataKey}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            
            {renderSeries()}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
            )}
            
            <XAxis 
              dataKey={xDataKey}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            
            {renderSeries()}
          </BarChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-30"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
            )}
            
            <XAxis 
              dataKey={xDataKey}
              tick={{ fontSize: 12 }}
              tickFormatter={formatXAxis}
              label={{ value: xAxisLabel, position: 'insideBottom', offset: -10 }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatYAxis}
              label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
              className="text-gray-600 dark:text-gray-400"
            />
            
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            
            {renderSeries()}
          </LineChart>
        );
    }
  };

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
      aria-label={ariaLabel || `${chartType} chart with ${series.length} data series`}
      tabIndex={keyboardNavigation ? 0 : -1}
      onKeyDown={handleKeyDown}
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
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Screen reader announcements */}
      {announceData && (
        <div 
          aria-live="polite" 
          aria-atomic="true" 
          className="sr-only"
        >
          {announcement}
        </div>
      )}

      {/* Keyboard navigation instructions */}
      <div className="sr-only">
        {keyboardNavigation && (
          <>
            Use arrow keys to navigate data points. 
            Up/Down arrows to switch between series. 
            Enter or Space to select a data point.
            Chart contains {data.length} data points across {series.length} series.
          </>
        )}
      </div>

      {/* Focus indicator */}
      {keyboardNavigation && focusedDataIndex >= 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
        >
          Point {focusedDataIndex + 1}/{data.length}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedAnimatedChart;
