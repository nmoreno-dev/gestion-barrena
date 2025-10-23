import { executeStoreOperation, STORES, openDB, withTransaction } from '@/app/db';
import type { Deudor } from '../interfaces/deudor';
import type { DeudorCollection, DeudorData } from '../interfaces/collection';

/**
 * Crea una nueva colección de deudores
 */
export async function createCollection(name: string): Promise<string> {
  const id = crypto.randomUUID();
  const order = await getNextOrder();

  const collection: DeudorCollection = {
    id,
    name,
    createdAt: new Date().toISOString(),
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

      // Actualizar metadata de la colección
      const collection = await new Promise<DeudorCollection>((resolve, reject) => {
        const req = collectionsStore.get(collectionId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (!collection) {
        throw new Error(`Colección ${collectionId} no encontrada`);
      }

      // Eliminar deudores existentes de esta colección
      for (const deudor of existingDeudores) {
        dataStore.delete(deudor.id);
      }

      // Actualizar metadata
      collection.fileName = fileName;
      collection.loadDate = new Date().toISOString();
      collection.totalRecords = deudores.length;
      collectionsStore.put(collection);

      // Guardar nuevos deudores
      for (const deudor of deudores) {
        const deudorData: DeudorData = {
          id: crypto.randomUUID(),
          collectionId,
          ...deudor,
        };
        dataStore.add(deudorData);
      }

      console.log(`✓ Guardados ${deudores.length} deudores en colección "${collection.name}"`);
    },
  );
}

/**
 * Obtiene los DeudorData (con ids) de una colección - uso interno
 */
async function getDeudoresByCollectionIds(collectionId: string): Promise<DeudorData[]> {
  const db = await openDB();
  const transaction = db.transaction(STORES.DEUDORES_DATA, 'readonly');
  const store = transaction.objectStore(STORES.DEUDORES_DATA);
  const index = store.index('collectionId');

  return new Promise((resolve, reject) => {
    const request = index.getAll(collectionId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Obtiene todos los deudores de una colección
 */
export async function getDeudoresByCollection(collectionId: string): Promise<Deudor[]> {
  const db = await openDB();
  const transaction = db.transaction(STORES.DEUDORES_DATA, 'readonly');
  const store = transaction.objectStore(STORES.DEUDORES_DATA);
  const index = store.index('collectionId');

  return new Promise((resolve, reject) => {
    const request = index.getAll(collectionId);
    request.onsuccess = () => {
      // Remover el id y collectionId para devolver solo los datos del Deudor
      const deudores = request.result.map((data: DeudorData) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, collectionId: _collectionId, ...deudor } = data;
        return deudor as Deudor;
      });
      resolve(deudores);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Elimina una colección y todos sus deudores
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  await withTransaction(
    [STORES.DEUDORES_COLLECTIONS, STORES.DEUDORES_DATA],
    'readwrite',
    async stores => {
      const [collectionsStore, dataStore] = stores as IDBObjectStore[];

      // Obtener la colección para logging
      const collection = await new Promise<DeudorCollection | undefined>((resolve, reject) => {
        const req = collectionsStore.get(collectionId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      // Eliminar metadata de la colección
      collectionsStore.delete(collectionId);

      // Eliminar todos los deudores de esta colección
      const db = await openDB();
      const index = db
        .transaction(STORES.DEUDORES_DATA, 'readonly')
        .objectStore(STORES.DEUDORES_DATA)
        .index('collectionId');

      const deudores = await new Promise<DeudorData[]>((resolve, reject) => {
        const req = index.getAll(collectionId);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      for (const deudor of deudores) {
        dataStore.delete(deudor.id);
      }

      console.log(`✓ Colección "${collection?.name}" eliminada con ${deudores.length} deudores`);
    },
  );
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
