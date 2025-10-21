import type { Deudor } from '../interfaces/deudor';

// Configuración de IndexedDB
const DB_NAME = 'GestionBarrenaDB';
const DB_VERSION = 1;
const STORE_NAME = 'deudores';

export interface StoredDeudoresData {
  id: string;
  deudores: Deudor[];
  loadDate: string;
  totalRecords: number;
  fileName: string;
}

// Variable para mantener la referencia a la DB
let dbInstance: IDBDatabase | null = null;

/**
 * Abre la conexión a IndexedDB
 */
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Error al abrir la base de datos'));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Crear el store si no existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        console.log('Store de deudores creado');
      }
    };
  });
};

/**
 * Guarda los datos de deudores en IndexedDB
 */
export const saveDeudoresToStorage = async (
  deudores: Deudor[],
  fileName: string,
): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const dataToStore: StoredDeudoresData = {
      id: 'current-deudores',
      deudores,
      loadDate: new Date().toISOString(),
      totalRecords: deudores.length,
      fileName,
    };

    const request = store.put(dataToStore);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`Guardados ${deudores.length} deudores en IndexedDB`);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Error al guardar datos en IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error al guardar datos en IndexedDB:', error);
    throw new Error('No se pudieron guardar los datos localmente');
  }
};

/**
 * Carga los datos de deudores desde IndexedDB
 */
export const loadDeudoresFromStorage = async (): Promise<StoredDeudoresData | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get('current-deudores');

    return new Promise(resolve => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log(`Cargados ${result.deudores.length} deudores desde IndexedDB`);
        }
        resolve(result || null);
      };

      request.onerror = () => {
        console.error('Error al cargar datos desde IndexedDB');
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Error al acceder a IndexedDB:', error);
    return null;
  }
};

/**
 * Verifica si existen datos guardados en IndexedDB
 */
export const hasStoredDeudores = async (): Promise<boolean> => {
  try {
    const storedData = await loadDeudoresFromStorage();
    return !!storedData;
  } catch (error) {
    console.error('Error al verificar datos en IndexedDB:', error);
    return false;
  }
};

/**
 * Obtiene la fecha de la última carga
 */
export const getLastLoadDate = async (): Promise<Date | null> => {
  try {
    const storedData = await loadDeudoresFromStorage();
    return storedData ? new Date(storedData.loadDate) : null;
  } catch (error) {
    console.error('Error al obtener fecha de última carga:', error);
    return null;
  }
};

/**
 * Elimina todos los datos de deudores de IndexedDB
 */
export const clearStoredDeudores = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete('current-deudores');

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log('Datos eliminados de IndexedDB');
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Error al eliminar datos de IndexedDB'));
      };
    });
  } catch (error) {
    console.error('Error al eliminar datos de IndexedDB:', error);
    throw new Error('No se pudieron eliminar los datos locales');
  }
};

/**
 * Obtiene estadísticas básicas de los datos guardados
 */
export const getStorageStats = async (): Promise<{
  hasData: boolean;
  recordCount: number;
  loadDate: Date | null;
  fileName: string | null;
}> => {
  try {
    const storedData = await loadDeudoresFromStorage();

    return {
      hasData: !!storedData,
      recordCount: storedData?.totalRecords || 0,
      loadDate: storedData ? new Date(storedData.loadDate) : null,
      fileName: storedData?.fileName || null,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      hasData: false,
      recordCount: 0,
      loadDate: null,
      fileName: null,
    };
  }
};

/**
 * Formatea la fecha de carga para mostrar al usuario
 */
export const formatLoadDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};
