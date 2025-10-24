import { executeStoreOperation, STORES } from '@/app/db';
import { Deudor } from '../interfaces/deudor';

export interface StoredDeudoresData {
  id: string;
  deudores: Deudor[];
  loadDate: Date;
  totalRecords: number;
  fileName: string;
}

const STORAGE_KEY = 'current-deudores';

/**
 * Obtiene todos los deudores almacenados
 */
export async function getDeudores(): Promise<StoredDeudoresData | null> {
  const result = await executeStoreOperation(STORES.DEUDORES_DATA, 'readonly', store =>
    store.get(STORAGE_KEY),
  );

  if (result) {
    return {
      ...result,
      loadDate: new Date(result.loadDate),
    };
  }

  return null;
}

/**
 * Guarda los datos de deudores en IndexedDB
 */
export async function saveDeudores(
  deudores: Deudor[],
  fileName: string,
): Promise<StoredDeudoresData> {
  const now = new Date();
  const dataToStore: StoredDeudoresData = {
    id: STORAGE_KEY,
    deudores,
    loadDate: now,
    totalRecords: deudores.length,
    fileName,
  };

  await executeStoreOperation(STORES.DEUDORES_DATA, 'readwrite', store => store.put(dataToStore));

  console.log(`Guardados ${deudores.length} deudores en IndexedDB`);

  return dataToStore;
}

/**
 * Actualiza la lista de deudores (reemplaza completamente)
 */
export async function updateDeudores(
  deudores: Deudor[],
  fileName?: string,
): Promise<StoredDeudoresData> {
  const existingData = await getDeudores();

  return saveDeudores(deudores, fileName || existingData?.fileName || 'Sin nombre');
}

/**
 * Elimina todos los datos de deudores
 */
export async function clearDeudores(): Promise<void> {
  await executeStoreOperation(STORES.DEUDORES_DATA, 'readwrite', store =>
    store.delete(STORAGE_KEY),
  );
  console.log('Datos de deudores eliminados de IndexedDB');
}

/**
 * Verifica si existen datos guardados
 */
export async function hasDeudores(): Promise<boolean> {
  const data = await getDeudores();
  return !!data;
}

/**
 * Obtiene estadísticas de los datos guardados
 */
export async function getDeudoresStats(): Promise<{
  hasData: boolean;
  recordCount: number;
  loadDate: Date | null;
  fileName: string | null;
}> {
  const storedData = await getDeudores();

  return {
    hasData: !!storedData,
    recordCount: storedData?.totalRecords || 0,
    loadDate: storedData?.loadDate || null,
    fileName: storedData?.fileName || null,
  };
}

export default {
  getDeudores,
  saveDeudores,
  updateDeudores,
  clearDeudores,
  hasDeudores,
  getDeudoresStats,
};
