import { Deudor } from '@/features/deudores/interfaces/deudor';
import { Banco } from '@/features/deudores/interfaces/acreedor';
import formatCuil from '@/utils/cuilFormater';
import { Plantilla } from '../interfaces/plantilla';

/**
 * Procesa una plantilla reemplazando las variables de template por datos reales del deudor
 * Utiliza el mismo sistema de template strings que messageTemplate.ts
 */
export function processPlantilla(plantilla: Plantilla, deudor: Deudor): string {
  return plantilla.body
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
    .replaceAll('[PLAZO_VENCIMIENTO]', new Date(Date.now() + 86400000).toLocaleDateString('es-AR'))
    .replaceAll('[ACREEDOR_BANCO]', deudor.acreedor.banco)
    .replaceAll('[ACREEDOR_NOMBRE_EMPRESA]', deudor.acreedor.nombreEmpresa)
    .replaceAll('[ACREEDOR_CUIT]', deudor.acreedor.cuit.toString())
    .replaceAll('[ACREEDOR_CUENTA]', deudor.acreedor.numeroCuenta.toString())
    .replaceAll('[ACREEDOR_ALIAS]', deudor.acreedor.alias)
    .replaceAll('[ACREEDOR_CBU]', deudor.acreedor.CBU.toString())
    .replaceAll(
      '[ACREEDOR_TIPO_CUENTA]',
      deudor.acreedor.tipoCuenta ? `TIPO DE CUENTA: ${deudor.acreedor.tipoCuenta}<br><br>` : '<br>',
    );
}

/**
 * Obtiene datos de ejemplo para previsualizar una plantilla
 * Útil para mostrar cómo se verá la plantilla sin tener que seleccionar un deudor específico
 */
export function getExampleDeudorData(): Deudor {
  return {
    cuil: '20123456789',
    nombre: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 9 11 1234-5678',
    numeroCredito: '123456',
    deudaActual: 15000.5,
    deudaCancelatoria: 18500.75,
    acreedor: {
      id: 'ejemplo',
      nombre: 'ADELANTOS',
      nombreEmpresa: 'ADELANTOS.COM',
      banco: Banco.BBVA,
      nombreCortoBanco: 'BBVA',
      cuit: '30-12345678-9',
      numeroCuenta: '1234567890',
      CBU: '0110599520000012345678',
      alias: 'ADELANTOS.EMPRESA',
      tipoCuenta: 'Cuenta Corriente',
    },
  };
}

/**
 * Valida si una plantilla tiene variables de template válidas
 * Retorna las variables encontradas y las que no son válidas
 */
export function validatePlantillaVariables(body: string): {
  validVariables: string[];
  invalidVariables: string[];
  totalVariables: number;
} {
  // Buscar todas las variables en formato [VARIABLE_NAME]
  const variableRegex = /\[([A-Z_]+)\]/g;
  const foundVariables = [...body.matchAll(variableRegex)].map(match => match[0]);

  // Variables válidas según el sistema existente
  const validVariableNames = [
    '[DEUDOR_NOMBRE]',
    '[DEUDOR_CUIL]',
    '[NUMERO_CREDITO]',
    '[DEUDA_ACTUAL]',
    '[DEUDA_CANCELATORIA]',
    '[PLAZO_VENCIMIENTO]',
    '[ACREEDOR_BANCO]',
    '[ACREEDOR_NOMBRE_EMPRESA]',
    '[ACREEDOR_CUIT]',
    '[ACREEDOR_CUENTA]',
    '[ACREEDOR_CBU]',
    '[ACREEDOR_ALIAS]',
    '[ACREEDOR_TIPO_CUENTA]',
  ];

  const uniqueFoundVariables = [...new Set(foundVariables)];
  const validVariables = uniqueFoundVariables.filter(variable =>
    validVariableNames.includes(variable),
  );
  const invalidVariables = uniqueFoundVariables.filter(
    variable => !validVariableNames.includes(variable),
  );

  return {
    validVariables,
    invalidVariables,
    totalVariables: foundVariables.length,
  };
}
