/**
 * Estados posibles de una gestión de cobro
 */
export type EstadoGestion = 'pendiente' | 'gestionado' | 'contactado';

/**
 * Entidad completa de una gestión retornada por la API
 */
export interface Gestion {
  id: string; // UUID
  cuil: string; // 11 dígitos
  nroCredito: string; // Identificador del crédito
  estado: EstadoGestion;
  timestamp: string; // ISO 8601 date string
  notas?: string; // Texto libre, máx 1000 chars
  snapshotMonto?: number; // Monto del crédito al momento de la gestión
  snapshotColocador?: string; // Nombre del colocador
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  deletedAt: string | null; // ISO 8601 date string o null
}

/**
 * DTO para crear una nueva gestión
 */
export interface CreateGestionDto {
  cuil: string; // Obligatorio, 11 dígitos
  nroCredito: string; // Obligatorio
  estado: EstadoGestion; // Obligatorio
  notas?: string; // Opcional, máx 1000 chars
  monto?: number; // Opcional
  colocador?: string; // Opcional, máx 100 chars
}

/**
 * DTO para actualizar una gestión existente
 * Todos los campos son opcionales
 */
export interface UpdateGestionDto {
  estado?: EstadoGestion;
  notas?: string;
}

/**
 * Request para consultar estados en batch
 */
export interface BatchStatusRequest {
  nrosCredito: string[]; // Min: 1, Max: 10,000
}

/**
 * Estado individual de un crédito en la respuesta batch
 */
export interface EstadoCredito {
  estado: EstadoGestion;
  timestamp: string; // ISO 8601
  notas?: string;
}

/**
 * Response del endpoint batch-status
 */
export interface BatchStatusResponse {
  estados: Record<string, EstadoCredito | null>; // null si no tiene gestiones
}
