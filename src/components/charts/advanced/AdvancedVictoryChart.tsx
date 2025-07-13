import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  VictoryChart,
  VictoryBar,
  VictoryLine,
  VictoryArea,
  VictoryAxis,
  VictoryTooltip,
  VictoryLegend,
  VictoryContainer,
  VictoryTheme,
  VictoryScatter
} from 'victory';
import { cn } from '../../../lib/utils';
import { chartColors, chartA11yConfig } from '../index';

interface DataPoint {
  x: string | number | Date;
  y: number;
  label?: string;
  name?: string;
  value?: number;
}

interface ChartSeries {
  name: string;
  data: DataPoint[];
  color?: string;
  type?: 'bar' | 'line' | 'area' | 'scatter';
  animate?: boolean;
}

interface AdvancedVictoryChartProps {
  series: ChartSeries[];
  width?: number;
  height?: number;
  className?: string;
  
  // Accessibility options
  title?: string;
  description?: string;
  ariaLabel?: string;
  highContrast?: boolean;
  
  // Animation options
  animationDuration?: number;
  enableAnimations?: boolean;
  
  // Style options
  showGrid?: boolean;
  showLegend?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  theme?: 'light' | 'dark';
  
  // Interaction options
  onDataPointClick?: (data: DataPoint, series: ChartSeries) => void;
  showTooltip?: boolean;
}

