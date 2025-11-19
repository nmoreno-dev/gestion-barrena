import type { Deudor } from '../interfaces/deudor';
import type { EstadoCredito } from '../interfaces/gestion';
import { batchStatus } from '../api/gestionesApi';

const BATCH_SIZE = 10000; // Máximo permitido por la API

export interface EnrichProgress {
  total: number;
  processed: number;
  percentage: number;
  currentBatch: number;
  totalBatches: number;
}

/**
 * Divide un array en chunks del tamaño especificado
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Enriquece un array de deudores con el estado de gestión más reciente desde la API
 * Procesa en batches de máximo 10,000 créditos para respetar el límite de la API
 * @param deudores Array de deudores parseados del CSV
 * @param onProgress Callback opcional para reportar progreso de sincronización
 * @returns Array de deudores con el estado de gestión aplicado
 */
export async function enrichDeudoresWithGestiones(
  deudores: Deudor[],
  onProgress?: (progress: EnrichProgress) => void,
): Promise<Deudor[]> {
  if (deudores.length === 0) {
    return deudores;
  }

  try {
    // Extraer todos los números de crédito únicos
    const nrosCredito = [...new Set(deudores.map(d => d.numeroCredito))];

    // Dividir en chunks de máximo BATCH_SIZE
    const chunks = chunkArray(nrosCredito, BATCH_SIZE);
    const totalBatches = chunks.length;

    console.log(
      `📊 Sincronizando gestiones: ${nrosCredito.length} créditos únicos en ${totalBatches} batch(es)`,
    );

    // Objeto para almacenar todos los estados recuperados
    const allEstados: Record<string, EstadoCredito | null> = {};

    // Procesar cada batch secuencialmente
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const batchNumber = i + 1;

      console.log(`📦 Procesando batch ${batchNumber}/${totalBatches} (${chunk.length} créditos)`);

      // Reportar progreso antes de la consulta
      onProgress?.({
        total: nrosCredito.length,
        processed: i * BATCH_SIZE,
        percentage: Math.round((i / totalBatches) * 100),
        currentBatch: batchNumber,
        totalBatches,
      });

      try {
        // Consultar el estado en batch
        const response = await batchStatus(chunk);

        // Acumular los estados recuperados
        Object.assign(allEstados, response.estados);

        // Reportar progreso después de la consulta
        onProgress?.({
          total: nrosCredito.length,
          processed: (i + 1) * BATCH_SIZE,
          percentage: Math.round(((i + 1) / totalBatches) * 100),
          currentBatch: batchNumber,
          totalBatches,
        });
      } catch (error) {
        console.error(`❌ Error en batch ${batchNumber}:`, error);
        // Continuar con el siguiente batch aunque falle uno
      }
    }

    console.log(
      `✅ Sincronización completada: ${Object.keys(allEstados).length} estados recuperados`,
    );

    // Enriquecer cada deudor con su estado correspondiente
    return deudores.map(deudor => {
      const estadoCredito = allEstados[deudor.numeroCredito];

      if (estadoCredito) {
        return {
          ...deudor,
          estadoGestion: estadoCredito.estado,
          timestampGestion: estadoCredito.timestamp,
          notasGestion: estadoCredito.notas,
        };
      }

      // Si no tiene gestión, devolver el deudor sin cambios
      return deudor;
    });
  } catch (error) {
    // Si falla la sincronización con la API, registrar error pero no bloquear el flujo
    console.error('Error al sincronizar gestiones con la API:', error);

    // Devolver deudores sin enriquecer
    return deudores;
  }
}
