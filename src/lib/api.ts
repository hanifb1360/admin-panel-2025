import type { 
  User, 
  DashboardStats, 
  SalesData, 
  Activity, 
  Product,
  RevenueChartData,
  UserGrowthData,
  CategoryData,
  PerformanceMetrics,
  SalesDistribution
} from '../types';

// Mock data for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-07-10T14:22:00Z',
    isActive: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=40&h=40&fit=crop&crop=face',
    createdAt: '2024-02-20T09:15:00Z',
    updatedAt: '2024-07-11T11:45:00Z',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    createdAt: '2024-03-10T16:20:00Z',
    updatedAt: '2024-07-09T13:30:00Z',
    isActive: false,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 12486,
  activeUsers: 9842,
  totalRevenue: 284750,
  monthlyGrowth: 12.5,
};

export const mockSalesData: SalesData[] = [
  { date: '2024-07-01', revenue: 12500, orders: 45, customers: 32 },
  { date: '2024-07-02', revenue: 15300, orders: 52, customers: 38 },
  { date: '2024-07-03', revenue: 11800, orders: 41, customers: 29 },
  { date: '2024-07-04', revenue: 18200, orders: 63, customers: 45 },
  { date: '2024-07-05', revenue: 16900, orders: 58, customers: 41 },
  { date: '2024-07-06', revenue: 14600, orders: 49, customers: 35 },
  { date: '2024-07-07', revenue: 19800, orders: 67, customers: 48 },
];

export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    user: 'Jane Smith',
    description: 'User logged in',
    timestamp: '2024-07-11T09:30:00Z',
  },
  {
    id: '2',
    type: 'order',
    user: 'Mike Johnson',
    description: 'New order placed - $89.99',
    timestamp: '2024-07-11T09:15:00Z',
  },
  {
    id: '3',
    type: 'signup',
    user: 'Sarah Wilson',
    description: 'New user registered',
    timestamp: '2024-07-11T08:45:00Z',
  },
  {
    id: '4',
    type: 'payment',
    user: 'David Brown',
    description: 'Payment received - $156.50',
    timestamp: '2024-07-11T08:20:00Z',
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 156,
    status: 'active',
    createdAt: '2024-06-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 299.99,
    stock: 0,
    status: 'out_of_stock',
    createdAt: '2024-06-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Coffee Maker',
    category: 'Home & Kitchen',
    price: 79.99,
    stock: 89,
    status: 'active',
    createdAt: '2024-06-25T09:15:00Z',
  },
];

// Advanced Chart Data
export const mockRevenueData: RevenueChartData[] = [
  { month: 'Jan', revenue: 125000, profit: 32000, expenses: 93000 },
  { month: 'Feb', revenue: 135000, profit: 38000, expenses: 97000 },
  { month: 'Mar', revenue: 142000, profit: 42000, expenses: 100000 },
  { month: 'Apr', revenue: 158000, profit: 48000, expenses: 110000 },
  { month: 'May', revenue: 171000, profit: 52000, expenses: 119000 },
  { month: 'Jun', revenue: 185000, profit: 58000, expenses: 127000 },
  { month: 'Jul', revenue: 196000, profit: 61000, expenses: 135000 },
  { month: 'Aug', revenue: 203000, profit: 65000, expenses: 138000 },
  { month: 'Sep', revenue: 218000, profit: 72000, expenses: 146000 },
  { month: 'Oct', revenue: 235000, profit: 78000, expenses: 157000 },
  { month: 'Nov', revenue: 251000, profit: 83000, expenses: 168000 },
  { month: 'Dec', revenue: 284750, profit: 95000, expenses: 189750 },
];

