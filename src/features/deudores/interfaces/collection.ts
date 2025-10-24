import type { Deudor } from './deudor';

/**
 * Colección de deudores (metadata de una tabla)
 * Optimizado: timestamps en lugar de ISO strings
 */
export interface DeudorCollection {
  id: string;
  name: string;
  color?: string; // Color de la colección (clase de Tailwind)
  fileName?: string;
  loadDate?: number; // timestamp
  totalRecords: number;
  createdAt: number; // timestamp
  order: number;
}

/**
 * Deudor individual con referencia a su colección (optimizado para almacenamiento)
 * Campos comprimidos: cid = collectionId
 */
export interface DeudorData extends Deudor {
  id?: number; // Auto-increment (optional para add)
  cid: string; // collectionId comprimido
}