const AdvancedVictoryChart: React.FC<AdvancedVictoryChartProps> = ({
  series,
  width = 600,
  height = 400,
  className,
  title,
  description,
  ariaLabel,
  highContrast = false,
  animationDuration = 1000,
  enableAnimations = true,
  showGrid = true,
  showLegend = true,
  xAxisLabel,
  yAxisLabel,
  theme = 'light',
  showTooltip = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [focusedSeries, setFocusedSeries] = useState<number>(-1);
  const [announcement, setAnnouncement] = useState<string>('');

  // Use intersection observer for entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Generate chart ID for accessibility
  const chartId = React.useId();
  const titleId = title ? `${chartId}-title` : undefined;
  const descId = description ? `${chartId}-desc` : undefined;

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

  // Victory theme
  const victoryTheme = theme === 'dark' ? VictoryTheme.material : VictoryTheme.material;

  // Custom tooltip component
  const CustomTooltip = (props: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) => {
    if (!showTooltip) return null;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        <VictoryTooltip
          {...props}
          style={{
            fill: theme === 'dark' ? '#f9fafb' : '#111827',
            fontSize: 12,
            fontWeight: 500
          }}
          flyoutStyle={{
            fill: theme === 'dark' ? '#374151' : '#ffffff',
            stroke: theme === 'dark' ? '#6b7280' : '#d1d5db',
            strokeWidth: 1
          }}
        />
      </motion.div>
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    const totalSeries = series.length;
    let newIndex = focusedSeries;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = Math.min(focusedSeries + 1, totalSeries - 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = Math.max(focusedSeries - 1, 0);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalSeries - 1;
        break;
    }

    if (newIndex !== focusedSeries) {
      setFocusedSeries(newIndex);
      if (newIndex >= 0) {
        const seriesData = series[newIndex];
        const announcement = `Focused on ${seriesData.name} with ${seriesData.data.length} data points`;
        setAnnouncement(announcement);
      }
    }
  };

  // Render chart components based on series type
  const renderChartComponent = (seriesData: ChartSeries, index: number) => {
    const color = seriesData.color || colors[index % colors.length];
    
    const baseProps = {
      data: seriesData.data,
      animate: enableAnimations && seriesData.animate !== false ? {
        duration: animationDuration,
        onLoad: { duration: animationDuration }
      } : false,
      labelComponent: showTooltip ? <CustomTooltip /> : undefined
    };

    switch (seriesData.type) {
      case 'bar':
        return (
          <VictoryBar 
            key={index} 
            {...baseProps}
            style={{
              data: { 
                fill: color,
                stroke: color,
                strokeWidth: 2,
                fillOpacity: 1
              }
            }}
          />
        );
      case 'area':
        return (
          <VictoryArea 
            key={index} 
            {...baseProps}
            style={{
              data: {
                fill: color,
                stroke: color,
                fillOpacity: 0.3,
                strokeWidth: 3
              }
            }}
          />
        );
      case 'scatter':
        return (
          <VictoryScatter 
            key={index} 
            {...baseProps}
            size={5}
            style={{
              data: { 
                fill: color,
                stroke: theme === 'dark' ? '#ffffff' : '#000000',
                strokeWidth: 1
              }
            }}
          />
        );
      case 'line':
      default:
        return (
          <VictoryLine 
            key={index} 
            {...baseProps}
            style={{
              data: { 
                stroke: color,
                strokeWidth: 3
              }
            }}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6',
        className
      )}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-label={ariaLabel || `Chart with ${series.length} data series`}
      tabIndex={0}
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

      {/* Chart */}
      <div className="w-full overflow-hidden">
        <VictoryChart
          theme={victoryTheme}
          width={width}
          height={height}
          containerComponent={
            <VictoryContainer 
              responsive={true}
              style={{
                touchAction: 'auto'
              }}
            />
          }
          padding={{ left: 80, top: 20, right: 80, bottom: 80 }}
        >
          {/* Grid */}
          {showGrid && (
            <>
              <VictoryAxis
                dependentAxis
                style={{
                  grid: { 
                    stroke: theme === 'dark' ? '#374151' : '#e5e7eb',
                    strokeWidth: 1
                  },
                  axis: { stroke: 'transparent' },
                  tickLabels: {
                    fill: theme === 'dark' ? '#d1d5db' : '#374151',
                    fontSize: 12
                  },
                  axisLabel: {
                    fill: theme === 'dark' ? '#d1d5db' : '#374151',
                    fontSize: 14,
                    padding: 40
                  }
                }}
                label={yAxisLabel}
              />
              <VictoryAxis
                style={{
                  grid: { 
                    stroke: theme === 'dark' ? '#374151' : '#e5e7eb',
                    strokeWidth: 1
                  },
                  axis: { 
                    stroke: theme === 'dark' ? '#6b7280' : '#d1d5db',
                    strokeWidth: 1
                  },
                  tickLabels: {
                    fill: theme === 'dark' ? '#d1d5db' : '#374151',
                    fontSize: 12,
                    angle: -45
                  },
                  axisLabel: {
                    fill: theme === 'dark' ? '#d1d5db' : '#374151',
                    fontSize: 14,
                    padding: 40
                  }
                }}
                label={xAxisLabel}
              />
            </>
          )}

          {/* Data series */}
          {series.map((seriesData, index) => renderChartComponent(seriesData, index))}

          {/* Legend */}
          {showLegend && (
            <VictoryLegend
              x={width - 150}
              y={20}
              orientation="vertical"
              gutter={20}
              style={{
                border: { stroke: 'transparent' },
                title: { fontSize: 14, fill: theme === 'dark' ? '#d1d5db' : '#374151' },
                labels: { fontSize: 12, fill: theme === 'dark' ? '#d1d5db' : '#374151' }
              }}
              data={series.map((s, index) => ({
                name: s.name,
                symbol: { 
                  fill: s.color || colors[index % colors.length],
                  type: s.type === 'line' ? 'minus' : 'square'
                }
              }))}
            />
          )}
        </VictoryChart>
      </div>

      {/* Screen reader announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Keyboard navigation instructions */}
      <div className="sr-only">
        Use arrow keys to navigate between data series. Press Enter to select a data point.
        Chart contains {series.length} data series: {series.map(s => s.name).join(', ')}.
      </div>
    </motion.div>
  );
};

export default AdvancedVictoryChart;
