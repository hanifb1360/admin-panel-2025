import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { chartColors, chartA11yConfig } from './index';

interface TreemapData {
  name: string;
  value: number;
  color?: string;
  children?: TreemapData[];
  [key: string]: unknown;
}

interface AdvancedTreemapProps {
  data: TreemapData[];
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
  onNodeClick?: (data: TreemapData) => void;
  onNodeHover?: (data: TreemapData) => void;
  showTooltip?: boolean;
  
  // Style options
  showLabels?: boolean;
  minNodeSize?: number;
  padding?: number;
  borderRadius?: number;
  
  // Data formatting
  formatValue?: (value: number) => string;
  formatTooltip?: (data: TreemapData) => string;
}

interface TreemapNode extends TreemapData {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
}

const AdvancedTreemap: React.FC<AdvancedTreemapProps> = ({
  data,
  width = 800,
  height = 600,
  className,
  animationDuration = 1200,
  staggerDelay = 100,
  enableAnimations = true,
  title,
  description,
  ariaLabel,
  keyboardNavigation = true,
  announceData = true,
  highContrast = false,
  onNodeClick,
  onNodeHover,
  showTooltip = true,
  showLabels = true,
  minNodeSize = 10,
  padding = 2,
  borderRadius = 4,
  formatValue = (value: number) => value.toString(),
  formatTooltip
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<TreemapNode | null>(null);
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(-1);
  const [nodes, setNodes] = useState<TreemapNode[]>([]);
  const [announcement, setAnnouncement] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const treemapRef = useRef<HTMLDivElement>(null);

  // Color palette selection
  const colors = highContrast ? chartA11yConfig.highContrastColors : chartColors.mixed;

  // Treemap layout algorithm (simple squarified)
  const calculateTreemapLayout = useCallback((data: TreemapData[], x: number, y: number, width: number, height: number, depth = 0): TreemapNode[] => {
    if (!data.length) return [];
    
    const totalValue = data.reduce((sum, d) => sum + d.value, 0);
    const nodes: TreemapNode[] = [];
    
    let currentY = y;
    let remainingHeight = height;
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const proportion = item.value / totalValue;
      const nodeHeight = Math.max(minNodeSize, remainingHeight * proportion);
      
      nodes.push({
        ...item,
        x: x + padding,
        y: currentY + padding,
        width: width - 2 * padding,
        height: nodeHeight - 2 * padding,
        depth
      });
      
      currentY += nodeHeight;
      remainingHeight -= nodeHeight;
    }
    
    return nodes;
  }, [minNodeSize, padding]);

  // Generate nodes from data
  useEffect(() => {
    const generatedNodes = calculateTreemapLayout(data, 0, 0, width, height);
    setNodes(generatedNodes);
  }, [data, width, height, calculateTreemapLayout]);

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

    if (treemapRef.current) {
      observer.observe(treemapRef.current);
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

    const totalNodes = nodes.length;
    let newIndex = focusedNodeIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        newIndex = (focusedNodeIndex + 1) % totalNodes;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        newIndex = (focusedNodeIndex - 1 + totalNodes) % totalNodes;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = totalNodes - 1;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedNodeIndex >= 0 && onNodeClick) {
          onNodeClick(nodes[focusedNodeIndex]);
        }
        break;
      default:
        return;
    }

    if (newIndex !== focusedNodeIndex) {
      setFocusedNodeIndex(newIndex);
      const node = nodes[newIndex];
      if (announceData && node) {
        const value = formatValue(node.value);
        setAnnouncement(`${node.name}: ${value}`);
      }
    }
  }, [keyboardNavigation, focusedNodeIndex, nodes, onNodeClick, announceData, formatValue]);

  // Handle node interactions
  const handleNodeClick = (node: TreemapNode) => {
    onNodeClick?.(node);
    setFocusedNodeIndex(nodes.indexOf(node));
  };

  const handleNodeHover = (node: TreemapNode, event: React.MouseEvent) => {
    setHoveredNode(node);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
    onNodeHover?.(node);

    if (announceData) {
      const value = formatValue(node.value);
      setAnnouncement(`${node.name}: ${value}`);
    }
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
  };

  // Tooltip content
  const getTooltipContent = (node: TreemapNode) => {
    if (formatTooltip) {
      return formatTooltip(node);
    }
    return `${node.name}: ${formatValue(node.value)}`;
  };

  return (
    <div
      ref={treemapRef}
      className={cn(
        'relative chart-container chart-focus-ring',
        highContrast && 'chart-high-contrast',
        className
      )}
      style={{ width, height }}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      aria-label={ariaLabel || `Treemap chart showing ${data.length} categories`}
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
        className="relative w-full h-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
        initial={enableAnimations ? { opacity: 0, scale: 0.95 } : false}
        animate={isVisible ? { opacity: 1, scale: 1 } : false}
        transition={{ duration: animationDuration / 1000, ease: 'easeOut' }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0"
        >
          <defs>
            {nodes.map((node, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`treemap-gradient-${chartId}-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor={node.color || colors[index % colors.length]}
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={node.color || colors[index % colors.length]}
                  stopOpacity={0.6}
                />
              </linearGradient>
            ))}
          </defs>

          {nodes.map((node, index) => (
            <motion.g
              key={`${node.name}-${index}`}
              initial={enableAnimations ? { 
                opacity: 0, 
                scale: 0.8,
                x: node.x + node.width / 2,
                y: node.y + node.height / 2
              } : false}
              animate={isVisible ? { 
                opacity: 1, 
                scale: 1,
                x: 0,
                y: 0
              } : false}
              transition={{ 
                duration: animationDuration / 1000,
                delay: enableAnimations ? index * (staggerDelay / 1000) : 0,
                ease: 'easeOut'
              }}
              style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
            >
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={`url(#treemap-gradient-${chartId}-${index})`}
                stroke={highContrast ? '#000' : '#fff'}
                strokeWidth={highContrast ? 2 : 1}
                rx={borderRadius}
                ry={borderRadius}
                className={cn(
                  'transition-all duration-200 cursor-pointer',
                  'hover:stroke-blue-500 hover:stroke-2',
                  focusedNodeIndex === index && 'ring-2 ring-blue-500 ring-offset-2'
                )}
                onClick={() => handleNodeClick(node)}
                onMouseEnter={(e) => handleNodeHover(node, e)}
                onMouseLeave={handleNodeLeave}
                role="button"
                tabIndex={-1}
                aria-label={`${node.name}: ${formatValue(node.value)}`}
              />
              
              {showLabels && node.width > 50 && node.height > 20 && (
                <text
                  x={node.x + node.width / 2}
                  y={node.y + node.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={cn(
                    'text-xs font-medium pointer-events-none',
                    highContrast ? 'fill-black' : 'fill-white'
                  )}
                  style={{
                    fontSize: Math.min(12, node.width / 8, node.height / 3)
                  }}
                >
                  <tspan x={node.x + node.width / 2} dy="-0.3em">
                    {node.name}
                  </tspan>
                  <tspan x={node.x + node.width / 2} dy="1.2em">
                    {formatValue(node.value)}
                  </tspan>
                </text>
              )}
            </motion.g>
          ))}
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && hoveredNode && (
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
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  {hoveredNode.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Value: {formatValue(hoveredNode.value)}
                </div>
                {getTooltipContent(hoveredNode) !== `${hoveredNode.name}: ${formatValue(hoveredNode.value)}` && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {getTooltipContent(hoveredNode)}
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

export default AdvancedTreemap;
