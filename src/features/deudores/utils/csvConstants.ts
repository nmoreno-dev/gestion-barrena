import type Papa from 'papaparse';

/**
 * Campos requeridos en el CSV de deudores
 * Orden esperado en el archivo CSV (sin header)
 */
export const REQUIRED_FIELDS = [
  'CUIL',
  'TITULAR',
  'MAIL',
  'TELEFONO',
  'COLOCADOR',
  'DEUDA ACTUAL',
  'DEUDA CANCELATORIA',
  'N° DE CRÉDITO',
] as const;

/**
 * Configuración por defecto para PapaParse
 */
export const PAPA_PARSE_CONFIG: Partial<Papa.ParseConfig> = {
  header: false,
  skipEmptyLines: 'greedy',
  delimiter: '', // autodetecta (, ; \t)
  dynamicTyping: false,
  worker: true, // Usar Web Worker para no bloquear la UI
  chunkSize: 1024 * 10, // 10KB chunks para mejor control de progreso
};

/**
 * Número mínimo de columnas esperadas en cada fila
 */
export const MIN_COLUMNS = REQUIRED_FIELDS.length;
