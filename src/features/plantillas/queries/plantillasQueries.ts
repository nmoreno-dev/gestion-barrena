import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import {
  getPlantillas,
  getPlantillaById,
  createPlantilla,
  updatePlantilla,
  deletePlantilla,
  checkPlantillaNombreExists,
} from '../api/plantillasApi';
import { Plantilla, UpdatePlantillaData } from '../interfaces/plantilla';

// Query Keys
export const plantillasQueryKeys = {
  all: ['plantillas'] as const,
  lists: () => [...plantillasQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...plantillasQueryKeys.lists(), filters] as const,
  details: () => [...plantillasQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...plantillasQueryKeys.details(), id] as const,
  validation: () => [...plantillasQueryKeys.all, 'validation'] as const,
  checkNombre: (nombre: string, excludeId?: string) =>
    [...plantillasQueryKeys.validation(), 'nombre', nombre, excludeId] as const,
};

// ===== QUERIES =====

/**
 * Hook para obtener todas las plantillas
 */
export function usePlantillas() {
  return useQuery({
    queryKey: plantillasQueryKeys.lists(),
    queryFn: getPlantillas,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para obtener una plantilla específica por ID
 */
export function usePlantilla({ id }: { id: string }) {
  return useQuery({
    queryKey: plantillasQueryKeys.detail(id),
    queryFn: () => getPlantillaById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para verificar si existe una plantilla con un nombre específico
 */
export function useCheckPlantillaNombre({
  nombre,
  excludeId,
}: {
  nombre: string;
  excludeId?: string;
}) {
  return useQuery({
    queryKey: plantillasQueryKeys.checkNombre(nombre, excludeId),
    queryFn: () => checkPlantillaNombreExists(nombre, excludeId),
    enabled: !!nombre.trim(),
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 2, // 2 minutos
  });
}

// ===== MUTATIONS =====

/**
 * Hook para crear una nueva plantilla
 */
export function useCreatePlantilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlantilla,
    onSuccess: (newPlantilla: Plantilla) => {
      // Invalidar y refrescar la lista de plantillas
      queryClient.invalidateQueries({
        queryKey: plantillasQueryKeys.lists(),
      });

      // Agregar la nueva plantilla al cache
      queryClient.setQueryData(plantillasQueryKeys.detail(newPlantilla.id), newPlantilla);

      toast.success(`Plantilla "${newPlantilla.name}" creada exitosamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al crear plantilla: ${error.message}`);
    },
  });
}

/**
 * Hook para actualizar una plantilla existente
 */
export function useUpdatePlantilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlantillaData }) =>
      updatePlantilla(id, data),
    onSuccess: (updatedPlantilla: Plantilla) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: plantillasQueryKeys.lists(),
      });

      // Actualizar el cache de la plantilla específica
      queryClient.setQueryData(plantillasQueryKeys.detail(updatedPlantilla.id), updatedPlantilla);

      toast.success(`Plantilla "${updatedPlantilla.name}" actualizada exitosamente`);
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar plantilla: ${error.message}`);
    },
  });
}

/**
 * Hook para eliminar una plantilla
 */
export function useDeletePlantilla() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlantilla,
    onSuccess: (_, deletedId: string) => {
      // Invalidar la lista de plantillas
      queryClient.invalidateQueries({
        queryKey: plantillasQueryKeys.lists(),
      });

      // Remover la plantilla del cache
      queryClient.removeQueries({
        queryKey: plantillasQueryKeys.detail(deletedId),
      });

      toast.success('Plantilla eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar plantilla: ${error.message}`);
    },
  });
}

// ===== HELPERS =====

/**
 * Hook que combina la funcionalidad de crear y actualizar plantillas
 * Útil para formularios que manejan ambos casos
 */
export function useSavePlantilla() {
  const createMutation = useCreatePlantilla();
  const updateMutation = useUpdatePlantilla();

  return {
    createPlantilla: createMutation.mutate,
    updatePlantilla: (id: string, data: UpdatePlantillaData) => updateMutation.mutate({ id, data }),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    error: createMutation.error || updateMutation.error,
  };
}

/**
 * Hook para obtener estadísticas básicas de plantillas
 */
export function usePlantillasStats() {
  const { data: plantillas = [] } = usePlantillas();

  return {
    totalPlantillas: plantillas.length,
    plantillasRecientes: plantillas.filter(
      plantilla => Date.now() - plantilla.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000, // 7 días
    ).length,
    ultimaActualizacion:
      plantillas.length > 0 ? Math.max(...plantillas.map(p => p.updatedAt.getTime())) : null,
  };
}
