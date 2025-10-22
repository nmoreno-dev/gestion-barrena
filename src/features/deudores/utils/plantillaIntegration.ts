import formatCuil from '@/utils/cuilFormater';
import { Deudor } from '../interfaces/deudor';

/**
 * Integración con el sistema de plantillas
 * Este archivo actúa como adaptador entre deudores y plantillas
 * respetando la screaming architecture
 */

export interface PlantillaData {
  id: string;
  name: string;
  subject: string;
  body: string;
  bcc: string[];
}

/**
 * Procesa una plantilla reemplazando las variables con datos del deudor
 */
export function processPlantillaForDeudor(
  plantilla: PlantillaData,
  deudor: Deudor,
): { subject: string; body: string; bcc: string[] } {
  const replaceVariables = (text: string): string => {
    return text
      .replaceAll('[DEUDOR_NOMBRE]', deudor.nombre)
      .replaceAll('[DEUDOR_CUIL]', formatCuil(deudor.cuil))
      .replaceAll('[NUMERO_CREDITO]', deudor.numeroCredito.toString())
      .replaceAll(
        '[DEUDA_ACTUAL]',
        deudor.deudaActual.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          currencyDisplay: 'symbol',
          style: 'currency',
          currency: 'ARS',
        }),
      )
      .replaceAll(
        '[DEUDA_CANCELATORIA]',
        deudor.deudaCancelatoria.toLocaleString('es-AR', {
          minimumFractionDigits: 2,
          currencyDisplay: 'symbol',
          style: 'currency',
          currency: 'ARS',
        }),
      )
      .replaceAll(
        '[PLAZO_VENCIMIENTO]',
        new Date(Date.now() + 86400000).toLocaleDateString('es-AR'),
      )
      .replaceAll('[ACREEDOR_BANCO]', deudor.acreedor.banco)
      .replaceAll('[ACREEDOR_NOMBRE_EMPRESA]', deudor.acreedor.nombreEmpresa)
      .replaceAll('[ACREEDOR_CUIT]', deudor.acreedor.cuit.toString())
      .replaceAll('[ACREEDOR_CUENTA]', deudor.acreedor.numeroCuenta.toString())
      .replaceAll('[ACREEDOR_ALIAS]', deudor.acreedor.alias)
      .replaceAll('[ACREEDOR_CBU]', deudor.acreedor.CBU.toString())
      .replaceAll(
        '[ACREEDOR_TIPO_CUENTA]',
        deudor.acreedor.tipoCuenta
          ? `TIPO DE CUENTA: ${deudor.acreedor.tipoCuenta}<br><br>`
          : '<br>',
      );
  };

  return {
    subject: replaceVariables(plantilla.subject),
    body: replaceVariables(plantilla.body),
    bcc: plantilla.bcc,
  };
}
