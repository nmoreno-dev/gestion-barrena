/**
 * Configuración centralizada de IndexedDB para Gestión Barrena
 *
 * Este archivo gestiona la base de datos y la creación/migración de object stores.
 * Cada feature debe definir su store aquí y usar las funciones exportadas.
 */

export const DB_NAME = 'GestionBarrenaDB';
export const DB_VERSION = 3;

/**
 * Definición de los object stores de la aplicación
 */
export const STORES = {
  DEUDORES_COLLECTIONS: 'deudores_collections',
  DEUDORES_DATA: 'deudores_data',
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
  autoIncrement?: boolean; // Para optimizar con auto-IDs
  indexes?: Array<{
    name: string;
    keyPath: string;
    options?: IDBIndexParameters;
  }>;
}

/**
 * Definición de todos los stores de la aplicación
 * Optimizado para reducir footprint de almacenamiento:
 * - Auto-increment IDs para datos de alto volumen (ahorra ~720KB con 20k registros)
 * - Nombres de campos comprimidos: collectionId -> cid (ahorra ~2MB)
 * - Timestamps en lugar de ISO strings (ahorra ~480KB)
 */
const STORE_CONFIGS: StoreConfig[] = [
  {
    name: STORES.DEUDORES_COLLECTIONS,
    keyPath: 'id',
    autoIncrement: false, // UUID para metadata (bajo volumen)
    indexes: [{ name: 'order', keyPath: 'order', options: { unique: false } }],
  },
  {
    name: STORES.DEUDORES_DATA,
    keyPath: 'id',
    autoIncrement: true, // Auto-increment para optimizar espacio
    indexes: [
      { name: 'cid', keyPath: 'cid', options: { unique: false } }, // collectionId comprimido
    ],
  },
  {
    name: STORES.PLANTILLAS,
    keyPath: 'id',
    autoIncrement: false,
    indexes: [
      { name: 'name', keyPath: 'name', options: { unique: false } },
      { name: 'createdAt', keyPath: 'createdAt', options: { unique: false } },
    ],
  },
];

/**
 * Instancia singleton de la conexión a la base de datos
 */
let dbInstance: IDBDatabase | null = null;

/**
 * Crea un object store con sus índices
 */
function createStore(db: IDBDatabase, config: StoreConfig): void {
  if (!db.objectStoreNames.contains(config.name)) {
    const store = db.createObjectStore(config.name, {
      keyPath: config.keyPath,
      autoIncrement: config.autoIncrement,
    });

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

    request.onupgradeneeded = () => {
      const db = request.result;

      console.log(`Inicializando base de datos versión ${DB_VERSION}`);

      // Eliminar todos los stores existentes para partir limpio
      const existingStores = Array.from(db.objectStoreNames);
      existingStores.forEach(storeName => {
        db.deleteObjectStore(storeName);
        console.log(`✓ Object store '${storeName}' eliminado`);
      });

      // Crear todos los stores necesarios
      STORE_CONFIGS.forEach(config => createStore(db, config));

      console.log('Base de datos inicializada con éxito');
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
      transaction.onerror = () => {
        console.error('Error en transacción:', transaction.error);
        reject(transaction.error);
      };
      transaction.onabort = () => {
        console.error('Transacción abortada');
        reject(new Error('Transaction aborted'));
      };
    });

    return result;
  } catch (error) {
    console.error('Error ejecutando transacción:', error);
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
      request.onerror = () => {
        console.error('Error en operación de store:', request.error);
        reject(request.error);
      };
    });
  });
}

/**
 * Helper para ejecutar una operación en un índice
 */
export async function executeIndexOperation<T>(
  storeName: StoreName,
  indexName: string,
  operation: (index: IDBIndex) => IDBRequest<T>,
): Promise<T> {
  return withTransaction(storeName, 'readonly', store => {
    return new Promise((resolve, reject) => {
      const index = (store as IDBObjectStore).index(indexName);
      const request = operation(index);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.error(`Error en operación de índice '${indexName}':`, request.error);
        reject(request.error);
      };
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
  executeIndexOperation,
};
