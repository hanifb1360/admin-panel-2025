import { useQuery } from '@tanstack/react-query';
import { Users, DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import ThemeDemo from '../components/ThemeDemo';
import { fetchDashboardStats, fetchActivities, fetchUsers } from '../lib/api';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { tw } from '../design-system/utilities/tailwind';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import type { ColumnDef } from '@tanstack/react-table';
import type { Activity, User } from '../types';

const activityColumns: ColumnDef<Activity>[] = [
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      const typeColors = {
        login: cn(tw.bg.blue[100], tw.text.info),
        order: cn(tw.bg.green[100], tw.text.success),
        signup: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        payment: cn(tw.bg.yellow[100], tw.text.warning),
      };
      return (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', typeColors[type as keyof typeof typeColors])}>
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
    cell: ({ row }) => (
      <span className={tw.text.secondary}>
        {formatDate(row.getValue('timestamp'))}
      </span>
    ),
  },
];

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className={cn(tw.bg.gray[300], "w-8 h-8 rounded-full flex items-center justify-center")}>
          <span className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>
            {row.original.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className={tw.text.primary}>{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <span className={tw.text.secondary}>{row.getValue('email')}</span>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const roleColors = {
        admin: cn(tw.bg.red[100], tw.text.error),
        user: cn(tw.bg.gray[100], tw.text.secondary),
        moderator: cn(tw.bg.blue[100], tw.text.info),
      };
      return (
        <span className={cn('px-2 py-1 rounded-full text-xs font-medium', roleColors[role as keyof typeof roleColors])}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <span className={cn(
        'px-2 py-1 rounded-full text-xs font-medium',
        row.getValue('isActive') 
          ? cn(tw.bg.green[100], tw.text.success)
          : cn(tw.bg.red[100], tw.text.error)
      )}>
        {row.getValue('isActive') ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => (
      <span className={tw.text.secondary}>
        {formatDate(row.getValue('createdAt'))}
      </span>
    ),
  },
];

export default function Dashboard() {
  // Enable real-time updates
  useRealTimeUpdates();

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
          <h2 className={cn(tw.typography.heading.lg, tw.text.primary)}>Recent Activities</h2>
          <DataTable
            columns={activityColumns}
            data={activities || []}
            searchPlaceholder="Search activities..."
            enableExport={true}
            pageSize={5}
            onExport={(data) => {
              console.log('Exporting activities:', data);
              // Here you could implement CSV export or other export functionality
            }}
          />
        </div>

        {/* Recent Users */}
        <div className="space-y-4">
          <h2 className={cn(tw.typography.heading.lg, tw.text.primary)}>Recent Users</h2>
          <DataTable
            columns={userColumns}
            data={users || []}
            searchPlaceholder="Search users..."
            enableRowSelection={true}
            enableExport={true}
            pageSize={5}
            onRowSelectionChange={(selectedRows) => {
              console.log('Selected users:', selectedRows);
            }}
            onExport={(data) => {
              console.log('Exporting users:', data);
              // Here you could implement CSV export or other export functionality
            }}
          />
        </div>
      </div>
    </div>
  );
}
