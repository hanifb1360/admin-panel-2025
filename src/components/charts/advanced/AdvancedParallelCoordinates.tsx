import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { chartColors, chartA11yConfig } from '../index';

interface ParallelCoordinatesData {
  id: string | number;
  values: { [key: string]: number };
  category?: string;
  color?: string;
  [key: string]: unknown;
}

interface ParallelCoordinatesProps {
  data: ParallelCoordinatesData[];
  dimensions: string[];
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
  onLineClick?: (data: ParallelCoordinatesData) => void;
  onLineHover?: (data: ParallelCoordinatesData) => void;
  showTooltip?: boolean;
  
  // Style options
  showAxes?: boolean;
  showLabels?: boolean;
  lineOpacity?: number;
  strokeWidth?: number;
  
  // Data formatting
  formatValue?: (value: number, dimension: string) => string;
  formatTooltip?: (data: ParallelCoordinatesData) => string;
}

interface ScaleConfig {
  dimension: string;
  min: number;
  max: number;
  scale: (value: number) => number;
}

const AdvancedParallelCoordinates: React.FC<ParallelCoordinatesProps> = ({
  data,
  dimensions,
  width = 800,
  height = 500,
  className,
  animationDuration = 1500,
  staggerDelay = 100,
  enableAnimations = true,
  title,
  description,
  ariaLabel,
  keyboardNavigation = true,
  announceData = true,
  highContrast = false,
  onLineClick,
  onLineHover,
  showTooltip = true,
  showAxes = true,
  showLabels = true,
  lineOpacity = 0.7,
  strokeWidth = 2,
  formatValue = (value: number) => value.toString()
  // formatTooltip - reserved for future use
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredLine, setHoveredLine] = useState<ParallelCoordinatesData | null>(null);
  const [focusedLineIndex, setFocusedLineIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const chartRef = useRef<HTMLDivElement>(null);

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

  // Calculate dimensions
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales for each dimension
  const scales: ScaleConfig[] = dimensions.map(dimension => {
    const values = data.map(d => d.values[dimension]).filter(v => v !== undefined);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    return {
      dimension,
      min,
      max,
      scale: (value: number) => {
        if (range === 0) return chartHeight / 2;
        return chartHeight - ((value - min) / range) * chartHeight;
      }
    };
  });

  // Calculate x position for each dimension
  const xStep = chartWidth / (dimensions.length - 1);
  const getXPosition = (dimensionIndex: number) => margin.left + dimensionIndex * xStep;

  // Generate path for a data line
  const generateLinePath = (dataItem: ParallelCoordinatesData): string => {
    const points = dimensions.map((dimension, index) => {
      const x = getXPosition(index);
      const scale = scales.find(s => s.dimension === dimension);
      const y = margin.top + (scale ? scale.scale(dataItem.values[dimension]) : 0);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    return points.join(' ');
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

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;

    const totalLines = data.length;
    let newIndex = focusedLineIndex;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (focusedLineIndex + 1) % totalLines;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = (focusedLineIndex - 1 + totalLines) % totalLines;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalLines - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedLineIndex >= 0 && onLineClick) {
          onLineClick(data[focusedLineIndex]);
        }
        break;
      default:
        return;
    }

    if (newIndex !== focusedLineIndex) {
      setFocusedLineIndex(newIndex);
      const dataItem = data[newIndex];
      if (announceData && dataItem) {
        const values = dimensions.map(dim => `${dim}: ${formatValue(dataItem.values[dim], dim)}`).join(', ');
        setAnnouncement(`Line ${newIndex + 1}, ${values}`);
      }
    }
  }, [keyboardNavigation, focusedLineIndex, data, onLineClick, announceData, dimensions, formatValue]);

  // Handle line interactions
  const handleLineClick = (dataItem: ParallelCoordinatesData) => {
    onLineClick?.(dataItem);
    setFocusedLineIndex(data.indexOf(dataItem));
  };

  const handleLineHover = (dataItem: ParallelCoordinatesData, event: React.MouseEvent) => {
    setHoveredLine(dataItem);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    onLineHover?.(dataItem);

    if (announceData) {
      const values = dimensions.map(dim => `${dim}: ${formatValue(dataItem.values[dim], dim)}`).join(', ');
      setAnnouncement(`${values}`);
    }
  };

  const handleLineLeave = () => {
    setHoveredLine(null);
  };

  // Tooltip content (for future use)
  // const getTooltipContent = (dataItem: ParallelCoordinatesData) => {
  //   if (formatTooltip) {
  //     return formatTooltip(dataItem);
  //   }
  //   return dimensions.map(dim => 
  //     `${dim}: ${formatValue(dataItem.values[dim], dim)}`
  //   ).join('\n');
  // };

  // Get line color
  const getLineColor = (dataItem: ParallelCoordinatesData, index: number) => {
    if (dataItem.color) return dataItem.color;
    if (dataItem.category) {
      const categories = Array.from(new Set(data.map(d => d.category)));
      const categoryIndex = categories.indexOf(dataItem.category);
      return colors[categoryIndex % colors.length];
    }
    return colors[index % colors.length];
  };

  return (
    <div
      ref={chartRef}
      className={cn(
        'relative chart-container chart-focus-ring',
        highContrast && 'chart-high-contrast',
        className
      )}
      style={{ width, height }}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-label={ariaLabel || `Parallel coordinates chart showing ${data.length} data points across ${dimensions.length} dimensions`}
      tabIndex={keyboardNavigation ? 0 : -1}
      onKeyDown={handleKeyDown}
    >
      {title && (
        <h3 id={titleId} className="chart-axis-label mb-4 text-lg font-semibold">
          {title}
        </h3>
      )}
      
      {description && (
        <p id={descId} className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
      )}

      <motion.div
        className="relative w-full h-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        initial={enableAnimations ? { opacity: 0, scale: 0.95 } : false}
        animate={isVisible ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: animationDuration / 1000, ease: 'easeOut' }}
      >
        <svg width="100%" height="100%" className="overflow-visible">
          <defs>
            <filter id={`glow-${chartId}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Axes */}
          {showAxes && dimensions.map((dimension, index) => {
            const x = getXPosition(index);
            const scale = scales[index];
            
            return (
              <motion.g
                key={`axis-${dimension}`}
                initial={enableAnimations ? { opacity: 0, y: 20 } : false}
                animate={isVisible ? { opacity: 1, y: 0 } : false}
                transition={{
                  duration: 0.5,
                  delay: enableAnimations ? index * 0.1 : 0,
                  ease: 'easeOut'
                }}
              >
                {/* Axis line */}
                <line
                  x1={x}
                  y1={margin.top}
                  x2={x}
                  y2={height - margin.bottom}
                  stroke="currentColor"
                  strokeWidth={1}
                  className="chart-grid-line"
                />
                
                {/* Axis label */}
                {showLabels && (
                  <text
                    x={x}
                    y={margin.top - 10}
                    textAnchor="middle"
                    className="chart-axis-label font-medium text-sm"
                  >
                    {dimension}
                  </text>
                )}
                
                {/* Scale labels */}
                <text
                  x={x - 5}
                  y={margin.top + 5}
                  textAnchor="end"
                  className="chart-axis-label text-xs"
                >
                  {formatValue(scale.max, dimension)}
                </text>
                <text
                  x={x - 5}
                  y={height - margin.bottom - 5}
                  textAnchor="end"
                  className="chart-axis-label text-xs"
                >
                  {formatValue(scale.min, dimension)}
                </text>
              </motion.g>
            );
          })}

          {/* Data lines */}
          {data.map((dataItem, index) => {
            const isHovered = hoveredLine === dataItem;
            const isFocused = focusedLineIndex === index;
            const lineColor = getLineColor(dataItem, index);
            
            return (
              <motion.path
                key={`line-${dataItem.id || index}`}
                d={generateLinePath(dataItem)}
                fill="none"
                stroke={lineColor}
                strokeWidth={isHovered || isFocused ? strokeWidth + 1 : strokeWidth}
                strokeOpacity={isHovered || isFocused ? 1 : lineOpacity}
                filter={isHovered || isFocused ? `url(#glow-${chartId})` : undefined}
                className={cn(
                  'transition-all duration-200 cursor-pointer',
                  isFocused && 'filter-none'
                )}
                initial={enableAnimations ? { 
                  pathLength: 0,
                  opacity: 0
                } : false}
                animate={isVisible ? { 
                  pathLength: 1,
                  opacity: isHovered || isFocused ? 1 : lineOpacity
                } : false}
                transition={{
                  duration: animationDuration / 1000,
                  delay: enableAnimations ? index * (staggerDelay / 1000) : 0,
                  ease: 'easeOut'
                }}
                onClick={() => handleLineClick(dataItem)}
                onMouseEnter={(e) => handleLineHover(dataItem, e)}
                onMouseLeave={handleLineLeave}
                role="button"
                tabIndex={-1}
                aria-label={`Data line ${index + 1}: ${dimensions.map(dim => `${dim} ${formatValue(dataItem.values[dim], dim)}`).join(', ')}`}
              />
            );
          })}

          {/* Data points on hover */}
          {hoveredLine && dimensions.map((dimension, dimIndex) => {
            const x = getXPosition(dimIndex);
            const scale = scales[dimIndex];
            const y = margin.top + scale.scale(hoveredLine.values[dimension]);
            const lineColor = getLineColor(hoveredLine, data.indexOf(hoveredLine));
            
            return (
              <motion.circle
                key={`point-${dimension}`}
                cx={x}
                cy={y}
                r={4}
                fill={lineColor}
                stroke="#fff"
                strokeWidth={2}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && hoveredLine && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: tooltipPosition.x + 10,
                top: tooltipPosition.y - 10
              }}
            >
              <div className="chart-tooltip max-w-xs">
                <div className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Data Point {data.indexOf(hoveredLine) + 1}
                </div>
                {dimensions.map(dimension => (
                  <div key={dimension} className="text-sm text-gray-600 dark:text-gray-400">
                    {dimension}: {formatValue(hoveredLine.values[dimension], dimension)}
                  </div>
                ))}
                {hoveredLine.category && (
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Category: {hoveredLine.category}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  );
};

export default AdvancedParallelCoordinates;
