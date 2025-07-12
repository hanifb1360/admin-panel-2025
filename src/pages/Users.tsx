import { useQuery } from '@tanstack/react-query';
import { Plus, UserPlus } from 'lucide-react';
import DataTable from '../components/DataTable';
import { fetchUsers } from '../lib/api';
import { formatDate, cn } from '../lib/utils';
import { tw } from '../design-system/utilities/tailwind';
import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '../types';

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className={cn(tw.bg.gray[300], "w-10 h-10 rounded-full flex items-center justify-center")}>
          <span className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>
            {row.original.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <div className={cn("font-medium", tw.text.primary)}>{row.getValue('name')}</div>
          <div className={cn(tw.typography.body.sm, tw.text.secondary)}>{row.original.email}</div>
        </div>
      </div>
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
  {
    accessorKey: 'updatedAt',
    header: 'Last Updated',
    cell: ({ row }) => (
      <span className={tw.text.secondary}>
        {formatDate(row.getValue('updatedAt'))}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex space-x-2">
        <button className={cn(tw.text.link, tw.text.linkHover, "font-medium")}>
          Edit
        </button>
        <button className={cn(tw.text.error, "hover:text-red-700 dark:hover:text-red-300 font-medium")}>
          Delete
        </button>
      </div>
    ),
  },
];

export default function Users() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn(tw.typography.heading.xl, tw.text.primary)}>Users</h1>
          <p className={tw.text.secondary}>Manage your users and their permissions</p>
        </div>
        <button className={cn(tw.interactive.primary, tw.interactive.primaryHover, "flex items-center space-x-2 px-4 py-2 rounded-lg")}>
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={cn(tw.bg.primary, tw.border.primary, "p-6 rounded-lg border")}>
          <div className="flex items-center">
            <div className={cn(tw.bg.blue[100], "w-8 h-8 rounded-lg flex items-center justify-center")}>
              <UserPlus className={cn("w-4 h-4", tw.text.info)} />
            </div>
            <div className="ml-3">
              <p className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>Total Users</p>
              <p className={cn(tw.typography.heading.lg, tw.text.primary)}>{users?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className={cn(tw.bg.primary, tw.border.primary, "p-6 rounded-lg border")}>
          <div className="flex items-center">
            <div className={cn(tw.bg.green[100], "w-8 h-8 rounded-lg flex items-center justify-center")}>
              <div className={cn("w-3 h-3 rounded-full", tw.bg.green[600])}></div>
            </div>
            <div className="ml-3">
              <p className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>Active Users</p>
              <p className={cn(tw.typography.heading.lg, tw.text.primary)}>
                {users?.filter(user => user.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className={cn(tw.bg.primary, tw.border.primary, "p-6 rounded-lg border")}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>Admins</p>
              <p className={cn(tw.typography.heading.lg, tw.text.primary)}>
                {users?.filter(user => user.role === 'admin').length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className={cn(tw.bg.primary, tw.border.primary, "p-6 rounded-lg border")}>
          <div className="flex items-center">
            <div className={cn(tw.bg.red[100], "w-8 h-8 rounded-lg flex items-center justify-center")}>
              <div className={cn("w-3 h-3 rounded-full", tw.bg.red[600])}></div>
            </div>
            <div className="ml-3">
              <p className={cn(tw.typography.body.sm, "font-medium", tw.text.secondary)}>Inactive Users</p>
              <p className={cn(tw.typography.heading.lg, tw.text.primary)}>
                {users?.filter(user => !user.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={userColumns}
        data={users || []}
        searchPlaceholder="Search users..."
      />
    </div>
  );
}
