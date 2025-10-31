import type { Deudor } from '../interfaces/deudor';
import { batchStatus } from '../api/gestionesApi';

/**
 * Enriquece un array de deudores con el estado de gestión más reciente desde la API
 * @param deudores Array de deudores parseados del CSV
 * @returns Array de deudores con el estado de gestión aplicado
 */
export async function enrichDeudoresWithGestiones(deudores: Deudor[]): Promise<Deudor[]> {
  if (deudores.length === 0) {
    return deudores;
  }

  try {
    // Extraer todos los números de crédito únicos
    const nrosCredito = [...new Set(deudores.map(d => d.numeroCredito))];

    // Consultar el estado en batch
    const response = await batchStatus(nrosCredito);

    // Enriquecer cada deudor con su estado correspondiente
    return deudores.map(deudor => {
      const estadoCredito = response.estados[deudor.numeroCredito];

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
