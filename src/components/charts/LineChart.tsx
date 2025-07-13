import React, { useRef, useEffect } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { componentVariants, designSystem } from '../../lib/designSystem';

interface ChartDataPoint {
  [key: string]: string | number;
}

interface TooltipPayload {
  value: string | number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatTooltip?: (value: string | number, name: string) => [string, string];
}

interface LineChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKeys: Array<{
    key: string;
    color: string;
    name: string;
    strokeWidth?: number;
  }>;
  title?: string;
  height?: number;
  className?: string;
  enableAnimation?: boolean;
  enableGrid?: boolean;
  enableTooltip?: boolean;
  enableLegend?: boolean;
  formatTooltip?: (value: string | number, name: string) => [string, string];
  ariaDescription?: string;
}

const CustomTooltip = ({ active, payload, label, formatTooltip }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
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
        <p className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
          {label}
        </p>
        {payload.map((entry: TooltipPayload, index: number) => {
          const [value, name] = formatTooltip 
            ? formatTooltip(entry.value, entry.name)
            : [entry.value, entry.name];
          
          return (
            <div key={index} className="flex items-center gap-2 mt-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.primary)}>
                {name}: {value}
              </span>
            </div>
          );
        })}
      </motion.div>
    );
  }
  return null;
};

export default function LineChart({
  data,
  xKey,
  yKeys,
  title,
  height = 300,
  className,
  enableAnimation = true,
  enableGrid = true,
  enableTooltip = true,
  enableLegend = true,
  formatTooltip,
  ariaDescription
}: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

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
          <RechartsLineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            {enableGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
                opacity={0.5}
              />
            )}
            
            <XAxis
              dataKey={xKey}
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            
            {enableTooltip && (
              <Tooltip
                content={<CustomTooltip formatTooltip={formatTooltip} />}
                cursor={{ stroke: 'rgb(99 102 241)', strokeWidth: 2, strokeOpacity: 0.5 }}
              />
            )}
            
            {enableLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="line"
              />
            )}
            
            {yKeys.map((yKey, index) => (
              <Line
                key={yKey.key}
                type="monotone"
                dataKey={yKey.key}
                stroke={yKey.color}
                strokeWidth={yKey.strokeWidth || 3}
                name={yKey.name}
                dot={{ 
                  fill: yKey.color, 
                  strokeWidth: 2, 
                  r: 4,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: 6, 
                  stroke: yKey.color,
                  strokeWidth: 2,
                  fill: '#fff'
                }}
                animationBegin={enableAnimation ? index * 200 : 0}
                animationDuration={enableAnimation ? 1500 : 0}
                animationEasing="ease-out"
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
