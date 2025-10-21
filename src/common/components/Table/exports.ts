// Exportaciones principales
export { default as Table, type TableProps } from './index';

// Exportaciones de tipos y utilidades
export type {
  TableVariant,
  TableSize,
  BasicColumnDef,
  ActionColumnDef,
  SelectionColumnDef,
  CommonTableData,
  ColumnDef,
  Row,
  Cell,
  Header,
  TableType,
} from './types';

export { createBasicColumn, createActionColumn, columnPresets } from './types';

// Re-exportar componentes útiles de @tanstack/react-table
export {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
