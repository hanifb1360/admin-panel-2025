import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AdvancedAnimatedChart, 
  AdvancedHeatmap,
  AdvancedTreemap,
  AdvancedRadarChart,
  AdvancedParallelCoordinates,
  chartColors,
  formatters 
} from '../index';
import { cn } from '../../../lib/utils';

const AdvancedChartsDemo: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('line');
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [showTooltips, setShowTooltips] = useState(true);

  // Sample data for different chart types
  const lineData = useMemo(() => [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
    { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
    { name: 'Aug', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Sep', revenue: 3200, expenses: 2100, profit: 1100 },
    { name: 'Oct', revenue: 4100, expenses: 2800, profit: 1300 },
    { name: 'Nov', revenue: 3800, expenses: 2600, profit: 1200 },
    { name: 'Dec', revenue: 4500, expenses: 3200, profit: 1300 }
  ], []);

  const heatmapData = useMemo(() => {
    const data: Array<{ x: number; y: string; value: number; label: string }> = [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    days.forEach(day => {
      hours.forEach(hour => {
        data.push({
          x: hour,
          y: day,
          value: Math.floor(Math.random() * 100) + 1,
          label: `${day} ${hour}:00`
        });
      });
    });
    
    return data;
  }, []);

  const performanceData = useMemo(() => [
    { name: 'Load Time', value: 2.1 },
    { name: 'First Paint', value: 1.4 },
    { name: 'First Contentful Paint', value: 1.8 },
    { name: 'Largest Contentful Paint', value: 2.9 },
    { name: 'Time to Interactive', value: 3.2 },
    { name: 'Cumulative Layout Shift', value: 0.1 }
  ], []);

  const treemapData = useMemo(() => [
    { name: 'Marketing', value: 450000, color: chartColors.primary[0] },
    { name: 'Development', value: 380000, color: chartColors.success[0] },
    { name: 'Sales', value: 320000, color: chartColors.warning[0] },
    { name: 'Support', value: 180000, color: chartColors.info[0] },
    { name: 'Design', value: 120000, color: chartColors.danger[0] },
    { name: 'Operations', value: 95000, color: chartColors.secondary[0] },
    { name: 'HR', value: 75000, color: chartColors.primary[1] },
    { name: 'Finance', value: 60000, color: chartColors.success[1] }
  ], []);

  const radarDatasets = useMemo(() => [
    {
      name: 'Frontend Developer',
      data: [
        { subject: 'React', value: 90, fullMark: 100 },
        { subject: 'TypeScript', value: 85, fullMark: 100 },
        { subject: 'CSS', value: 95, fullMark: 100 },
        { subject: 'Testing', value: 75, fullMark: 100 },
        { subject: 'Performance', value: 80, fullMark: 100 },
        { subject: 'Accessibility', value: 88, fullMark: 100 }
      ],
      color: chartColors.primary[0],
      fillOpacity: 0.3
    },
    {
      name: 'Backend Developer',
      data: [
        { subject: 'React', value: 60, fullMark: 100 },
        { subject: 'TypeScript', value: 95, fullMark: 100 },
        { subject: 'CSS', value: 45, fullMark: 100 },
        { subject: 'Testing', value: 90, fullMark: 100 },
        { subject: 'Performance', value: 95, fullMark: 100 },
        { subject: 'Accessibility', value: 50, fullMark: 100 }
      ],
      color: chartColors.success[0],
      fillOpacity: 0.3
    }
  ], []);

  const parallelData = useMemo(() => [
    {
      id: 'product-a',
      values: { Price: 25, Quality: 85, Performance: 78, Reliability: 92, Support: 88 },
      category: 'Premium',
      color: chartColors.primary[0]
    },
    {
      id: 'product-b',
      values: { Price: 45, Quality: 95, Performance: 88, Reliability: 95, Support: 92 },
      category: 'Premium',
      color: chartColors.primary[1]
    },
    {
      id: 'product-c',
      values: { Price: 70, Quality: 65, Performance: 72, Reliability: 68, Support: 65 },
      category: 'Standard',
      color: chartColors.warning[0]
    },
    {
      id: 'product-d',
      values: { Price: 85, Quality: 45, Performance: 55, Reliability: 52, Support: 48 },
      category: 'Budget',
      color: chartColors.danger[0]
    },
    {
      id: 'product-e',
      values: { Price: 60, Quality: 75, Performance: 82, Reliability: 78, Support: 75 },
      category: 'Standard',
      color: chartColors.warning[1]
    }
  ], []);

  const parallelDimensions = ['Price', 'Quality', 'Performance', 'Reliability', 'Support'];

  const series = useMemo(() => [
    {
      dataKey: 'revenue',
      name: 'Revenue',
      color: chartColors.primary[0],
      type: 'line' as const
    },
    {
      dataKey: 'expenses',
      name: 'Expenses',
      color: chartColors.danger[0],
      type: 'line' as const
    },
    {
      dataKey: 'profit',
      name: 'Profit',
      color: chartColors.success[0],
      type: 'area' as const,
      opacity: 0.6
    }
  ], []);

  const barSeries = useMemo(() => [
    {
      dataKey: 'value',
      name: 'Performance Score',
      color: chartColors.info[0]
    }
  ], []);

  const tabs = [
    { id: 'line', label: 'Advanced Line Chart', icon: '📈' },
    { id: 'bar', label: 'Performance Chart', icon: '📊' },
    { id: 'area', label: 'Area Chart', icon: '📉' },
    { id: 'heatmap', label: 'Activity Heatmap', icon: '🔥' },
    { id: 'treemap', label: 'Category Treemap', icon: '🌳' },
    { id: 'radar', label: 'Skill Radar', icon: '🎯' },
    { id: 'parallel', label: 'Parallel Coordinates', icon: '📊' },
  ];

  const handleDataPointClick = (data: Record<string, unknown>, series: string) => {
    console.log('Data point clicked:', data, series);
  };

  const handleCellClick = (data: Record<string, unknown>) => {
    console.log('Heatmap cell clicked:', data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Advanced Data Visualization
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Interactive charts with animations and accessibility features
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={enableAnimations}
              onChange={(e) => setEnableAnimations(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Animations</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">High Contrast</span>
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTooltips}
              onChange={(e) => setShowTooltips(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Tooltips</span>
          </label>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                selectedTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Chart Content */}
      <motion.div
        key={selectedTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {selectedTab === 'line' && (
          <div className="grid gap-6">
            <AdvancedAnimatedChart
              data={lineData}
              series={series}
              chartType="mixed"
              height={400}
              title="Monthly Financial Performance"
              description="Revenue, expenses, and profit trends over the year with interactive features"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onDataPointClick={handleDataPointClick}
              xAxisLabel="Month"
              yAxisLabel="Amount ($)"
              formatYAxis={(value) => formatters.currency(value)}
              formatTooltip={(value, name) => [formatters.currency(value), name]}
              gradientFill={true}
              keyboardNavigation={true}
              announceData={true}
              ariaLabel="Financial performance chart showing monthly revenue, expenses, and profit"
            />
            
            {/* Accessibility Information */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                🎯 Accessibility Features
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Keyboard navigation with arrow keys</li>
                <li>• Screen reader announcements for data points</li>
                <li>• High contrast mode support</li>
                <li>• ARIA labels and descriptions</li>
                <li>• Focus indicators for keyboard users</li>
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'bar' && (
          <div className="grid gap-6">
            <AdvancedAnimatedChart
              data={performanceData}
              series={barSeries}
              chartType="bar"
              height={350}
              title="Website Performance Metrics"
              description="Core Web Vitals and performance indicators"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onDataPointClick={handleDataPointClick}
              xAxisLabel="Metric"
              yAxisLabel="Score"
              keyboardNavigation={true}
              announceData={true}
              staggerDelay={100}
              ariaLabel="Performance metrics bar chart"
            />
            
            {/* Animation Information */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
                ✨ Animation Features
              </h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Staggered entrance animations</li>
                <li>• Smooth hover interactions</li>
                <li>• Customizable animation duration</li>
                <li>• Easing functions for natural movement</li>
                <li>• Intersection observer for viewport-based triggers</li>
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'area' && (
          <div className="grid gap-6">
            <AdvancedAnimatedChart
              data={lineData}
              series={[{
                dataKey: 'revenue',
                name: 'Revenue',
                color: chartColors.primary[0],
                opacity: 0.7
              }]}
              chartType="area"
              height={350}
              title="Revenue Trend Analysis"
              description="Monthly revenue with gradient fill visualization"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              gradientFill={true}
              xAxisLabel="Month"
              yAxisLabel="Revenue ($)"
              formatYAxis={(value) => formatters.currency(value)}
              keyboardNavigation={true}
              announceData={true}
              ariaLabel="Revenue trend area chart"
            />
          </div>
        )}

        {selectedTab === 'heatmap' && (
          <div className="grid gap-6">
            <AdvancedHeatmap
              data={heatmapData}
              title="Weekly Activity Heatmap"
              description="User activity patterns throughout the week by hour"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onCellClick={handleCellClick}
              cellSize={24}
              cellGap={2}
              showLabels={false}
              xAxisLabel="Hour of Day"
              yAxisLabel="Day of Week"
              keyboardNavigation={true}
              announceData={true}
              formatValue={(value) => value.toString()}
              formatTooltip={(data) => `${data.y} ${data.x}:00 - ${data.value} users active`}
              ariaLabel="Weekly activity heatmap showing user activity by day and hour"
              minColor="#f0f9ff"
              maxColor="#1e40af"
            />
            
            {/* Interaction Information */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                🎮 Interaction Features
              </h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• Click handlers for data exploration</li>
                <li>• Hover effects with detailed tooltips</li>
                <li>• Keyboard navigation support</li>
                <li>• Focus indicators for accessibility</li>
                <li>• Custom formatting functions</li>
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'treemap' && (
          <div className="grid gap-6">
            <AdvancedTreemap
              data={treemapData}
              title="Departmental Budget Allocation"
              description="Treemap showing budget distribution across departments"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onNodeClick={(data) => console.log('Treemap node clicked:', data)}
              keyboardNavigation={true}
              announceData={true}
              formatValue={(value) => formatters.currency(value)}
              ariaLabel="Treemap chart showing budget allocation by department"
            />
          </div>
        )}

        {selectedTab === 'radar' && (
          <div className="grid gap-6">
            <AdvancedRadarChart
              datasets={radarDatasets}
              title="Skill Proficiency Radar"
              description="Radar chart displaying skill levels for Frontend and Backend developers"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onDataPointClick={(data, dataset) => console.log('Radar point clicked:', data, dataset)}
              onDataPointHover={(data, dataset) => console.log('Radar point hovered:', data, dataset)}
              keyboardNavigation={true}
              announceData={true}
              formatValue={(value) => `${value}%`}
              ariaLabel="Radar chart showing skill proficiency comparison"
            />
          </div>
        )}

        {selectedTab === 'parallel' && (
          <div className="grid gap-6">
            <AdvancedParallelCoordinates
              data={parallelData}
              dimensions={parallelDimensions}
              title="Product Comparison"
              description="Parallel coordinates chart comparing products across multiple metrics"
              enableAnimations={enableAnimations}
              highContrast={highContrast}
              showTooltip={showTooltips}
              onLineClick={(data) => console.log('Parallel line clicked:', data)}
              onLineHover={(data) => console.log('Parallel line hovered:', data)}
              keyboardNavigation={true}
              announceData={true}
              formatValue={(value, dimension) => {
                if (dimension === 'Price') return `$${value}`;
                return `${value}%`;
              }}
              ariaLabel="Parallel coordinates chart showing product comparisons"
            />
          </div>
        )}
      </motion.div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          📚 Usage Instructions
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Keyboard Navigation:</h5>
            <ul className="space-y-1">
              <li>• Arrow keys: Navigate data points</li>
              <li>• Enter/Space: Select data point</li>
              <li>• Home/End: Jump to first/last point</li>
              <li>• Tab: Focus on chart</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Mouse Interactions:</h5>
            <ul className="space-y-1">
              <li>• Hover: View detailed tooltips</li>
              <li>• Click: Select data points</li>
              <li>• Scroll: Navigate overflow content</li>
              <li>• Focus: Visual focus indicators</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedChartsDemo;
