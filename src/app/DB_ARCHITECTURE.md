# IndexedDB Architecture - Gestión Barrena

## Arquitectura Centralizada de Base de Datos

Esta aplicación utiliza una arquitectura centralizada para gestionar IndexedDB, proporcionando una forma consistente, escalable y fácil de mantener para el almacenamiento local de datos.

## Ubicación y Estructura

```
src/
  app/
    db.ts                    # ⭐ Configuración centralizada de IndexedDB
  features/
    deudores/
      utils/
        localStorage.ts      # API específica para deudores
    plantillas/
      api/
        plantillasApi.ts     # API específica para plantillas
```

## Archivo Central: `db.ts`

### Responsabilidades

- ✅ Configuración de la base de datos (nombre, versión)
- ✅ Definición centralizada de todos los object stores
- ✅ Gestión de migraciones incrementales
- ✅ Conexión singleton a IndexedDB
- ✅ Utilidades para transacciones y operaciones

### Constantes Principales

```typescript
export const DB_NAME = 'GestionBarrenaDB';
export const DB_VERSION = 2;

export const STORES = {
  DEUDORES: 'deudores',
  PLANTILLAS: 'plantillas',
} as const;
```

### Funciones Exportadas

#### `openDB(): Promise<IDBDatabase>`

Abre y retorna la conexión a IndexedDB. Maneja automáticamente las migraciones de versión.

```typescript
import { openDB } from '@/app/db';

const db = await openDB();
```

#### `executeStoreOperation<T>(storeName, mode, operation)`

Helper para ejecutar operaciones simples en un store. **Recomendado para la mayoría de casos de uso**.

```typescript
import { executeStoreOperation, STORES } from '@/app/db';

// GET
const item = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store => store.get(id));

// PUT
await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.put(data));

// DELETE
await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.delete(id));

// GET ALL
const items = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store => store.getAll());
```

#### `withTransaction(storeNames, mode, callback)`

Para operaciones más complejas que requieren múltiples stores o control fino de transacciones.

```typescript
import { withTransaction, STORES } from '@/app/db';

await withTransaction(
  [STORES.DEUDORES, STORES.PLANTILLAS],
  'readwrite',
  async ([deudoresStore, plantillasStore]) => {
    // Operaciones en múltiples stores
  },
);
```

#### `closeDB(): void`

Cierra la conexión a la base de datos.

#### `deleteDB(): Promise<void>`

Elimina completamente la base de datos (útil para desarrollo/testing).

#### `getDBInfo(): Promise<{name, version, stores}>`

Obtiene información sobre la base de datos actual.

## Cómo Agregar un Nuevo Store

### Paso 1: Actualizar la versión de la base de datos

```typescript
// src/app/db.ts
export const DB_VERSION = 3; // Incrementar versión
```

### Paso 2: Agregar el store a la constante STORES

```typescript
// src/app/db.ts
export const STORES = {
  DEUDORES: 'deudores',
  PLANTILLAS: 'plantillas',
  MI_NUEVO_STORE: 'mi_nuevo_store', // ⬅️ Nuevo store
} as const;
```

### Paso 3: Configurar el store en STORE_CONFIGS

```typescript
// src/app/db.ts
const STORE_CONFIGS: Record<number, StoreConfig[]> = {
  1: [{ name: STORES.DEUDORES, keyPath: 'id' }],
  2: [
    {
      name: STORES.PLANTILLAS,
      keyPath: 'id',
      indexes: [
        { name: 'name', keyPath: 'name', options: { unique: false } },
        { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
      ],
    },
  ],
  3: [
    // ⬅️ Nueva versión
    {
      name: STORES.MI_NUEVO_STORE,
      keyPath: 'id',
      indexes: [{ name: 'campo1', keyPath: 'campo1', options: { unique: false } }],
    },
  ],
};
```

### Paso 4: Crear API específica para tu feature

