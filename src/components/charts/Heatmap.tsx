import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface HeatmapData {
  x: string | number;
  y: string | number;
  value: number;
  label?: string;
  [key: string]: string | number | undefined;
}

interface AdvancedHeatmapProps {
  data: HeatmapData[];
  width?: number;
  height?: number;
  className?: string;
  
  // Color options
  colorScale?: string[];
  minColor?: string;
  maxColor?: string;
  highContrast?: boolean;
  
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
  
  // Interaction options
  onCellClick?: (data: HeatmapData) => void;
  onCellHover?: (data: HeatmapData) => void;
  showTooltip?: boolean;
  
  // Style options
  cellSize?: number;
  cellGap?: number;
  showLabels?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  
  // Data formatting
  formatValue?: (value: number) => string;
  formatTooltip?: (data: HeatmapData) => string;
}

const AdvancedHeatmap: React.FC<AdvancedHeatmapProps> = ({
  data,
  className,
  colorScale,
  minColor = '#e0f2fe',
  maxColor = '#0c4a6e',
  highContrast = false,
  animationDuration = 1000,
  staggerDelay = 50,
  enableAnimations = true,
  title,
  description,
  ariaLabel,
  keyboardNavigation = true,
  announceData = true,
  onCellClick,
  onCellHover,
  showTooltip = true,
  cellSize = 20,
  cellGap = 2,
  showLabels = true,
  showXAxis = true,
  showYAxis = true,
  xAxisLabel,
  yAxisLabel,
  formatValue = (value: number) => value.toString(),
  formatTooltip
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);
  const [focusedCellIndex, setFocusedCellIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const heatmapRef = useRef<HTMLDivElement>(null);

  // Get unique x and y values
  const xValues = Array.from(new Set(data.map(d => d.x))).sort();
  const yValues = Array.from(new Set(data.map(d => d.y))).sort();

  // Get min and max values for color scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

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

    if (heatmapRef.current) {
      observer.observe(heatmapRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Generate chart ID for accessibility
  const chartId = React.useId();
  const titleId = title ? `${chartId}-title` : undefined;
  const descId = description ? `${chartId}-desc` : undefined;

  // Color interpolation function
  const getColor = useCallback((value: number) => {
    if (highContrast) {
      const intensity = (value - minValue) / (maxValue - minValue);
      return intensity > 0.5 ? '#000000' : '#ffffff';
    }

    const intensity = (value - minValue) / (maxValue - minValue);
    
    if (colorScale && colorScale.length > 1) {
      const index = Math.floor(intensity * (colorScale.length - 1));
      return colorScale[Math.min(index, colorScale.length - 1)];
    }

    // Simple linear interpolation between min and max colors
    const minR = parseInt(minColor.slice(1, 3), 16);
    const minG = parseInt(minColor.slice(3, 5), 16);
    const minB = parseInt(minColor.slice(5, 7), 16);
    
    const maxR = parseInt(maxColor.slice(1, 3), 16);
    const maxG = parseInt(maxColor.slice(3, 5), 16);
    const maxB = parseInt(maxColor.slice(5, 7), 16);
    
    const r = Math.round(minR + (maxR - minR) * intensity);
    const g = Math.round(minG + (maxG - minG) * intensity);
    const b = Math.round(minB + (maxB - minB) * intensity);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }, [minValue, maxValue, minColor, maxColor, colorScale, highContrast]);

  // Find data point for given x, y coordinates
  const findDataPoint = useCallback((x: string | number, y: string | number) => {
    return data.find(d => d.x === x && d.y === y);
  }, [data]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!keyboardNavigation) return;

    const totalCells = xValues.length * yValues.length;
    let newIndex = focusedCellIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = Math.min(focusedCellIndex + 1, totalCells - 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = Math.max(focusedCellIndex - 1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newIndex = Math.min(focusedCellIndex + xValues.length, totalCells - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        newIndex = Math.max(focusedCellIndex - xValues.length, 0);
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalCells - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedCellIndex >= 0) {
          const yIndex = Math.floor(focusedCellIndex / xValues.length);
          const xIndex = focusedCellIndex % xValues.length;
          const cellData = findDataPoint(xValues[xIndex], yValues[yIndex]);
          if (cellData && onCellClick) {
            onCellClick(cellData);
          }
        }
        break;
    }

    if (newIndex !== focusedCellIndex) {
      setFocusedCellIndex(newIndex);
      
      if (announceData && newIndex >= 0) {
        const yIndex = Math.floor(newIndex / xValues.length);
        const xIndex = newIndex % xValues.length;
        const cellData = findDataPoint(xValues[xIndex], yValues[yIndex]);
        const announcement = cellData 
          ? `Cell ${xValues[xIndex]}, ${yValues[yIndex]}: ${formatValue(cellData.value)}`
          : `Empty cell ${xValues[xIndex]}, ${yValues[yIndex]}`;
        setAnnouncement(announcement);
      }
    }
  }, [keyboardNavigation, focusedCellIndex, xValues, yValues, findDataPoint, onCellClick, announceData, formatValue]);

  // Mouse interactions
  const handleCellMouseEnter = useCallback((cellData: HeatmapData, event: React.MouseEvent) => {
    setHoveredCell(cellData);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    onCellHover?.(cellData);
  }, [onCellHover]);

  const handleCellMouseLeave = useCallback(() => {
    setHoveredCell(null);
  }, []);

  const handleCellClick = useCallback((cellData: HeatmapData) => {
    onCellClick?.(cellData);
  }, [onCellClick]);

  // Calculate dimensions
  const actualCellSize = cellSize;
  const totalWidth = xValues.length * (actualCellSize + cellGap) - cellGap;
  const totalHeight = yValues.length * (actualCellSize + cellGap) - cellGap;
  const xAxisHeight = showXAxis ? 40 : 0;
  const yAxisWidth = showYAxis ? 80 : 0;

  return (
    <motion.div
      ref={heatmapRef}
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
      aria-label={ariaLabel || `Heatmap with ${data.length} data points`}
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

      {/* Heatmap container */}
      <div className="relative overflow-auto">
        <svg
          width={totalWidth + yAxisWidth}
          height={totalHeight + xAxisHeight}
          className="overflow-visible"
        >
          {/* Y-axis */}
          {showYAxis && (
            <g>
              {yValues.map((y, yIndex) => (
                <text
                  key={`y-${yIndex}`}
                  x={yAxisWidth - 10}
                  y={yIndex * (actualCellSize + cellGap) + actualCellSize / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  fontSize={12}
                  className="fill-gray-600 dark:fill-gray-400"
                >
                  {y}
                </text>
              ))}
              {yAxisLabel && (
                <text
                  x={20}
                  y={totalHeight / 2}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={14}
                  className="fill-gray-800 dark:fill-gray-200 font-medium"
                  transform={`rotate(-90, 20, ${totalHeight / 2})`}
                >
                  {yAxisLabel}
                </text>
              )}
            </g>
          )}

          {/* X-axis */}
          {showXAxis && (
            <g>
              {xValues.map((x, xIndex) => (
                <text
                  key={`x-${xIndex}`}
                  x={yAxisWidth + xIndex * (actualCellSize + cellGap) + actualCellSize / 2}
                  y={totalHeight + 20}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={12}
                  className="fill-gray-600 dark:fill-gray-400"
                >
                  {x}
                </text>
              ))}
              {xAxisLabel && (
                <text
                  x={yAxisWidth + totalWidth / 2}
                  y={totalHeight + 40}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize={14}
                  className="fill-gray-800 dark:fill-gray-200 font-medium"
                >
                  {xAxisLabel}
                </text>
              )}
            </g>
          )}

          {/* Heatmap cells */}
          <g transform={`translate(${yAxisWidth}, 0)`}>
            {yValues.map((y, yIndex) =>
              xValues.map((x, xIndex) => {
                const cellData = findDataPoint(x, y);
                const cellIndex = yIndex * xValues.length + xIndex;
                const isFocused = focusedCellIndex === cellIndex;
                
                if (!cellData) {
                  return (
                    <rect
                      key={`empty-${xIndex}-${yIndex}`}
                      x={xIndex * (actualCellSize + cellGap)}
                      y={yIndex * (actualCellSize + cellGap)}
                      width={actualCellSize}
                      height={actualCellSize}
                      fill="transparent"
                      stroke={isFocused ? '#3b82f6' : '#e5e7eb'}
                      strokeWidth={isFocused ? 2 : 1}
                      className="dark:stroke-gray-600"
                    />
                  );
                }

                return (
                  <motion.rect
                    key={`cell-${xIndex}-${yIndex}`}
                    x={xIndex * (actualCellSize + cellGap)}
                    y={yIndex * (actualCellSize + cellGap)}
                    width={actualCellSize}
                    height={actualCellSize}
                    fill={getColor(cellData.value)}
                    stroke={isFocused ? '#3b82f6' : 'transparent'}
                    strokeWidth={isFocused ? 2 : 0}
                    initial={enableAnimations ? { opacity: 0, scale: 0 } : {}}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      duration: animationDuration / 1000,
                      delay: enableAnimations ? (cellIndex * staggerDelay) / 1000 : 0,
                      ease: 'easeOut'
                    }}
                    className="cursor-pointer hover:stroke-blue-500 hover:stroke-2"
                    onMouseEnter={(e) => handleCellMouseEnter(cellData, e)}
                    onMouseLeave={handleCellMouseLeave}
                    onClick={() => handleCellClick(cellData)}
                  />
                );
              })
            )}

            {/* Cell labels */}
            {showLabels && (
              <g>
                {yValues.map((y, yIndex) =>
                  xValues.map((x, xIndex) => {
                    const cellData = findDataPoint(x, y);
                    if (!cellData) return null;

                    return (
                      <text
                        key={`label-${xIndex}-${yIndex}`}
                        x={xIndex * (actualCellSize + cellGap) + actualCellSize / 2}
                        y={yIndex * (actualCellSize + cellGap) + actualCellSize / 2}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={10}
                        className="fill-gray-900 dark:fill-gray-100 pointer-events-none font-medium"
                        style={{
                          filter: highContrast ? 'invert(1)' : undefined
                        }}
                      >
                        {formatValue(cellData.value)}
                      </text>
                    );
                  })
                )}
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Tooltip */}
      {hoveredCell && showTooltip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="fixed pointer-events-none z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          {formatTooltip ? (
            <div className="text-sm">{formatTooltip(hoveredCell)}</div>
          ) : (
            <>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {hoveredCell.x}, {hoveredCell.y}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Value: {formatValue(hoveredCell.value)}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Color legend */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatValue(minValue)}
        </span>
        <div className="flex h-4 w-32 rounded overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => {
            const value = minValue + (maxValue - minValue) * (i / 19);
            return (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: getColor(value) }}
              />
            );
          })}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatValue(maxValue)}
        </span>
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
            Use arrow keys to navigate cells. 
            Enter or Space to select a cell.
            Heatmap contains {data.length} data points across {xValues.length} columns and {yValues.length} rows.
          </>
        )}
      </div>

      {/* Focus indicator */}
      {keyboardNavigation && focusedCellIndex >= 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded"
        >
          Cell {focusedCellIndex + 1}/{xValues.length * yValues.length}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdvancedHeatmap;
