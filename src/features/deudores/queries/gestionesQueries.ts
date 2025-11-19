import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateGestionDto, UpdateGestionDto, Gestion } from '../interfaces/gestion';
import {
  createGestion,
  batchStatus,
  getGestionesByCredito,
  getGestionById,
  updateGestion,
  deleteGestion,
} from '../api/gestionesApi';

// Query keys para el cache de gestiones
export const gestionesKeys = {
  all: ['gestiones'] as const,
  byCredito: (nroCredito: string) => [...gestionesKeys.all, 'credito', nroCredito] as const,
  byId: (id: string) => [...gestionesKeys.all, 'id', id] as const,
  batchStatus: (nrosCredito: string[]) => [...gestionesKeys.all, 'batch', nrosCredito] as const,
};

/**
 * Hook para consultar el estado en batch de múltiples créditos
 * Por defecto está deshabilitado para uso manual con refetch()
 * @param nrosCredito - Array de números de crédito a consultar
 * @param options - Opciones adicionales de React Query (ej: enabled, refetchInterval, etc)
 */
export const useBatchStatus = (
  nrosCredito: string[],
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: gestionesKeys.batchStatus(nrosCredito),
    queryFn: () => batchStatus(nrosCredito),
    enabled: options?.enabled ?? false,
  });
};

/**
 * Hook para consultar todas las gestiones de un crédito específico
 */
export const useGestionesByCredito = (nroCredito: string) => {
  return useQuery({
    queryKey: gestionesKeys.byCredito(nroCredito),
    queryFn: () => getGestionesByCredito(nroCredito),
    enabled: !!nroCredito,
  });
};

/**
 * Hook para consultar una gestión por su ID
 */
export const useGestionById = (id: string) => {
  return useQuery({
    queryKey: gestionesKeys.byId(id),
    queryFn: () => getGestionById(id),
    enabled: !!id,
  });
};

/**
 * Hook para crear una nueva gestión
 * Invalida los queries relacionados después de crear
 */
export const useCreateGestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateGestionDto) => createGestion(dto),
    onSuccess: (data: Gestion) => {
      // Invalidar queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: gestionesKeys.byCredito(data.nroCredito) });
      queryClient.invalidateQueries({ queryKey: gestionesKeys.all });
    },
  });
};

/**
 * Hook para actualizar una gestión existente
 */
export const useUpdateGestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateGestionDto }) => updateGestion(id, dto),
    onSuccess: (data: Gestion) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: gestionesKeys.byId(data.id) });
      queryClient.invalidateQueries({ queryKey: gestionesKeys.byCredito(data.nroCredito) });
      queryClient.invalidateQueries({ queryKey: gestionesKeys.all });
    },
  });
};

/**
 * Hook para eliminar (soft delete) una gestión
 */
export const useDeleteGestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteGestion(id),
    onSuccess: () => {
      // Invalidar todos los queries de gestiones
      queryClient.invalidateQueries({ queryKey: gestionesKeys.all });
    },
  });
};
