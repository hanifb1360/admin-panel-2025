import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { componentVariants, designSystem } from '../../lib/designSystem';

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
  payload: ChartDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  formatTooltip?: (value: number, name: string) => [string, string];
}

interface PieChartProps {
  data: ChartDataPoint[];
  title?: string;
  height?: number;
  className?: string;
  enableAnimation?: boolean;
  enableTooltip?: boolean;
  enableLegend?: boolean;
  colors?: string[];
  formatTooltip?: (value: number, name: string) => [string, string];
  ariaDescription?: string;
  showPercentage?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
];

interface CustomLabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabelProps) => {
  if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) {
    return null;
  }

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
      className="drop-shadow-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChart({
  data,
  title,
  height = 300,
  className,
  enableAnimation = true,
  enableTooltip = true,
  enableLegend = true,
  colors = DEFAULT_COLORS,
  formatTooltip,
  ariaDescription,
  showPercentage = true,
  innerRadius = 0,
  outerRadius = 80
}: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Add colors to data if not provided (memoized for performance)
  const dataWithColors = useMemo(() => data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length]
  })), [data, colors]);

  // Memoized custom tooltip to prevent unnecessary re-renders
  const MemoizedCustomTooltip = useCallback(({ active, payload, formatTooltip }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const [value, name] = formatTooltip 
        ? formatTooltip(data.value, data.name)
        : [data.value.toString(), data.name];

      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className={cn(
            componentVariants.card.default,
            'p-3 shadow-lg border-0',
            'bg-white dark:bg-gray-800',
            'ring-1 ring-gray-200 dark:ring-gray-700'
          )}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: data.color }}
              aria-hidden="true"
            />
            <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.primary)}>
              {name}: {value}
            </span>
          </div>
        </motion.div>
      );
    }
    return null;
  }, []);

  // Intersection Observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const chartId = React.useId();
  const titleId = title ? `${chartId}-title` : undefined;
  const descId = ariaDescription ? `${chartId}-desc` : undefined;

  return (
    <motion.div
      ref={chartRef}
      className={cn(componentVariants.card.default, 'overflow-hidden', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      tabIndex={0}
    >
      {title && (
        <div className="mb-4">
          <h3 
            id={titleId}
            className={cn(designSystem.typography.heading.lg, designSystem.colors.text.primary)}
          >
            {title}
          </h3>
          {ariaDescription && (
            <p id={descId} className="sr-only">
              {ariaDescription}
            </p>
          )}
        </div>
      )}
      
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={dataWithColors}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={showPercentage ? CustomLabel : false}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey="value"
              animationBegin={enableAnimation ? 0 : undefined}
              animationDuration={enableAnimation ? 1000 : 0}
              animationEasing="ease-out"
            >
              {dataWithColors.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
              ))}
            </Pie>
            
            {enableTooltip && (
              <Tooltip
                content={<MemoizedCustomTooltip formatTooltip={formatTooltip} />}
              />
            )}
            
            {enableLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="circle"
              />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
