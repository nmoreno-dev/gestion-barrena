import { useQuery } from '@tanstack/react-query';
import { executeStoreOperation, STORES } from '@/app/db';

/**
 * Hook compartido para obtener plantillas en el contexto de deudores
 * Esto respeta la screaming architecture al no crear dependencia directa entre features
 * El feature de deudores no conoce la implementación interna de plantillas
 */

export interface PlantillaForDeudores {
  id: string;
  name: string;
  subject: string;
  body: string;
  bcc: string[];
}

async function getPlantillasForDeudores(): Promise<PlantillaForDeudores[]> {
  try {
    const plantillas = await executeStoreOperation(STORES.PLANTILLAS, 'readonly', store =>
      store.getAll(),
    );

    // Ordenar por fecha de creación (más recientes primero)
    const sortedPlantillas = plantillas
      .map((plantilla: PlantillaForDeudores & { createdAt: Date }) => ({
        id: plantilla.id,
        name: plantilla.name,
        subject: plantilla.subject,
        body: plantilla.body,
        bcc: plantilla.bcc,
        createdAt: new Date(plantilla.createdAt),
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return sortedPlantillas;
  } catch (error) {
    console.error('Error al cargar plantillas:', error);
    return [];
  }
}

export function usePlantillasForDeudores() {
  return useQuery({
    queryKey: ['plantillas-for-deudores'],
    queryFn: getPlantillasForDeudores,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}
