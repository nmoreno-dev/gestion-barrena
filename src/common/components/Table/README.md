# Componente Table Genérico

Una tabla genérica y hermosa construida con **DaisyUI** y **@tanstack/react-table v8** que ofrece múltiples funcionalidades y estilos personalizables.

## Características

✨ **Funcionalidades Completas**

- Ordenamiento por columnas
- Paginación integrada
- Selección de filas (múltiple)
- Estados de carga y vacío
- Filtrado de columnas
- Columnas fijas (pin)
- Responsive design

🎨 **Estilos Hermosos**

- Múltiples variantes (default, zebra, bordered)
- Diferentes tamaños (xs, sm, md, lg, xl)
- Hover effects configurables
- Integración completa con DaisyUI

🔧 **TypeScript First**

- Completamente tipado
- Genérico para cualquier tipo de datos
- Intellisense completo

## Instalación

El componente ya está incluido en el proyecto y requiere las siguientes dependencias:

```json
{
  "@tanstack/react-table": "^8.21.3",
  "classnames": "^2.5.1",
  "daisyui": "^5.0.50"
}
```

## Uso Básico

```tsx
import { Table } from '@/common/components/Table';
import { type ColumnDef } from '@tanstack/react-table';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Admin' },
  { id: 2, name: 'María García', email: 'maria@example.com', role: 'User' },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    cell: ({ getValue }) => <span className="badge badge-outline">{getValue() as string}</span>,
  },
];

function MyComponent() {
  return <Table data={users} columns={columns} variant="zebra" enableSorting={true} />;
}
```

## Props

### TableProps<TData>

| Prop                  | Tipo                                   | Defecto                      | Descripción                          |
| --------------------- | -------------------------------------- | ---------------------------- | ------------------------------------ |
| `data`                | `TData[]`                              | **requerido**                | Array de datos a mostrar             |
| `columns`             | `ColumnDef<TData>[]`                   | **requerido**                | Definición de columnas               |
| `variant`             | `'default' \| 'zebra' \| 'bordered'`   | `'default'`                  | Estilo visual de la tabla            |
| `size`                | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`                       | Tamaño de la tabla                   |
| `enableSorting`       | `boolean`                              | `true`                       | Habilitar ordenamiento               |
| `enableFiltering`     | `boolean`                              | `false`                      | Habilitar filtrado                   |
| `enablePagination`    | `boolean`                              | `false`                      | Habilitar paginación                 |
| `paginationSize`      | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'`                       | Tamaño de los botones de paginación  |
| `enableRowSelection`  | `boolean`                              | `false`                      | Habilitar selección de filas         |
| `enableColumnPinning` | `boolean`                              | `false`                      | Habilitar columnas fijas             |
| `highlightOnHover`    | `boolean`                              | `true`                       | Resaltar fila al pasar el mouse      |
| `isLoading`           | `boolean`                              | `false`                      | Mostrar estado de carga              |
| `emptyMessage`        | `string`                               | `'No hay datos disponibles'` | Mensaje cuando no hay datos          |
| `onRowClick`          | `(row: TData) => void`                 | `undefined`                  | Callback al hacer click en una fila  |
| `onRowSelect`         | `(rows: TData[]) => void`              | `undefined`                  | Callback cuando se seleccionan filas |

## Ejemplos de Uso

### Tabla con Selección de Filas

```tsx
<Table
  data={users}
  columns={columns}
  enableRowSelection={true}
  onRowSelect={selectedRows => {
    console.log('Filas seleccionadas:', selectedRows);
  }}
/>
```

### Tabla con Paginación

```tsx
<Table
  data={users}
  columns={columns}
  enablePagination={true}
  initialPagination={{ pageIndex: 0, pageSize: 10 }}
/>
```

### Tabla con Estado de Carga

```tsx
<Table data={[]} columns={columns} isLoading={true} />
```

### Tabla Compacta con Estilo Zebra

```tsx
<Table data={users} columns={columns} variant="zebra" size="xs" />
```

### Columnas Personalizadas

```tsx
const columns: ColumnDef<User>[] = [
  // Columna de selección
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
  },

  // Columna con componente personalizado
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

  // Columna de acciones
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button className="btn btn-ghost btn-xs">Ver</button>
        <button className="btn btn-ghost btn-xs">Editar</button>
        <button className="btn btn-ghost btn-xs text-error">Eliminar</button>
      </div>
    ),
    enableSorting: false,
  },
];
```

## Variantes Disponibles

### Default

Tabla básica sin estilos adicionales.

### Zebra

Filas alternas con colores diferentes para mejor legibilidad.

### Bordered

Tabla con bordes y fondo, ideal para destacar el contenido.

## Tamaños Disponibles

| Tamaño | Descripción                                   |
| ------ | --------------------------------------------- |
| `xs`   | Extra pequeño - ideal para espacios reducidos |
| `sm`   | Pequeño - bueno para listados compactos       |
| `md`   | Mediano - tamaño estándar (por defecto)       |
| `lg`   | Grande - más espacioso                        |
| `xl`   | Extra grande - para interfaces amplias        |

## Integración con React Query

```tsx
import { useQuery } from '@tanstack/react-query';

function UserTable() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <Table
      data={users || []}
      columns={columns}
      isLoading={isLoading}
      variant="zebra"
      enableSorting={true}
      enablePagination={true}
    />
  );
}
```

## Archivo de Ejemplo

Consulta `src/common/components/Table/example.tsx` para ver todos los ejemplos de uso implementados.

## Consideraciones

- El componente es completamente genérico y funciona con cualquier tipo de datos
- Se integra perfectamente con el sistema de temas de DaisyUI
- Optimizado para rendimiento con memoización interna
- Accesible por defecto con soporte completo de teclado
- Responsive design incluido
