import { executeStoreOperation, STORES } from '@/app/db';
import type { Deudor } from '../interfaces/deudor';

export interface StoredDeudoresData {
  id: string;
  deudores: Deudor[];
  loadDate: string;
  totalRecords: number;
  fileName: string;
}

const STORAGE_KEY = 'current-deudores';

/**
 * Guarda los datos de deudores en IndexedDB
 */
export const saveDeudoresToStorage = async (
  deudores: Deudor[],
  fileName: string,
): Promise<void> => {
  try {
    const dataToStore: StoredDeudoresData = {
      id: STORAGE_KEY,
      deudores,
      loadDate: new Date().toISOString(),
      totalRecords: deudores.length,
      fileName,
    };

    await executeStoreOperation(STORES.DEUDORES_DATA, 'readwrite', store => store.put(dataToStore));

    console.log(`Guardados ${deudores.length} deudores en IndexedDB`);
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
    const result = await executeStoreOperation(STORES.DEUDORES_DATA, 'readonly', store =>
      store.get(STORAGE_KEY),
    );

    if (result) {
      console.log(`Cargados ${result.deudores.length} deudores desde IndexedDB`);
    }

    return result || null;
  } catch (error) {
    console.error('Error al cargar datos desde IndexedDB:', error);
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
    await executeStoreOperation(STORES.DEUDORES_DATA, 'readwrite', store =>
      store.delete(STORAGE_KEY),
    );

    console.log('Datos eliminados de IndexedDB');
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
