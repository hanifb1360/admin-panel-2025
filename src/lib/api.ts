import type { User, DashboardStats, SalesData, Activity, Product } from '../types';

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
