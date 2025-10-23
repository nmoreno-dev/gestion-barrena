import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/utils/toast';
import {
  getCollections,
  getCollectionById,
  createCollection,
  getDeudoresByCollection,
  saveDeudoresToCollection,
  deleteCollection,
  updateCollectionName,
} from '../api/deudoresCollectionsApi';
import { Deudor } from '../interfaces/deudor';

// Query Keys
export const deudoresQueryKeys = {
  all: ['deudores'] as const,
  collections: () => [...deudoresQueryKeys.all, 'collections'] as const,
  collection: (id: string) => [...deudoresQueryKeys.all, 'collection', id] as const,
  collectionData: (id: string) => [...deudoresQueryKeys.all, 'data', id] as const,
};

// ===== QUERIES - COLLECTIONS =====

/**
 * Hook para obtener todas las colecciones de deudores
 */
export function useDeudoresCollections() {
  return useQuery({
    queryKey: deudoresQueryKeys.collections(),
    queryFn: getCollections,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para obtener una colección específica
 */
export function useDeudorCollection(collectionId: string | null) {
  return useQuery({
    queryKey: deudoresQueryKeys.collection(collectionId || ''),
    queryFn: () => (collectionId ? getCollectionById(collectionId) : null),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

/**
 * Hook para obtener los deudores de una colección
 */
export function useDeudoresByCollection(collectionId: string | null) {
  return useQuery({
    queryKey: deudoresQueryKeys.collectionData(collectionId || ''),
    queryFn: () => (collectionId ? getDeudoresByCollection(collectionId) : []),
    enabled: !!collectionId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

// ===== MUTATIONS - COLLECTIONS =====

/**
 * Hook para crear una nueva colección
 */
export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createCollection(name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collections(),
      });
      toast.success('Nueva tabla creada');
    },
    onError: (error: Error) => {
      toast.error(`Error al crear tabla: ${error.message}`);
    },
  });
}

/**
 * Hook para guardar deudores en una colección
 */
export function useSaveDeudoresToCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      collectionId,
      deudores,
      fileName,
    }: {
      collectionId: string;
      deudores: Deudor[];
      fileName: string;
    }) => saveDeudoresToCollection(collectionId, deudores, fileName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collection(variables.collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collectionData(variables.collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collections(),
      });
      toast.success(`Archivo cargado: ${variables.deudores.length} registros`);
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error(`Error al guardar deudores: ${error.message}`);
    },
  });
}

/**
 * Hook para eliminar una colección
 */
export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.all,
      });
      toast.success('Tabla eliminada correctamente');
    },
    onError: (error: Error) => {
      toast.error(`Error al eliminar tabla: ${error.message}`);
    },
  });
}

/**
 * Hook para actualizar el nombre de una colección
 */
export function useUpdateCollectionName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, name }: { collectionId: string; name: string }) =>
      updateCollectionName(collectionId, name),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collection(variables.collectionId),
      });
      queryClient.invalidateQueries({
        queryKey: deudoresQueryKeys.collections(),
      });
      toast.success('Nombre actualizado');
    },
    onError: (error: Error) => {
      toast.error(`Error al actualizar nombre: ${error.message}`);
    },
  });
}

// ===== HELPERS =====

/**
 * Hook para obtener información de una colección con sus deudores
 */
export function useCollectionInfo(collectionId: string | null) {
  const { data: collection, isLoading: isLoadingCollection } = useDeudorCollection(collectionId);
  const { data: deudores = [], isLoading: isLoadingDeudores } =
    useDeudoresByCollection(collectionId);

  const hasData = !!collection && deudores.length > 0;
  const loadDate = collection?.loadDate ? new Date(collection.loadDate) : null;

  return {
    collection,
    deudores,
    hasData,
    totalRecords: collection?.totalRecords || 0,
    loadDate,
    fileName: collection?.fileName || null,
    isLoading: isLoadingCollection || isLoadingDeudores,
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
