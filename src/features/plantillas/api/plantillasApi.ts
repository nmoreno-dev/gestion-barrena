import { Plantilla, CreatePlantillaData, UpdatePlantillaData } from '../interfaces/plantilla';

const DB_NAME = 'GestionBarrenaDB';
const DB_VERSION = 1;
const STORE_NAME = 'plantillas';

// Configurar IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;

      // Crear store de plantillas si no existe
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

// Generar ID único
function generateId(): string {
  return `plantilla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Obtener todas las plantillas
export async function getPlantillas(): Promise<Plantilla[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const plantillas = request.result.map((plantilla: Plantilla) => ({
        ...plantilla,
        createdAt: new Date(plantilla.createdAt),
        updatedAt: new Date(plantilla.updatedAt),
      }));

      // Ordenar por fecha de creación (más recientes primero)
      plantillas.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      resolve(plantillas);
    };
  });
}

// Obtener una plantilla por ID
export async function getPlantillaById(id: string): Promise<Plantilla | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        resolve({
          ...result,
          createdAt: new Date(result.createdAt),
          updatedAt: new Date(result.updatedAt),
        });
      } else {
        resolve(null);
      }
    };
  });
}

// Crear una nueva plantilla
export async function createPlantilla(data: CreatePlantillaData): Promise<Plantilla> {
  const db = await openDB();

  const now = new Date();
  const plantilla: Plantilla = {
    id: generateId(),
    name: data.name.trim(),
    body: data.body.trim(),
    createdAt: now,
    updatedAt: now,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(plantilla);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(plantilla);
  });
}

// Actualizar una plantilla existente
export async function updatePlantilla(id: string, data: UpdatePlantillaData): Promise<Plantilla> {
  const db = await openDB();

  // Primero obtener la plantilla existente
  const existingPlantilla = await getPlantillaById(id);
  if (!existingPlantilla) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }

  const updatedPlantilla: Plantilla = {
    ...existingPlantilla,
    ...data,
    name: data.name?.trim() ?? existingPlantilla.name,
    body: data.body?.trim() ?? existingPlantilla.body,
    updatedAt: new Date(),
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(updatedPlantilla);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(updatedPlantilla);
  });
}

// Eliminar una plantilla
export async function deletePlantilla(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Verificar si existe una plantilla con el mismo nombre
export async function checkPlantillaNombreExists(
  nombre: string,
  excludeId?: string,
): Promise<boolean> {
  const plantillas = await getPlantillas();

  return plantillas.some(
    plantilla =>
      plantilla.name.toLowerCase() === nombre.toLowerCase() && plantilla.id !== excludeId,
  );
}

// Limpiar todas las plantillas (para testing o reset)
export async function clearAllPlantillas(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export default {
  getPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  checkPlantillaNombreExists,
  clearAllPlantillas,
};
