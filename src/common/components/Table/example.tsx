import React from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import Table from './index';

// Ejemplo de tipo de datos
interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatar?: string;
}

// Datos de ejemplo
const sampleData: Person[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'Administrador',
    status: 'active',
    lastLogin: '2025-10-20',
    avatar: 'https://img.daisyui.com/images/profile/demo/2@94.webp',
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@example.com',
    role: 'Usuario',
    status: 'active',
    lastLogin: '2025-10-19',
    avatar: 'https://img.daisyui.com/images/profile/demo/3@94.webp',
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'Editor',
    status: 'inactive',
    lastLogin: '2025-10-15',
    avatar: 'https://img.daisyui.com/images/profile/demo/4@94.webp',
  },
];

// Definición de columnas
const columns: ColumnDef<Person>[] = [
  // Columna de selección (checkbox)
  {
    id: 'select',
    header: ({ table }) => (
      <label>
        <input
          type="checkbox"
          className="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      </label>
    ),
    cell: ({ row }) => (
      <label>
        <input
          type="checkbox"
          className="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </label>
    ),
    enableSorting: false,
  },

  // Columna con avatar y nombre
  {
    accessorKey: 'name',
    header: 'Usuario',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="avatar">
          <div className="mask mask-squircle h-12 w-12">
            <img
              src={row.original.avatar || 'https://img.daisyui.com/images/profile/demo/2@94.webp'}
              alt={`Avatar de ${row.original.name}`}
            />
          </div>
        </div>
        <div>
          <div className="font-bold">{row.original.name}</div>
          <div className="text-sm opacity-50">{row.original.email}</div>
        </div>
      </div>
    ),
  },

  // Columna de rol con badge
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ getValue }) => <span className="badge badge-outline">{getValue() as string}</span>,
  },

  // Columna de estado con badge colorizado
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ getValue }) => {
      const status = getValue() as 'active' | 'inactive';
      return (
        <span className={`badge ${status === 'active' ? 'badge-success' : 'badge-error'}`}>
          {status === 'active' ? 'Activo' : 'Inactivo'}
        </span>
      );
    },
  },

  // Columna de fecha
  {
    accessorKey: 'lastLogin',
    header: 'Último acceso',
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString('es-ES');
    },
  },

  // Columna de acciones
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => console.log('Ver detalles de:', row.original)}
        >
          Ver
        </button>
        <button
          className="btn btn-ghost btn-xs"
          onClick={() => console.log('Editar:', row.original)}
        >
          Editar
        </button>
        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={() => console.log('Eliminar:', row.original)}
        >
          Eliminar
        </button>
      </div>
    ),
    enableSorting: false,
  },
];

// Componente de ejemplo
export const TableExample: React.FC = () => {
  const [selectedRows, setSelectedRows] = React.useState<Person[]>([]);

  const handleRowSelect = (rows: Person[]) => {
    setSelectedRows(rows);
    console.log('Filas seleccionadas:', rows);
  };

  const handleRowClick = (row: Person) => {
    console.log('Fila clickeada:', row);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Ejemplos de Tabla Genérica</h1>

      {/* Tabla básica */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tabla Básica</h2>
          <Table data={sampleData} columns={columns} variant="default" size="md" />
        </div>
      </div>

      {/* Tabla con zebra y sorting */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tabla con Rayas Zebra y Ordenamiento</h2>
          <Table
            data={sampleData}
            columns={columns}
            variant="zebra"
            size="sm"
            enableSorting={true}
          />
        </div>
      </div>

      {/* Tabla con selección de filas */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tabla con Selección de Filas</h2>
          <p className="text-sm text-base-content/60 mb-4">
            Filas seleccionadas: {selectedRows.length}
          </p>
          <Table
            data={sampleData}
            columns={columns}
            variant="bordered"
            enableRowSelection={true}
            onRowSelect={handleRowSelect}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      {/* Tabla con paginación */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tabla con Paginación</h2>
          <Table
            data={[...sampleData, ...sampleData, ...sampleData, ...sampleData]}
            columns={columns}
            variant="default"
            enablePagination={true}
            initialPagination={{ pageIndex: 0, pageSize: 5 }}
          />
        </div>
      </div>

      {/* Tabla compacta */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Tabla Compacta (XS)</h2>
          <Table data={sampleData} columns={columns} variant="zebra" size="xs" />
        </div>
      </div>

      {/* Estado de carga */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Estado de Carga</h2>
          <Table data={[]} columns={columns} isLoading={true} />
        </div>
      </div>

      {/* Estado vacío */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Estado Vacío</h2>
          <Table data={[]} columns={columns} emptyMessage="No se encontraron usuarios" />
        </div>
      </div>
    </div>
  );
};

export default TableExample;
