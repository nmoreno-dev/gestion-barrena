import React from 'react';
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
  type PaginationState,
} from '@tanstack/react-table';
import classNames from 'classnames';

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  // Styling options
  variant?: 'default' | 'zebra' | 'bordered';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Features
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableColumnPinning?: boolean;
  // Row styling
  highlightOnHover?: boolean;
  // Initial state
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  initialPagination?: PaginationState;
  // Callbacks
  onRowClick?: (row: TData) => void;
  onRowSelect?: (selectedRows: TData[]) => void;
  // Loading state
  isLoading?: boolean;
  // Empty state
  emptyMessage?: string;
  // Custom class names
  containerClassName?: string;
  tableClassName?: string;
}

function Table<TData>({
  data,
  columns,
  variant = 'default',
  size = 'md',
  enableSorting = true,
  enableFiltering = false,
  enablePagination = false,
  enableRowSelection = false,
  enableColumnPinning = false,
  highlightOnHover = true,
  initialSorting = [],
  initialFilters = [],
  initialPagination = { pageIndex: 0, pageSize: 10 },
  onRowClick,
  onRowSelect,
  isLoading = false,
  emptyMessage = 'No hay datos disponibles',
  containerClassName,
  tableClassName,
}: TableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialFilters);
  const [pagination, setPagination] = React.useState<PaginationState>(initialPagination);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    enableRowSelection,
    enableColumnPinning,
  });

  // Handle row selection callback
  React.useEffect(() => {
    if (onRowSelect && enableRowSelection) {
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onRowSelect(selectedRows);
    }
  }, [rowSelection, onRowSelect, enableRowSelection, table]);

  const containerClasses = classNames(
    'overflow-x-auto',
    {
      'rounded-box border border-base-content/5 bg-base-100': variant === 'bordered',
      'h-96': enableColumnPinning,
    },
    containerClassName,
  );

  const tableClasses = classNames(
    'table',
    {
      'table-zebra': variant === 'zebra',
      'table-xs': size === 'xs',
      'table-sm': size === 'sm',
      'table-md': size === 'md',
      'table-lg': size === 'lg',
      'table-xl': size === 'xl',
      'table-pin-rows': enableColumnPinning,
      'table-pin-cols': enableColumnPinning,
    },
    tableClassName,
  );

  const renderTableHeader = () => (
    <thead>
      {table.getHeaderGroups().map(headerGroup => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <th
              key={header.id}
              className={classNames({
                'cursor-pointer select-none': header.column.getCanSort(),
              })}
              onClick={header.column.getToggleSortingHandler()}
            >
              <div className="flex items-center gap-2">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
                {enableSorting && header.column.getCanSort() && (
                  <span className="text-xs opacity-60">
                    {{
                      asc: '↑',
                      desc: '↓',
                    }[header.column.getIsSorted() as string] ?? '↕'}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  const renderTableBody = () => {
    if (isLoading) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-8">
              <span className="loading loading-spinner loading-md"></span>
              <div className="ml-2">Cargando...</div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (table.getRowModel().rows.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-8 text-base-content/60">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr
            key={row.id}
            className={classNames({
              'hover:bg-base-200 cursor-pointer': highlightOnHover || onRowClick,
              'bg-base-300': row.getIsSelected(),
            })}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    if (!enablePagination) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-base-100 border-t border-base-content/10">
        <div className="flex items-center gap-2 text-sm text-base-content/60">
          <span>
            Mostrando{' '}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{' '}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getPrePaginationRowModel().rows.length,
            )}{' '}
            de {table.getPrePaginationRowModel().rows.length} resultados
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="join">
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              «
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ‹
            </button>
            <span className="join-item btn btn-sm btn-disabled">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </span>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              ›
            </button>
            <button
              className="join-item btn btn-sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              »
            </button>
          </div>
          <select
            className="select select-sm select-bordered"
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize} filas
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className={containerClasses}>
        <table className={tableClasses}>
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      </div>
      {renderPagination()}
    </div>
  );
}

export default Table;
