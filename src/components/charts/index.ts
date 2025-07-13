export { default as LineChart } from './LineChart';
export { default as BarChart } from './BarChart';
export { default as PieChart } from './PieChart';
export { default as AreaChart } from './AreaChart';

// Advanced components with animations and accessibility
export { default as AdvancedAnimatedChart } from './advanced/AdvancedAnimatedChart';
export { default as AdvancedHeatmap } from './advanced/AdvancedHeatmap';
export { default as AdvancedChartsDemo } from './advanced/AdvancedChartsDemo';
export { default as AdvancedTreemap } from './advanced/AdvancedTreemap';
export { default as AdvancedRadarChart } from './advanced/AdvancedRadarChart';
export { default as AdvancedParallelCoordinates } from './advanced/AdvancedParallelCoordinates';

// Chart color palettes for consistent theming
export const chartColors = {
  primary: [
    '#3b82f6', // blue-500
    '#1d4ed8', // blue-700
    '#60a5fa', // blue-400
    '#93c5fd', // blue-300
    '#dbeafe', // blue-100
  ],
  secondary: [
    '#6b7280', // gray-500
    '#374151', // gray-700
    '#9ca3af', // gray-400
    '#d1d5db', // gray-300
    '#f3f4f6', // gray-100
  ],
  success: [
    '#10b981', // emerald-500
    '#047857', // emerald-700
    '#34d399', // emerald-400
    '#6ee7b7', // emerald-300
    '#d1fae5', // emerald-100
  ],
  warning: [
    '#f59e0b', // amber-500
    '#d97706', // amber-600
    '#fbbf24', // amber-400
    '#fcd34d', // amber-300
    '#fef3c7', // amber-100
  ],
  danger: [
    '#ef4444', // red-500
    '#dc2626', // red-600
    '#f87171', // red-400
    '#fca5a5', // red-300
    '#fee2e2', // red-100
  ],
  info: [
    '#06b6d4', // cyan-500
    '#0891b2', // cyan-600
    '#22d3ee', // cyan-400
    '#67e8f9', // cyan-300
    '#cffafe', // cyan-100
  ],
  mixed: [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
  ]
};

// Accessibility helpers
export const chartA11yConfig = {
  // Screen reader friendly descriptions
  getAriaDescription: (chartType: string, dataLength: number) => 
    `${chartType} chart with ${dataLength} data points. Use arrow keys to navigate data points.`,
  
  // High contrast mode support
  highContrastColors: [
    '#000000',
    '#ffffff', 
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00',
    '#ff00ff',
    '#00ffff'
  ],
  
  // Color blind friendly palette
  colorBlindFriendly: [
    '#1f77b4', // blue
    '#ff7f0e', // orange
    '#2ca02c', // green
    '#d62728', // red
    '#9467bd', // purple
    '#8c564b', // brown
    '#e377c2', // pink
    '#7f7f7f', // gray
  ]
};

// Common format functions
export const formatters = {
  currency: (value: number) => 
    new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(value),
  
  percentage: (value: number, decimals = 1) => 
    `${value.toFixed(decimals)}%`,
  
  number: (value: number) => 
    new Intl.NumberFormat('en-US').format(value),
  
  shortNumber: (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  },
  
  date: (value: string | Date) => 
    new Date(value).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
};
