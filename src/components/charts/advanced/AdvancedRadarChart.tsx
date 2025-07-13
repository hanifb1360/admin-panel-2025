import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { chartColors, chartA11yConfig } from '../index';

interface RadarData {
  subject: string;
  value: number;
  fullMark?: number;
  [key: string]: unknown;
}

interface RadarDataset {
  name: string;
  data: RadarData[];
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
}

interface AdvancedRadarChartProps {
  datasets: RadarDataset[];
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
  onDataPointClick?: (data: RadarData, dataset: string) => void;
  onDataPointHover?: (data: RadarData, dataset: string) => void;
  showTooltip?: boolean;
  
  // Style options
  showGrid?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  gridLevels?: number;
  maxValue?: number;
  
  // Data formatting
  formatValue?: (value: number) => string;
  formatTooltip?: (data: RadarData, dataset: string) => string;
}

interface Point {
  x: number;
  y: number;
}

const AdvancedRadarChart: React.FC<AdvancedRadarChartProps> = ({
  datasets,
  width = 500,
  height = 500,
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
  onDataPointHover,
  showTooltip = true,
  showGrid = true,
  showLabels = true,
  showLegend = true,
  gridLevels = 5,
  maxValue,
  formatValue = (value: number) => value.toString()
  // formatTooltip - reserved for future use
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{
    data: RadarData;
    dataset: string;
    position: Point;
  } | null>(null);
  const [focusedDatasetIndex, setFocusedDatasetIndex] = useState(0);
  const [focusedPointIndex, setFocusedPointIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const chartRef = useRef<HTMLDivElement>(null);

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

  // Calculate dimensions
  const margin = 80;
  const radius = Math.min(width, height) / 2 - margin;
  const centerX = width / 2;
  const centerY = height / 2;

  // Get all subjects and calculate max value
  const subjects = datasets[0]?.data.map(item => item.subject) || [];
  const calculatedMaxValue = maxValue || Math.max(
    ...datasets.flatMap(dataset => 
      dataset.data.map(item => item.fullMark || item.value)
    )
  );

  // Calculate angle for each subject
  const angleStep = (2 * Math.PI) / subjects.length;

  // Convert polar to cartesian coordinates
  const polarToCartesian = (angle: number, radius: number): Point => ({
    x: centerX + radius * Math.cos(angle - Math.PI / 2),
    y: centerY + radius * Math.sin(angle - Math.PI / 2)
  });

  // Calculate points for a dataset
  const calculateDatasetPoints = (dataset: RadarDataset): Point[] => {
    return dataset.data.map((item, index) => {
      const angle = index * angleStep;
      const value = item.value;
      const normalizedRadius = (value / calculatedMaxValue) * radius;
      return polarToCartesian(angle, normalizedRadius);
    });
  };

  // Generate grid lines
  const generateGridLines = (): string[] => {
    const lines: string[] = [];
    
    // Concentric polygons
    for (let level = 1; level <= gridLevels; level++) {
      const levelRadius = (radius * level) / gridLevels;
      const points = subjects.map((_, index) => {
        const angle = index * angleStep;
        return polarToCartesian(angle, levelRadius);
      });
      
      const pathData = points.map((point, index) => 
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
      ).join(' ') + ' Z';
      
      lines.push(pathData);
    }
    
    return lines;
  };

  // Generate axis lines
  const generateAxisLines = (): Point[][] => {
    return subjects.map((_, index) => {
      const angle = index * angleStep;
      return [
        { x: centerX, y: centerY },
        polarToCartesian(angle, radius)
      ];
    });
  };

  // Generate path for dataset
  const generateDatasetPath = (dataset: RadarDataset): string => {
    const points = calculateDatasetPoints(dataset);
    return points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ') + ' Z';
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

    const totalDatasets = datasets.length;
    const totalPoints = subjects.length;
    let newDatasetIndex = focusedDatasetIndex;
    let newPointIndex = focusedPointIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newPointIndex = (focusedPointIndex + 1) % totalPoints;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newPointIndex = (focusedPointIndex - 1 + totalPoints) % totalPoints;
        break;
      case 'ArrowDown':
        event.preventDefault();
        newDatasetIndex = (focusedDatasetIndex + 1) % totalDatasets;
        break;
      case 'ArrowUp':
        event.preventDefault();
        newDatasetIndex = (focusedDatasetIndex - 1 + totalDatasets) % totalDatasets;
        break;
      case 'Home':
        event.preventDefault();
        newPointIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newPointIndex = totalPoints - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedPointIndex >= 0 && onDataPointClick) {
          const dataset = datasets[focusedDatasetIndex];
          const dataPoint = dataset.data[focusedPointIndex];
          onDataPointClick(dataPoint, dataset.name);
        }
        break;
      default:
        return;
    }

    if (newDatasetIndex !== focusedDatasetIndex || newPointIndex !== focusedPointIndex) {
      setFocusedDatasetIndex(newDatasetIndex);
      setFocusedPointIndex(newPointIndex);
      
      if (announceData && newPointIndex >= 0) {
        const dataset = datasets[newDatasetIndex];
        const dataPoint = dataset.data[newPointIndex];
        const value = formatValue(dataPoint.value);
        setAnnouncement(`${dataset.name}, ${dataPoint.subject}: ${value}`);
      }
    }
  }, [keyboardNavigation, focusedDatasetIndex, focusedPointIndex, datasets, subjects.length, onDataPointClick, announceData, formatValue]);

  // Handle point interactions
  const handlePointHover = (data: RadarData, dataset: string, position: Point) => {
    setHoveredPoint({ data, dataset, position });
    onDataPointHover?.(data, dataset);

    if (announceData) {
      const value = formatValue(data.value);
      setAnnouncement(`${dataset}, ${data.subject}: ${value}`);
    }
  };

  const handlePointLeave = () => {
    setHoveredPoint(null);
  };

  const handlePointClick = (data: RadarData, dataset: string) => {
    onDataPointClick?.(data, dataset);
  };

  // Tooltip content (for future use)
  // const getTooltipContent = (data: RadarData, dataset: string) => {
  //   if (formatTooltip) {
  //     return formatTooltip(data, dataset);
  //   }
  //   return `${dataset}\n${data.subject}: ${formatValue(data.value)}`;
  // };

  return (
    <div
      ref={chartRef}
      className={cn(
        'relative chart-container chart-focus-ring',
        highContrast && 'chart-high-contrast',
        className
      )}
      style={{ width, height: height + (showLegend ? 60 : 0) }}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-label={ariaLabel || `Radar chart showing ${datasets.length} datasets across ${subjects.length} categories`}
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
        className="relative"
        initial={enableAnimations ? { opacity: 0, scale: 0.9 } : false}
        animate={isVisible ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: animationDuration / 1000, ease: 'easeOut' }}
      >
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            {datasets.map((dataset, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`radar-gradient-${chartId}-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={dataset.color || colors[index % colors.length]}
                  stopOpacity={dataset.fillOpacity || 0.3}
                />
                <stop
                  offset="100%"
                  stopColor={dataset.color || colors[index % colors.length]}
                  stopOpacity={(dataset.fillOpacity || 0.3) * 0.5}
                />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {showGrid && (
            <g className="chart-grid-line">
              {generateGridLines().map((path, index) => (
                <motion.path
                  key={`grid-${index}`}
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeOpacity={0.2}
                  initial={enableAnimations ? { pathLength: 0 } : false}
                  animate={isVisible ? { pathLength: 1 } : false}
                  transition={{
                    duration: animationDuration / 1000,
                    delay: enableAnimations ? index * 0.1 : 0,
                    ease: 'easeOut'
                  }}
                />
              ))}
              
              {/* Axis lines */}
              {generateAxisLines().map((line, index) => (
                <motion.line
                  key={`axis-${index}`}
                  x1={line[0].x}
                  y1={line[0].y}
                  x2={line[1].x}
                  y2={line[1].y}
                  stroke="currentColor"
                  strokeWidth={1}
                  strokeOpacity={0.3}
                  initial={enableAnimations ? { pathLength: 0 } : false}
                  animate={isVisible ? { pathLength: 1 } : false}
                  transition={{
                    duration: animationDuration / 1000,
                    delay: enableAnimations ? index * 0.05 : 0,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </g>
          )}

          {/* Dataset areas */}
          {datasets.map((dataset, datasetIndex) => (
            <motion.g key={`dataset-${datasetIndex}`}>
              <motion.path
                d={generateDatasetPath(dataset)}
                fill={`url(#radar-gradient-${chartId}-${datasetIndex})`}
                stroke={dataset.color || colors[datasetIndex % colors.length]}
                strokeWidth={dataset.strokeWidth || 2}
                initial={enableAnimations ? { 
                  pathLength: 0,
                  opacity: 0
                } : false}
                animate={isVisible ? { 
                  pathLength: 1,
                  opacity: 1
                } : false}
                transition={{
                  duration: animationDuration / 1000,
                  delay: enableAnimations ? datasetIndex * (staggerDelay / 1000) : 0,
                  ease: 'easeOut'
                }}
              />
              
              {/* Data points */}
              {calculateDatasetPoints(dataset).map((point, pointIndex) => (
                <motion.circle
                  key={`point-${datasetIndex}-${pointIndex}`}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  fill={dataset.color || colors[datasetIndex % colors.length]}
                  stroke="#fff"
                  strokeWidth={2}
                  className={cn(
                    'cursor-pointer transition-all duration-200',
                    'hover:r-6 hover:stroke-blue-500',
                    focusedDatasetIndex === datasetIndex && focusedPointIndex === pointIndex && 
                    'ring-2 ring-blue-500 ring-offset-2'
                  )}
                  initial={enableAnimations ? { 
                    scale: 0,
                    opacity: 0
                  } : false}
                  animate={isVisible ? { 
                    scale: 1,
                    opacity: 1
                  } : false}
                  transition={{
                    duration: 0.3,
                    delay: enableAnimations ? (datasetIndex * staggerDelay + pointIndex * 100) / 1000 : 0,
                    ease: 'easeOut'
                  }}
                  onClick={() => handlePointClick(dataset.data[pointIndex], dataset.name)}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handlePointHover(
                      dataset.data[pointIndex], 
                      dataset.name,
                      { x: rect.left + rect.width / 2, y: rect.top }
                    );
                  }}
                  onMouseLeave={handlePointLeave}
                  role="button"
                  tabIndex={-1}
                  aria-label={`${dataset.name}, ${dataset.data[pointIndex].subject}: ${formatValue(dataset.data[pointIndex].value)}`}
                />
              ))}
            </motion.g>
          ))}

          {/* Labels */}
          {showLabels && subjects.map((subject, index) => {
            const angle = index * angleStep;
            const labelPoint = polarToCartesian(angle, radius + 20);
            
            return (
              <motion.text
                key={`label-${index}`}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={cn(
                  'text-sm font-medium chart-axis-label',
                  highContrast && 'fill-black dark:fill-white'
                )}
                initial={enableAnimations ? { opacity: 0 } : false}
                animate={isVisible ? { opacity: 1 } : false}
                transition={{
                  duration: 0.5,
                  delay: enableAnimations ? 0.5 + index * 0.1 : 0,
                  ease: 'easeOut'
                }}
              >
                {subject}
              </motion.text>
            );
          })}
        </svg>

        {/* Legend */}
        {showLegend && (
          <motion.div
            className="chart-legend mt-4"
            initial={enableAnimations ? { opacity: 0, y: 20 } : false}
            animate={isVisible ? { opacity: 1, y: 0 } : false}
            transition={{
              duration: 0.5,
              delay: enableAnimations ? 1 : 0,
              ease: 'easeOut'
            }}
          >
            {datasets.map((dataset, index) => (
              <div key={`legend-${index}`} className="chart-legend-item">
                <div
                  className="chart-legend-color"
                  style={{ backgroundColor: dataset.color || colors[index % colors.length] }}
                />
                <span>{dataset.name}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && hoveredPoint && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: hoveredPoint.position.x,
                top: hoveredPoint.position.y - 10
              }}
            >
              <div className="chart-tooltip max-w-xs">
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {hoveredPoint.dataset}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {hoveredPoint.data.subject}: {formatValue(hoveredPoint.data.value)}
                </div>
                {hoveredPoint.data.fullMark && (
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Max: {formatValue(hoveredPoint.data.fullMark)}
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

export default AdvancedRadarChart;
