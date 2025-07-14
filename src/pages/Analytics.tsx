import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  LineChart, 
  PieChart, 
  AreaChart, 
  chartColors, 
  formatters 
} from '../components/charts';
import AdvancedChartsDemo from '../components/charts/ChartsDemo';
import { 
  fetchRevenueData, 
  fetchUserGrowthData, 
  fetchCategoryData, 
  fetchPerformanceData
  // fetchSalesDistribution 
} from '../lib/api';
import { cn } from '../lib/utils';
import { designSystem } from '../lib/designSystem';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Target, 
  BarChart3,
  Activity
} from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
  </div>
);

// Error boundary component for charts
const ChartErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [children]);

  if (hasError) {
    return fallback || (
      <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">Chart failed to load</p>
          <button 
            onClick={() => setHasError(false)}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  try {
    return <>{children}</>;
  } catch (error) {
    console.error('Chart error:', error);
    setHasError(true);
    return null;
  }
};

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={cn(
      'bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700'
    )}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
          {title}
        </p>
        <p className={cn(designSystem.typography.display.lg, designSystem.colors.text.primary, 'mt-1')}>
          {value}
        </p>
        <div className="flex items-center mt-2">
          <TrendingUp className={cn(
            'w-4 h-4 mr-1',
            trend === 'up' ? 'text-green-500' : 'text-red-500'
          )} />
          <span className={cn(
            designSystem.typography.body.sm,
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}>
            {change}
          </span>
        </div>
      </div>
      <div className={cn(
        'p-3 rounded-lg',
        'bg-primary-50 dark:bg-primary-900/20'
      )}>
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>
  </motion.div>
);

export default function Analytics() {
  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue-data'],
    queryFn: fetchRevenueData,
  });

  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ['user-growth-data'],
    queryFn: fetchUserGrowthData,
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ['category-data'],
    queryFn: fetchCategoryData,
  });

  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ['performance-data'],
    queryFn: fetchPerformanceData,
  });

  // const { data: salesDistribution, isLoading: salesLoading, error: salesError } = useQuery({
  //   queryKey: ['sales-distribution'],
  //   queryFn: fetchSalesDistribution,
  //   staleTime: 5 * 60 * 1000, // 5 minutes
  //   refetchOnWindowFocus: false,
  //   retry: 3,
  //   retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  // });

  const isLoading = revenueLoading || userGrowthLoading || categoryLoading || performanceLoading; // || salesLoading;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={cn(designSystem.typography.display.lg, designSystem.colors.text.primary)}>
          Analytics Dashboard
        </h1>
        <p className={cn(designSystem.typography.body.lg, designSystem.colors.text.secondary, 'mt-2')}>
          Advanced data visualization with interactive charts and real-time metrics
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatters.currency(284750)}
          change="+15.3% from last month"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={formatters.shortNumber(8721)}
          change="+12.8% from last month"
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Page Views"
          value={formatters.shortNumber(19870)}
          change="+8.4% from last week"
          icon={Eye}
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={formatters.percentage(5.1)}
          change="+0.8% from last week"
          icon={Target}
          trend="up"
        />
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <LineChart
            data={revenueData || []}
            xKey="month"
            yKeys={[
              { key: 'revenue', color: chartColors.primary[0], name: 'Revenue' },
              { key: 'profit', color: chartColors.success[0], name: 'Profit' },
              { key: 'expenses', color: chartColors.danger[0], name: 'Expenses' }
            ]}
            title="Revenue Trends"
            height={350}
            formatTooltip={(value, name) => [formatters.currency(Number(value)), name]}
            ariaDescription="Monthly revenue, profit, and expenses data showing upward trend throughout the year"
            enableAnimation={true}
          />
        </ChartErrorBoundary>

        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <AreaChart
            data={userGrowthData || []}
            xKey="date"
            yKeys={[
              { key: 'totalUsers', color: chartColors.primary[0], name: 'Total Users' },
              { key: 'activeUsers', color: chartColors.success[0], name: 'Active Users' },
              { key: 'newUsers', color: chartColors.info[0], name: 'New Users' }
            ]}
            title="User Growth"
            height={350}
            formatTooltip={(value, name) => [formatters.number(Number(value)), name]}
            ariaDescription="Daily user growth metrics showing total, active, and new user counts"
            stacked={false}
            enableAnimation={true}
          />
        </ChartErrorBoundary>
      </div>

      {/* Category Performance & Sales Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <PieChart
            data={categoryData || []}
            title="Sales by Category"
            height={350}
            formatTooltip={(value, name) => [formatters.number(Number(value)), name]}
            ariaDescription="Product category sales distribution showing Electronics leading with highest sales"
            showPercentage={true}
            enableAnimation={true}
            colors={chartColors.mixed}
          />
        </ChartErrorBoundary>

        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Sales by Region</h3>
            <div style={{ height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={[
                    { region: 'North America', sales: 1284560 },
                    { region: 'Europe', sales: 956780 },
                    { region: 'Asia Pacific', sales: 634290 },
                    { region: 'Latin America', sales: 124380 },
                    { region: 'Africa', sales: 36990 }
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={110} />
                  <Tooltip formatter={(value) => [formatters.currency(Number(value)), 'Sales']} />
                  <Bar dataKey="sales">
                    <Cell fill={chartColors.mixed[0]} /> {/* Blue - North America */}
                    <Cell fill={chartColors.mixed[1]} /> {/* Emerald - Europe */}
                    <Cell fill={chartColors.mixed[2]} /> {/* Amber - Asia Pacific */}
                    <Cell fill={chartColors.mixed[3]} /> {/* Red - Latin America */}
                    <Cell fill={chartColors.mixed[4]} /> {/* Violet - Africa */}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartErrorBoundary>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className={cn(designSystem.typography.heading.lg, designSystem.colors.text.primary)}>
                Website Performance
              </h3>
              <p className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
                Track key performance indicators and user engagement metrics
              </p>
            </div>
          </div>
          
          <ChartErrorBoundary fallback={<LoadingSpinner />}>
            <LineChart
              data={performanceData || []}
              xKey="date"
              yKeys={[
                { key: 'pageViews', color: chartColors.primary[0], name: 'Page Views' },
                { key: 'uniqueVisitors', color: chartColors.success[0], name: 'Unique Visitors' }
              ]}
              height={300}
              formatTooltip={(value, name) => [formatters.number(Number(value)), name]}
              ariaDescription="Daily website performance showing page views and unique visitor trends"
              enableAnimation={true}
              enableGrid={true}
              className="mt-4"
            />
          </ChartErrorBoundary>
        </div>
      </div>

      {/* Conversion & Bounce Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <AreaChart
            data={performanceData || []}
            xKey="date"
            yKeys={[
              { key: 'conversionRate', color: chartColors.success[0], name: 'Conversion Rate' }
            ]}
            title="Conversion Rate Trend"
            height={300}
            formatTooltip={(value, name) => [formatters.percentage(Number(value)), name]}
            ariaDescription="Daily conversion rate showing improving trend over time"
            enableAnimation={true}
          />
        </ChartErrorBoundary>

        <ChartErrorBoundary fallback={<LoadingSpinner />}>
          <AreaChart
            data={performanceData || []}
            xKey="date"
            yKeys={[
              { key: 'bounceRate', color: chartColors.warning[0], name: 'Bounce Rate' }
            ]}
            title="Bounce Rate Trend"
            height={300}
            formatTooltip={(value, name) => [formatters.percentage(Number(value)), name]}
            ariaDescription="Daily bounce rate showing decreasing trend indicating better user engagement"
            enableAnimation={true}
          />
        </ChartErrorBoundary>
      </div>

      {/* Advanced Charts Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className={cn(designSystem.typography.heading.lg, designSystem.colors.text.primary, 'mb-4')}>
            Advanced Chart Visualizations
          </h3>
          <p className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary, 'mb-4')}>
            Explore our new range of advanced chart types for deeper data insights.
          </p>
          <AdvancedChartsDemo />
        </div>
      </div>

      {/* Chart Legend and Accessibility Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className={cn(designSystem.typography.heading.md, 'text-blue-900 dark:text-blue-100')}>
              Accessibility Features
            </h4>
            <p className={cn(designSystem.typography.body.sm, 'text-blue-700 dark:text-blue-300 mt-1')}>
              All charts are keyboard navigable and screen reader accessible. Use Tab to navigate between charts and arrow keys within charts.
              Charts include proper ARIA labels, descriptions, and high contrast mode support.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
