import { useQuery } from '@tanstack/react-query';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import ThemeDemo from '../components/ThemeDemo';
import { fetchDashboardStats, fetchActivities, fetchUsers } from '../lib/api';
import { formatCurrency, formatDate } from '../lib/utils';
import type { ColumnDef } from '@tanstack/react-table';
import type { Activity, User } from '../types';

const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const typeColors = {
        login: 'bg-blue-100 text-blue-800',
        order: 'bg-green-100 text-green-800',
        signup: 'bg-purple-100 text-purple-800',
        payment: 'bg-yellow-100 text-yellow-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors[type as keyof typeof typeColors]}`}>
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: 'user',
    header: 'User',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'timestamp',
    header: 'Time',
    cell: ({ row }) => formatDate(row.getValue('timestamp')),
  },
];

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {row.original.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span>{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleColors = {
        admin: 'bg-red-100 text-red-800',
        user: 'bg-gray-100 text-gray-800',
        moderator: 'bg-blue-100 text-blue-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        row.getValue('isActive') 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {row.getValue('isActive') ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => formatDate(row.getValue('createdAt')),
  },
];

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (statsLoading || activitiesLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Theme Demo */}
      <ThemeDemo />
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString() || '0'}
          change="+12.5%"
          trend="up"
          icon={Users}
        />
        <StatsCard
          title="Active Users"
          value={stats?.activeUsers.toLocaleString() || '0'}
          change="+8.2%"
          trend="up"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue || 0)}
          change="+15.3%"
          trend="up"
          icon={DollarSign}
        />
        <StatsCard
          title="Total Orders"
          value="1,234"
          change="-2.1%"
          trend="down"
          icon={ShoppingCart}
        />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
          <DataTable
            columns={activityColumns}
            data={activities || []}
            searchPlaceholder="Search activities..."
          />
        </div>

        {/* Recent Users */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Users</h2>
          <DataTable
            columns={userColumns}
            data={users || []}
            searchPlaceholder="Search users..."
          />
        </div>
      </div>
    </div>
  );
}
