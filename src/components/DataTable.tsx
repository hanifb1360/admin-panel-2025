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
  type RowSelectionState,
  type PaginationState,
  type Table,
  type Row,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { componentVariants, designSystem } from '../lib/designSystem';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  isLoading?: boolean;
  enableRowSelection?: boolean;
  enableExport?: boolean;
  pageSize?: number;
  onExport?: (data: TData[]) => void;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  isLoading = false,
  enableRowSelection = false,
  enableExport = false,
  pageSize = 10,
  onExport,
  onRowSelectionChange,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  // Add selection column if enabled
  const enhancedColumns = enableRowSelection
    ? [
        {
          id: 'select',
          header: ({ table }: { table: Table<TData> }) => (
            <input
              type="checkbox"
              checked={table.getIsAllPageRowsSelected()}
              onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-primary-500"
            />
          ),
          cell: ({ row }: { row: Row<TData> }) => (
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              onChange={(e) => row.toggleSelected(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-primary-500"
            />
          ),
          size: 40,
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    globalFilterFn: 'includesString',
    enableRowSelection: enableRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
  });

  // Handle row selection changes
  useEffect(() => {
    if (onRowSelectionChange && enableRowSelection) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, enableRowSelection, table]);

  // Handle export
  const handleExport = () => {
    if (onExport) {
      const selectedRows = table.getSelectedRowModel().rows;
      const dataToExport = selectedRows.length > 0 
        ? selectedRows.map(row => row.original)
        : table.getFilteredRowModel().rows.map(row => row.original);
      onExport(dataToExport);
    }
  };

  return (
    <div className={cn(designSystem.layout.flex.col, designSystem.spacing.gap.md)}>
      {/* Toolbar */}
      <div className={cn(designSystem.layout.flex.between, designSystem.spacing.gap.md)}>
        {/* Search and Filters */}
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.md)}>
          {/* Global Search */}
          <div className="relative">
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

          {/* Clear Filters */}
          {(globalFilter || columnFilters.length > 0) && (
            <button
              onClick={() => {
                setGlobalFilter('');
                setColumnFilters([]);
              }}
              className={cn(
                componentVariants.button.ghost,
                designSystem.layout.flex.center,
                designSystem.spacing.gap.xs
              )}
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
          {/* Selection Info */}
          {enableRowSelection && Object.keys(rowSelection).length > 0 && (
            <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
              {Object.keys(rowSelection).length} selected
            </span>
          )}

          {/* Export Button */}
          {enableExport && (
            <button
              onClick={handleExport}
              className={cn(
                componentVariants.button.outline,
                designSystem.layout.flex.center,
                designSystem.spacing.gap.xs
              )}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className={componentVariants.table.container}>
        {isLoading ? (
          <div className={cn(designSystem.layout.flex.center, 'h-64')}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <table className="w-full min-w-[800px]">
            <thead className={designSystem.colors.bg.gray[50]}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={componentVariants.table.header}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            designSystem.layout.flex.start,
                            designSystem.spacing.gap.sm,
                            header.column.getCanSort() && "cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1 -m-1"
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
            <tbody className={cn(designSystem.colors.bg.white, 'divide-y divide-gray-200 dark:divide-gray-700')}>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td 
                    colSpan={table.getVisibleFlatColumns().length}
                    className={cn(
                      componentVariants.table.cell,
                      designSystem.layout.flex.center,
                      'h-64'
                    )}
                  >
                    <div className={cn(designSystem.layout.flex.col, designSystem.spacing.gap.sm, 'items-center')}>
                      <Search className={cn('w-12 h-12', designSystem.colors.text.muted)} />
                      <div className={cn(designSystem.typography.body.sm, designSystem.colors.text.muted)}>
                        No results found
                      </div>
                      {globalFilter && (
                        <button
                          onClick={() => setGlobalFilter('')}
                          className={cn(
                            componentVariants.button.ghost,
                            designSystem.typography.body.sm
                          )}
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className={cn(
                    componentVariants.table.row,
                    row.getIsSelected() && 'bg-primary-50 dark:bg-primary-900/20'
                  )}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={componentVariants.table.cell}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Enhanced Pagination */}
      <div className={cn(designSystem.layout.flex.between, designSystem.spacing.gap.md)}>
        {/* Results Info */}
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.md)}>
          <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{' '}
            of {table.getFilteredRowModel().rows.length} results
          </span>
          
          {/* Page Size Selector */}
          <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
            <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
              Show
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
              className={cn(
                'px-2 py-1',
                designSystem.typography.body.sm,
                designSystem.colors.border.secondary,
                'border',
                designSystem.effects.rounded.md,
                designSystem.colors.bg.white,
                designSystem.colors.text.primary,
                designSystem.effects.transition.colors
              )}
            >
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
          {/* First Page */}
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              componentVariants.button.ghost,
              'px-2 py-1',
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={cn(
              componentVariants.button.ghost,
              'px-2 py-1',
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Info */}
          <div className={cn(designSystem.layout.flex.start, designSystem.spacing.gap.sm)}>
            <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
              Page
            </span>
            <input
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className={cn(
                'w-16 px-2 py-1 text-center',
                designSystem.typography.body.sm,
                designSystem.colors.border.secondary,
                'border',
                designSystem.effects.rounded.md,
                designSystem.colors.bg.white,
                designSystem.colors.text.primary,
                designSystem.effects.transition.colors
              )}
              min="1"
              max={table.getPageCount()}
            />
            <span className={cn(designSystem.typography.body.sm, designSystem.colors.text.secondary)}>
              of {table.getPageCount()}
            </span>
          </div>

          {/* Next Page */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={cn(
              componentVariants.button.ghost,
              'px-2 py-1',
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page */}
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={cn(
              componentVariants.button.ghost,
              'px-2 py-1',
              designSystem.states.disabled.opacity,
              designSystem.states.disabled.cursor
            )}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
