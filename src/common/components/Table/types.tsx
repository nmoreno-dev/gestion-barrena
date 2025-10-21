import { type ColumnDef } from '@tanstack/react-table';

// Re-exportar tipos útiles de @tanstack/react-table
export type { ColumnDef, Row, Cell, Header, Table as TableType } from '@tanstack/react-table';

// Tipos de variantes de tabla
export type TableVariant = 'default' | 'zebra' | 'bordered';

// Tipos de tamaños de tabla
export type TableSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Helper para crear columnas básicas más fácilmente
export interface BasicColumnDef<TData> {
  /** Clave del objeto para acceder al valor */
  key: keyof TData;
  /** Título de la columna */
  title: string;
  /** Función para formatear el valor mostrado */
  render?: (value: TData[keyof TData], row: TData) => React.ReactNode;
  /** Si la columna puede ser ordenada */
  sortable?: boolean;
  /** Ancho de la columna */
  width?: string | number;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
}

// Helper para crear columnas de acción
export interface ActionColumnDef<TData> {
  /** Título de la columna de acciones */
  title?: string;
  /** Función que renderiza las acciones para cada fila */
  render: (row: TData) => React.ReactNode;
  /** Ancho de la columna */
  width?: string | number;
}

// Helper para crear columnas de selección
export interface SelectionColumnDef {
  /** Título de la columna de selección */
  title?: string;
  /** Si mostrar checkbox en el header para seleccionar todas */
  selectAll?: boolean;
}

// Funciones helper para crear columnas fácilmente
export function createBasicColumn<TData>(def: BasicColumnDef<TData>): ColumnDef<TData> {
  return {
    accessorKey: def.key as string,
    header: def.title,
    cell: ({ getValue, row }) => {
      const value = getValue();
      return def.render ? def.render(value as TData[keyof TData], row.original) : String(value);
    },
    enableSorting: def.sortable ?? true,
    size: typeof def.width === 'number' ? def.width : undefined,
    meta: {
      align: def.align ?? 'left',
      width: def.width,
    },
  };
}

export function createActionColumn<TData>(def: ActionColumnDef<TData>): ColumnDef<TData> {
  return {
    id: 'actions',
    header: def.title ?? 'Acciones',
    cell: ({ row }) => def.render(row.original),
    enableSorting: false,
    size: typeof def.width === 'number' ? def.width : undefined,
    meta: {
      width: def.width,
    },
  };
}

// Tipos para diferentes tipos de datos comunes
export interface CommonTableData {
  id: string | number;
  [key: string]: unknown;
}

// Presets de columnas comunes (solo las funciones sin JSX)
export const columnPresets = {
  /** Columna de ID básica */
  id: <TData extends { id: string | number }>(): ColumnDef<TData> =>
    createBasicColumn({
      key: 'id' as keyof TData,
      title: 'ID',
      width: 80,
      align: 'center',
    }),

  /** Columna de nombre/título */
  name: <TData extends { name: string }>(): ColumnDef<TData> =>
    createBasicColumn({
      key: 'name' as keyof TData,
      title: 'Nombre',
    }),

  /** Columna de email */
  email: <TData extends { email: string }>(): ColumnDef<TData> =>
    createBasicColumn({
      key: 'email' as keyof TData,
      title: 'Email',
    }),

  /** Columna de fecha con formato */
  createdAt: <TData extends { createdAt: string | Date }>(): ColumnDef<TData> =>
    createBasicColumn({
      key: 'createdAt' as keyof TData,
      title: 'Fecha de Creación',
      render: value => {
        const date = new Date(value as string | Date);
        return date.toLocaleDateString('es-ES');
      },
    }),
};
