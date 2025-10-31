import { executeStoreOperation, executeIndexOperation, STORES, withTransaction } from '@/app/db';
import type { Deudor } from '../interfaces/deudor';
import type { DeudorCollection, DeudorData } from '../interfaces/collection';

/**
 * Crea una nueva colección de deudores
 */
export async function createCollection(name: string, color: string = 'blue-500'): Promise<string> {
  const id = crypto.randomUUID();
  const order = await getNextOrder();

  const collection: DeudorCollection = {
    id,
    name,
    color,
    createdAt: Date.now(),
    totalRecords: 0,
    order,
  };

  await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readwrite', store =>
    store.add(collection),
  );

  console.log(`✓ Colección "${name}" creada con id: ${id}`);
  return id;
}

/**
 * Obtiene el siguiente número de orden para colecciones
 */
async function getNextOrder(): Promise<number> {
  const collections = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.getAll(),
  );

  if (collections.length === 0) return 0;

  const maxOrder = Math.max(...collections.map((c: DeudorCollection) => c.order));
  return maxOrder + 1;
}

/**
 * Obtiene todas las colecciones ordenadas
 */
export async function getCollections(): Promise<DeudorCollection[]> {
  const collections = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.getAll(),
  );

  return collections.sort((a: DeudorCollection, b: DeudorCollection) => a.order - b.order);
}

/**
 * Obtiene una colección por su ID
 */
export async function getCollectionById(collectionId: string): Promise<DeudorCollection | null> {
  const collection = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.get(collectionId),
  );

  return collection || null;
}

/**
 * Guarda deudores en una colección específica
 */
export async function saveDeudoresToCollection(
  collectionId: string,
  deudores: Deudor[],
  fileName: string,
): Promise<void> {
  // Primero obtenemos los deudores existentes para eliminarlos
  const existingDeudores = await getDeudoresByCollectionIds(collectionId);

  await withTransaction(
    [STORES.DEUDORES_COLLECTIONS, STORES.DEUDORES_DATA],
    'readwrite',
    async stores => {
      const [collectionsStore, dataStore] = stores as IDBObjectStore[];

      // Obtener metadata de la colección
      const collection = await new Promise<DeudorCollection>((resolve, reject) => {
        const req = collectionsStore.get(collectionId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => {
          console.error('Error obteniendo colección:', req.error);
          reject(req.error);
        };
      });

      if (!collection) {
        throw new Error(`Colección ${collectionId} no encontrada`);
      }

      // Eliminar deudores existentes de esta colección
      for (const deudor of existingDeudores) {
        if (deudor.id !== undefined) {
          dataStore.delete(deudor.id);
        }
      }

      // Actualizar metadata
      collection.fileName = fileName;
      collection.loadDate = Date.now();
      collection.totalRecords = deudores.length;
      collectionsStore.put(collection);

      // Guardar nuevos deudores con campos comprimidos
      for (const deudor of deudores) {
        const deudorData: DeudorData = {
          cid: collectionId, // campo comprimido
          ...deudor,
        };
        dataStore.add(deudorData); // id auto-generado
      }

      console.log(`✓ Guardados ${deudores.length} deudores en colección "${collection.name}"`);
    },
  );
}

/**
 * Obtiene los DeudorData (con ids) de una colección - uso interno
 */
async function getDeudoresByCollectionIds(collectionId: string): Promise<DeudorData[]> {
  return executeIndexOperation(STORES.DEUDORES_DATA, 'cid', index => index.getAll(collectionId));
}

/**
 * Obtiene todos los deudores de una colección
 */
export async function getDeudoresByCollection(collectionId: string): Promise<Deudor[]> {
  const result = await executeIndexOperation(STORES.DEUDORES_DATA, 'cid', index =>
    index.getAll(collectionId),
  );

  // Remover el id y cid para devolver solo los datos del Deudor
  return result.map((data: DeudorData) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, cid, ...deudor } = data;
    return deudor as Deudor;
  });
}

/**
 * Elimina una colección y todos sus deudores
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  // Primero obtener la colección y sus deudores para logging
  const collection = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.get(collectionId),
  );
  const deudores = await getDeudoresByCollectionIds(collectionId);

  await withTransaction(
    [STORES.DEUDORES_COLLECTIONS, STORES.DEUDORES_DATA],
    'readwrite',
    async stores => {
      const [collectionsStore, dataStore] = stores as IDBObjectStore[];

      // Eliminar metadata de la colección
      collectionsStore.delete(collectionId);

      // Eliminar todos los deudores de esta colección
      for (const deudor of deudores) {
        if (deudor.id !== undefined) {
          dataStore.delete(deudor.id);
        }
      }
    },
  );

  console.log(`✓ Colección "${collection?.name}" eliminada con ${deudores.length} deudores`);
}

/**
 * Actualiza el nombre de una colección
 */
export async function updateCollectionName(collectionId: string, name: string): Promise<void> {
  const collection = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.get(collectionId),
  );

  if (!collection) {
    throw new Error(`Colección ${collectionId} no encontrada`);
  }

  collection.name = name;

  await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readwrite', store =>
    store.put(collection),
  );
}

/**
 * Actualiza el color de una colección
 */
export async function updateCollectionColor(collectionId: string, color: string): Promise<void> {
  const collection = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.get(collectionId),
  );

  if (!collection) {
    throw new Error(`Colección ${collectionId} no encontrada`);
  }

  collection.color = color;

  await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readwrite', store =>
    store.put(collection),
  );
}

/**
 * Actualiza el orden de las colecciones
 */
export async function reorderCollections(collectionIds: string[]): Promise<void> {
  const collections = await executeStoreOperation(STORES.DEUDORES_COLLECTIONS, 'readonly', store =>
    store.getAll(),
  );

  const collectionsMap = new Map(collections.map((c: DeudorCollection) => [c.id, c]));

  await withTransaction([STORES.DEUDORES_COLLECTIONS], 'readwrite', async stores => {
    const [collectionsStore] = stores as IDBObjectStore[];

    for (let i = 0; i < collectionIds.length; i++) {
      const collection = collectionsMap.get(collectionIds[i]);
      if (collection) {
        collection.order = i;
        collectionsStore.put(collection);
      }
    }
  });
}

/**
 * Actualiza un deudor específico en una colección
 */
export async function updateDeudorInCollection(
  collectionId: string,
  numeroCredito: string,
  updates: Partial<Deudor>,
): Promise<void> {
  const allDeudores = await getDeudoresByCollectionIds(collectionId);

  // Buscar el deudor por número de crédito
  const deudorData = allDeudores.find((d: DeudorData) => d.numeroCredito === numeroCredito);

  if (!deudorData || deudorData.id === undefined) {
    throw new Error(
      `Deudor con número de crédito ${numeroCredito} no encontrado en colección ${collectionId}`,
    );
  }

  // Actualizar el deudor con los nuevos datos
  const updatedDeudor: DeudorData = {
    ...deudorData,
    ...updates,
  };

  await executeStoreOperation(STORES.DEUDORES_DATA, 'readwrite', store => store.put(updatedDeudor));

  console.log(
    `✓ Deudor con nro. crédito ${numeroCredito} actualizado en colección ${collectionId}`,
  );
}
