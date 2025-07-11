import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className={designSystem.spacing.gap.md}>
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className={cn(
          'absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4',
          designSystem.colors.text.muted
        )} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className={componentVariants.input.search}
        />
      </div>

      {/* Table */}
      <div className={componentVariants.table.container}>
        <table className="w-full">
          <thead className={designSystem.colors.bg.gray[50]}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={componentVariants.table.header}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          designSystem.layout.flex.start,
                          designSystem.spacing.gap.sm,
                          header.column.getCanSort() && "cursor-pointer select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {header.column.getCanSort() && (
                          <span className={designSystem.colors.text.muted}>
                            {header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={cn(designSystem.colors.bg.white, 'divide-y divide-gray-200')}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={componentVariants.table.row}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={componentVariants.table.cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={cn(designSystem.layout.flex.between, 'px-2')}>
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
          <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.primary)}>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </span>
        </div>
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              'px-3 py-1',
              designSystem.typography.body.sm,
              designSystem.colors.border.gray,
              'border',
              designSystem.effects.rounded.md,
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              'px-3 py-1',
              designSystem.typography.body.sm,
              designSystem.colors.border.gray,
              'border',
              designSystem.effects.rounded.md,
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              'px-3 py-1',
              designSystem.typography.body.sm,
              designSystem.colors.border.gray,
              'border',
              designSystem.effects.rounded.md,
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={cn(
              'px-3 py-1',
              designSystem.typography.body.sm,
              designSystem.colors.border.gray,
              'border',
              designSystem.effects.rounded.md,
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  );
}
