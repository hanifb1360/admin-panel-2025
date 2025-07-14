import React, { useRef, useEffect } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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

interface BarChartProps {
  data: ChartDataPoint[];
  xKey: string;
  yKeys: Array<{
    key: string;
    color: string;
    name: string;
  }>;
  title?: string;
  height?: number;
  className?: string;
  enableAnimation?: boolean;
  enableGrid?: boolean;
  enableTooltip?: boolean;
  formatTooltip?: (value: string | number, name: string) => [string, string];
  ariaDescription?: string;
  layout?: 'horizontal' | 'vertical';
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
                className="w-3 h-3 rounded-sm" 
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

export default function BarChart({
  data,
  xKey,
  yKeys,
  title,
  height = 300,
  className,
  enableAnimation = true,
  enableGrid = true,
  enableTooltip = true,
  formatTooltip,
  ariaDescription,
  layout = 'horizontal'
}: BarChartProps) {
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

  if (!data || data.length === 0) {
    return (
      <div className={cn(componentVariants.card.default, 'overflow-hidden', className)}>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

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
          <RechartsBarChart
            data={data}
            layout={layout}
            margin={{ 
              top: 5, 
              right: 30, 
              left: layout === 'horizontal' ? 120 : 20, 
              bottom: 5 
            }}
          >
            {enableGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-gray-200 dark:stroke-gray-700"
                opacity={0.5}
              />
            )}
            
            <XAxis
              type={layout === 'horizontal' ? 'number' : 'category'}
              dataKey={layout === 'horizontal' ? undefined : xKey}
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis
              type={layout === 'horizontal' ? 'category' : 'number'}
              dataKey={layout === 'horizontal' ? xKey : undefined}
              className="text-gray-600 dark:text-gray-400"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dx={-10}
              width={layout === 'horizontal' ? 110 : undefined}
            />
            
            {enableTooltip && (
              <Tooltip
                content={<CustomTooltip formatTooltip={formatTooltip} />}
                cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
              />
            )}
            
            {/* Temporarily disabled legend
            {enableLegend && (
              <Legend
                wrapperStyle={{
                  paddingTop: '20px',
                  fontSize: '14px'
                }}
                iconType="rect"
              />
            )}
            */}
            
            {yKeys.map((yKey, index) => (
              <Bar
                key={yKey.key}
                dataKey={yKey.key}
                name={yKey.name}
                fill={yKey.color}
                radius={layout === 'horizontal' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
                animationBegin={enableAnimation ? index * 100 : 0}
                animationDuration={enableAnimation ? 1000 : 0}
                animationEasing="ease-out"
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