export const mockUserGrowthData: UserGrowthData[] = [
  { date: '2024-07-01', totalUsers: 10250, newUsers: 85, activeUsers: 8120 },
  { date: '2024-07-02', totalUsers: 10335, newUsers: 95, activeUsers: 8205 },
  { date: '2024-07-03', totalUsers: 10430, newUsers: 78, activeUsers: 8156 },
  { date: '2024-07-04', totalUsers: 10508, newUsers: 102, activeUsers: 8298 },
  { date: '2024-07-05', totalUsers: 10610, newUsers: 88, activeUsers: 8276 },
  { date: '2024-07-06', totalUsers: 10698, newUsers: 76, activeUsers: 8189 },
  { date: '2024-07-07', totalUsers: 10774, newUsers: 118, activeUsers: 8445 },
  { date: '2024-07-08', totalUsers: 10892, newUsers: 92, activeUsers: 8372 },
  { date: '2024-07-09', totalUsers: 10984, newUsers: 89, activeUsers: 8498 },
  { date: '2024-07-10', totalUsers: 11073, newUsers: 105, activeUsers: 8634 },
  { date: '2024-07-11', totalUsers: 11178, newUsers: 98, activeUsers: 8721 },
];

export const mockCategoryData: CategoryData[] = [
  { name: 'Electronics', value: 4258, color: '#3b82f6' },
  { name: 'Clothing', value: 3142, color: '#10b981' },
  { name: 'Home & Garden', value: 2186, color: '#f59e0b' },
  { name: 'Sports', value: 1876, color: '#ef4444' },
  { name: 'Books', value: 1324, color: '#8b5cf6' },
  { name: 'Health & Beauty', value: 986, color: '#06b6d4' },
];

export const mockPerformanceData: PerformanceMetrics[] = [
  { date: '2024-07-01', pageViews: 15420, uniqueVisitors: 8934, bounceRate: 34.2, conversionRate: 3.8 },
  { date: '2024-07-02', pageViews: 16780, uniqueVisitors: 9456, bounceRate: 32.1, conversionRate: 4.2 },
  { date: '2024-07-03', pageViews: 14920, uniqueVisitors: 8642, bounceRate: 36.8, conversionRate: 3.5 },
  { date: '2024-07-04', pageViews: 18340, uniqueVisitors: 10234, bounceRate: 29.4, conversionRate: 4.7 },
  { date: '2024-07-05', pageViews: 17650, uniqueVisitors: 9876, bounceRate: 31.2, conversionRate: 4.3 },
  { date: '2024-07-06', pageViews: 16240, uniqueVisitors: 9123, bounceRate: 33.6, conversionRate: 3.9 },
  { date: '2024-07-07', pageViews: 19870, uniqueVisitors: 11456, bounceRate: 27.8, conversionRate: 5.1 },
];

export const mockSalesDistribution: SalesDistribution[] = [
  { region: 'North America', sales: 1284560, percentage: 42.3 },
  { region: 'Europe', sales: 956780, percentage: 31.5 },
  { region: 'Asia Pacific', sales: 634290, percentage: 20.9 },
  { region: 'Latin America', sales: 124380, percentage: 4.1 },
  { region: 'Africa', sales: 36990, percentage: 1.2 },
];

// API simulation functions
export const fetchUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return mockUsers;
};

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDashboardStats;
};

export const fetchSalesData = async (): Promise<SalesData[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return mockSalesData;
};

export const fetchActivities = async (): Promise<Activity[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockActivities;
};

export const fetchProducts = async (): Promise<Product[]> => {
  await new Promise(resolve => setTimeout(resolve, 900));
  return mockProducts;
};

// Chart data API functions
export const fetchRevenueData = async (): Promise<RevenueChartData[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockRevenueData;
};

export const fetchUserGrowthData = async (): Promise<UserGrowthData[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return mockUserGrowthData;
};

export const fetchCategoryData = async (): Promise<CategoryData[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockCategoryData;
};

export const fetchPerformanceData = async (): Promise<PerformanceMetrics[]> => {
  await new Promise(resolve => setTimeout(resolve, 750));
  return mockPerformanceData;
};

export const fetchSalesDistribution = async (): Promise<SalesDistribution[]> => {
  await new Promise(resolve => setTimeout(resolve, 650));
  return mockSalesDistribution;
};
