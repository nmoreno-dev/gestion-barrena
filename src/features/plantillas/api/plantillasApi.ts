import { executeStoreOperation, STORES } from '@/app/db';
import { Plantilla, CreatePlantillaData, UpdatePlantillaData } from '../interfaces/plantilla';

// Generar ID único
function generateId(): string {
  return `plantilla_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Obtener todas las plantillas
export async function getPlantillas(): Promise<Plantilla[]> {
  const plantillas = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store =>
    store.getAll(),
  );

  // Convertir fechas y ordenar
  const processedPlantillas = plantillas.map((plantilla: Plantilla) => ({
    ...plantilla,
    createdAt: new Date(plantilla.createdAt),
    updatedAt: new Date(plantilla.updatedAt),
  }));

  // Ordenar por fecha de creación (más recientes primero)
  processedPlantillas.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return processedPlantillas;
}

// Obtener una plantilla por ID
export async function getPlantillaById(id: string): Promise<Plantilla | null> {
  const result = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store => store.get(id));

  if (result) {
    return {
      ...result,
      createdAt: new Date(result.createdAt),
      updatedAt: new Date(result.updatedAt),
    };
  }

  return null;
}

// Crear una nueva plantilla
export async function createPlantilla(data: CreatePlantillaData): Promise<Plantilla> {
  const now = new Date();
  const plantilla: Plantilla = {
    id: generateId(),
    name: data.name.trim(),
    subject: data.subject.trim(),
    body: data.body.trim(),
    bcc: data.bcc.map(email => email.trim()).filter(email => email.length > 0),
    createdAt: now,
    updatedAt: now,
  };

  await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.add(plantilla));

  return plantilla;
}

// Actualizar una plantilla existente
export async function updatePlantilla(id: string, data: UpdatePlantillaData): Promise<Plantilla> {
  // Primero obtener la plantilla existente
  const existingPlantilla = await getPlantillaById(id);
  if (!existingPlantilla) {
    throw new Error(`Plantilla con ID ${id} no encontrada`);
  }

  const updatedPlantilla: Plantilla = {
    ...existingPlantilla,
    ...data,
    name: data.name?.trim() ?? existingPlantilla.name,
    subject: data.subject?.trim() ?? existingPlantilla.subject,
    body: data.body?.trim() ?? existingPlantilla.body,
    bcc: data.bcc
      ? data.bcc.map(email => email.trim()).filter(email => email.length > 0)
      : existingPlantilla.bcc,
    updatedAt: new Date(),
  };

  await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.put(updatedPlantilla));

  return updatedPlantilla;
}

// Eliminar una plantilla
export async function deletePlantilla(id: string): Promise<void> {
  await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.delete(id));
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
  await executeStoreOperation(STORES.PLANTILLAS, 'readwrite', store => store.clear());
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
