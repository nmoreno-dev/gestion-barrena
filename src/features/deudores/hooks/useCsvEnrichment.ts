import { useCallback } from 'react';
import type { Deudor } from '../interfaces/deudor';
import type { CsvParseStats } from './useCsvParser';
import type { EnrichProgress } from '../utils/gestionesSync';

export interface EnrichmentOptions {
  onProgress?: (stats: CsvParseStats) => void;
  finalStats: CsvParseStats;
}

/**
 * Hook para manejar el enriquecimiento de deudores con gestiones desde la API
 * Separa esta responsabilidad del hook principal de parsing
 */
export function useCsvEnrichment() {
  /**
   * Enriquece un array de deudores con datos de gestión desde la API
   * @param deudores Array de deudores a enriquecer
   * @param options Opciones de progreso y estadísticas
   * @returns Array de deudores enriquecidos con gestiones
   */
  const enrichWithGestiones = useCallback(
    async (deudores: Deudor[], options: EnrichmentOptions): Promise<Deudor[]> => {
      const { onProgress, finalStats } = options;

      if (deudores.length === 0) {
        return deudores;
      }

      try {
        // Importación dinámica para code splitting
        const { enrichDeudoresWithGestiones } = await import('../utils/gestionesSync');

        const enrichedData = await enrichDeudoresWithGestiones(deudores, enrichProgress => {
          // Transformar el progreso de enriquecimiento a CsvParseStats
          const syncMessage = formatSyncMessage(enrichProgress);

          const syncStats: CsvParseStats = {
            ...finalStats,
            isComplete: false,
            progress: Math.round(enrichProgress.percentage),
            syncMessage,
          };

          onProgress?.(syncStats);
        });

        return enrichedData;
      } catch (error) {
        console.error('Error al enriquecer con gestiones:', error);
        // Retornar los datos originales sin enriquecer en caso de error
        return deudores;
      }
    },
    [],
  );

  return {
    enrichWithGestiones,
  };
}

/**
 * Formatea el mensaje de progreso de sincronización
 */
function formatSyncMessage(progress: EnrichProgress): string {
  if (progress.totalBatches > 1) {
    return `Sincronizando batch ${progress.currentBatch} de ${progress.totalBatches}`;
  }
  return 'Sincronizando estados con el servidor';
}
