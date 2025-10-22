/**
 * Configuración centralizada de IndexedDB para Gestión Barrena
 *
 * Este archivo gestiona la base de datos y la creación/migración de object stores.
 * Cada feature debe definir su store aquí y usar las funciones exportadas.
 */

export const DB_NAME = 'GestionBarrenaDB';
export const DB_VERSION = 2;

/**
 * Definición de los object stores de la aplicación
 */
export const STORES = {
  DEUDORES: 'deudores',
  PLANTILLAS: 'plantillas',
} as const;

/**
 * Tipo para los nombres de stores
 */
export type StoreName = (typeof STORES)[keyof typeof STORES];

/**
 * Configuración de cada store con sus índices
 */
interface StoreConfig {
  name: StoreName;
  keyPath: string;
  indexes?: Array<{
    name: string;
    keyPath: string;
    options?: IDBIndexParameters;
  }>;
}

/**
 * Definición de stores por versión para facilitar migraciones
 */
const STORE_CONFIGS: Record<number, StoreConfig[]> = {
  1: [
    {
      name: STORES.DEUDORES,
      keyPath: 'id',
    },
  ],
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
};

/**
 * Instancia singleton de la conexión a la base de datos
 */
let dbInstance: IDBDatabase | null = null;

/**
 * Crea un object store con sus índices
 */
function createStore(db: IDBDatabase, config: StoreConfig): void {
  if (!db.objectStoreNames.contains(config.name)) {
    const store = db.createObjectStore(config.name, { keyPath: config.keyPath });

    // Crear índices si están definidos
    if (config.indexes) {
      config.indexes.forEach(index => {
        store.createIndex(index.name, index.keyPath, index.options);
      });
    }

    console.log(`✓ Object store '${config.name}' creado con éxito`);
  }
}

/**
 * Abre la conexión a IndexedDB y maneja las migraciones de versión
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    // Si ya existe una conexión activa, reutilizarla
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error al abrir la base de datos:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;

      // Manejar el cierre inesperado de la conexión
      dbInstance.onversionchange = () => {
        dbInstance?.close();
        dbInstance = null;
        console.warn('La base de datos fue cerrada por otra pestaña');
      };

      resolve(dbInstance);
    };

    request.onupgradeneeded = event => {
      const db = request.result;
      const oldVersion = (event as IDBVersionChangeEvent).oldVersion;

      console.log(`Migrando base de datos de versión ${oldVersion} a ${DB_VERSION}`);

      // Aplicar migraciones incrementales
      for (let version = oldVersion + 1; version <= DB_VERSION; version++) {
        const storeConfigs = STORE_CONFIGS[version];

        if (storeConfigs) {
          storeConfigs.forEach(config => createStore(db, config));
        }
      }

      console.log('Migración completada con éxito');
    };

    request.onblocked = () => {
      console.warn(
        'La actualización de la base de datos está bloqueada. Cierra otras pestañas que usen esta aplicación.',
      );
    };
  });
}

/**
 * Cierra la conexión a la base de datos
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    console.log('Conexión a la base de datos cerrada');
  }
}

/**
 * Elimina completamente la base de datos (útil para desarrollo/testing)
 */
export function deleteDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    closeDB();

    const request = indexedDB.deleteDatabase(DB_NAME);

    request.onsuccess = () => {
      console.log('Base de datos eliminada con éxito');
      resolve();
    };

    request.onerror = () => {
      console.error('Error al eliminar la base de datos:', request.error);
      reject(request.error);
    };

    request.onblocked = () => {
      console.warn(
        'La eliminación de la base de datos está bloqueada. Cierra otras pestañas que usen esta aplicación.',
      );
    };
  });
}

/**
 * Obtiene información sobre la base de datos
 */
export async function getDBInfo(): Promise<{
  name: string;
  version: number;
  stores: string[];
}> {
  const db = await openDB();

  return {
    name: db.name,
    version: db.version,
    stores: Array.from(db.objectStoreNames),
  };
}

/**
 * Hook para usar transacciones de forma segura
 */
export async function withTransaction<T>(
  storeNames: StoreName | StoreName[],
  mode: IDBTransactionMode,
  callback: (stores: IDBObjectStore | IDBObjectStore[]) => Promise<T>,
): Promise<T> {
  const db = await openDB();
  const names = Array.isArray(storeNames) ? storeNames : [storeNames];
  const transaction = db.transaction(names, mode);

  // Obtener los stores
  const stores =
    names.length === 1
      ? transaction.objectStore(names[0])
      : names.map(n => transaction.objectStore(n));

  try {
    const result = await callback(stores);

    // Esperar a que la transacción se complete
    await new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(new Error('Transaction aborted'));
    });

    return result;
  } catch (error) {
    transaction.abort();
    throw error;
  }
}

/**
 * Helper para ejecutar una operación simple en un store
 */
export async function executeStoreOperation<T>(
  storeName: StoreName,
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return withTransaction(storeName, mode, store => {
    return new Promise((resolve, reject) => {
      const request = operation(store as IDBObjectStore);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
}

export default {
  DB_NAME,
  DB_VERSION,
  STORES,
  openDB,
  closeDB,
  deleteDB,
  getDBInfo,
  withTransaction,
  executeStoreOperation,
};
