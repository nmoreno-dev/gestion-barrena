import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import {
  getDeudores,
  saveDeudores,
  updateDeudores,
  clearDeudores,
  getDeudoresStats,
  StoredDeudoresData,
} from '../api/deudoresApi';
import { Deudor } from '../interfaces/deudor';

// Query Keys
export const deudoresQueryKeys = {
  all: ['deudores'] as const,
  lists: () => [...deudoresQueryKeys.all, 'list'] as const,
  list: () => [...deudoresQueryKeys.lists()] as const,
  stats: () => [...deudoresQueryKeys.all, 'stats'] as const,
};

// ===== QUERIES =====

/**
 * Hook para obtener todos los deudores almacenados
 */
export function useDeudores() {
  return useQuery({
    queryKey: deudoresQueryKeys.list(),
    queryFn: getDeudores,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
}

/**
 * Hook para obtener estadísticas de los deudores
 */
export function useDeudoresStats() {
  return useQuery({
    queryKey: deudoresQueryKeys.stats(),
    queryFn: getDeudoresStats,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// ===== MUTATIONS =====

/**
 * Hook para guardar/cargar nuevos deudores desde CSV
 */
export function useSaveDeudores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deudores, fileName }: { deudores: Deudor[]; fileName: string }) =>
      saveDeudores(deudores, fileName),
    onSuccess: (data: StoredDeudoresData) => {
      // Invalidar y refrescar los datos de deudores
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.all,
      });

      // Actualizar el cache directamente
      queryClient.setQueryData(deudoresQueryKeys.list(), data);

      toast.success(`Archivo cargado y guardado: ${data.totalRecords} registros`);
    },
    onError: (error: Error) => {
      toast.error(`Error al guardar deudores: ${error.message}`);
    },
  });
}

/**
 * Hook para actualizar la lista de deudores
 */
export function useUpdateDeudores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deudores, fileName }: { deudores: Deudor[]; fileName?: string }) =>
      updateDeudores(deudores, fileName),
    onSuccess: (data: StoredDeudoresData) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.all,
      });

      // Actualizar el cache
      queryClient.setQueryData(deudoresQueryKeys.list(), data);

      toast.success(`Datos actualizados: ${data.totalRecords} registros`);
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar deudores: ${error.message}`);
    },
  });
}

/**
 * Hook para eliminar todos los deudores
 */
export function useClearDeudores() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearDeudores,
    onSuccess: () => {
      // Invalidar las queries
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.all,
      });

      // Limpiar el cache
      queryClient.setQueryData(deudoresQueryKeys.list(), null);

      toast.success('Datos eliminados correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar datos: ${error.message}`);
    },
  });
}

// ===== HELPERS =====

/**
 * Hook para obtener información formateada de los deudores
 */
export function useDeudoresInfo() {
  const { data: deudoresData, isLoading } = useDeudores();

  const hasData = !!deudoresData;
  const deudores = deudoresData?.deudores || [];
  const totalRecords = deudoresData?.totalRecords || 0;
  const loadDate = deudoresData?.loadDate || null;
  const fileName = deudoresData?.fileName || null;

  return {
    deudores,
    hasData,
    totalRecords,
    loadDate,
    fileName,
    isLoading,
  };
}

/**
 * Formatea la fecha de carga para mostrar al usuario
 */
export function formatLoadDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
