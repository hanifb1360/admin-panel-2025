export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface Activity {
  id: string;
  type: 'login' | 'order' | 'signup' | 'payment';
  user: string;
  description: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
}

// Chart data types
export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface RevenueChartData {
  [key: string]: string | number;
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface UserGrowthData {
  [key: string]: string | number;
  date: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color?: string;
}

export interface PerformanceMetrics {
  [key: string]: string | number;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  conversionRate: number;
}

export interface SalesDistribution {
  [key: string]: string | number;
  region: string;
  sales: number;
  percentage: number;
}