```typescript
// src/features/mi-feature/api/miFeatureApi.ts
import { executeStoreOperation, STORES } from '@/app/db';
import { MiTipo } from '../interfaces/miTipo';

export async function getMisDatos(): Promise<MiTipo[]> {
  return executeStoreOperation(STORES.MI_NUEVO_STORE, 'readonly', store => store.getAll());
}

export async function crearDato(data: MiTipo): Promise<void> {
  await executeStoreOperation(STORES.MI_NUEVO_STORE, 'readwrite', store => store.add(data));
}
```

## Migraciones

Las migraciones son **incrementales** y se aplican automáticamente cuando el usuario abre la aplicación:

- ✅ **Versión 1**: Crea el store `deudores`
- ✅ **Versión 2**: Crea el store `plantillas` con índices
- ⏳ **Versión 3+**: Agrega aquí tus nuevos stores

El sistema garantiza que:

1. Los usuarios con la base de datos existente reciban solo las migraciones necesarias
2. Los nuevos usuarios reciban todas las migraciones en orden
3. No se pierden datos durante las actualizaciones
4. Los índices se crean correctamente

## Patrones de Uso en Features

### Ejemplo: Deudores (`features/deudores/utils/localStorage.ts`)

```typescript
import { executeStoreOperation, STORES } from '@/app/db';

export const saveDeudoresToStorage = async (deudores, fileName) => {
  const dataToStore = {
    id: 'current-deudores',
    deudores,
    loadDate: new Date().toISOString(),
    totalRecords: deudores.length,
    fileName,
  };

  await executeStoreOperation(STORES.DEUDORES, 'readwrite', store => store.put(dataToStore));
};
```

### Ejemplo: Plantillas (`features/plantillas/api/plantillasApi.ts`)

```typescript
import { executeStoreOperation, STORES } from '@/app/db';

export async function getPlantillas() {
  const plantillas = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store =>
    store.getAll(),
  );

  return plantillas.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
```

## Ventajas de esta Arquitectura

### ✅ Centralización

- Un solo lugar para gestionar la base de datos
- Configuración consistente en toda la aplicación
- Fácil de mantener y actualizar

### ✅ Escalabilidad

- Agregar nuevos stores es simple y seguro
- Migraciones automáticas e incrementales
- Soporte para múltiples features

### ✅ Type Safety

- TypeScript garantiza que uses stores válidos
- Autocompletado en el IDE
- Detección de errores en tiempo de compilación

### ✅ Simplicidad

- API limpia y fácil de usar
- Helpers para operaciones comunes
- Menos código boilerplate en features

### ✅ Mantenibilidad

- Cambios a la base de datos en un solo lugar
- Migraciones versionadas y trackeables
- Documentación centralizada

## Debugging

### Ver el contenido de IndexedDB

Chrome DevTools > Application > Storage > IndexedDB > GestionBarrenaDB

### Logs útiles

El sistema imprime logs informativos:

```
✓ Object store 'deudores' creado con éxito
✓ Object store 'plantillas' creado con éxito
Migrando base de datos de versión 1 a 2
Migración completada con éxito
```

### Resetear la base de datos

```typescript
import { deleteDB } from '@/app/db';

// En la consola del navegador o en código de desarrollo
await deleteDB();
```

## Best Practices

1. **Usa `executeStoreOperation` para operaciones simples**: Es más conciso y maneja errores automáticamente.

2. **Usa `withTransaction` para operaciones complejas**: Cuando necesites múltiples stores o control fino.

3. **Siempre incrementa DB_VERSION**: Cada cambio estructural requiere una nueva versión.

4. **Mantén las APIs de features separadas**: Cada feature debe tener su propio archivo de operaciones.

5. **Documenta tus migraciones**: Agrega comentarios explicando qué hace cada versión.

6. **Valida datos antes de guardar**: Asegúrate de que los datos cumplan el esquema esperado.

7. **Maneja errores apropiadamente**: Captura excepciones y proporciona feedback al usuario.

## Soporte Multi-pestaña

El sistema maneja automáticamente situaciones donde la aplicación está abierta en múltiples pestañas:

- Cierra conexiones cuando se detecta un cambio de versión
- Advierte sobre actualizaciones bloqueadas
- Gestiona correctamente el evento `onversionchange`

## Más Información

- [IndexedDB API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Using IndexedDB - MDN Guide](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)
