import type { Deudor } from './deudor';

/**
 * Colección de deudores (metadata de una tabla)
 */
export interface DeudorCollection {
  id: string;
  name: string;
  fileName?: string;
  loadDate?: string;
  totalRecords: number;
  createdAt: string;
  order: number;
}

/**
 * Deudor individual con referencia a su colección
 */
export interface DeudorData extends Deudor {
  id: string;
  collectionId: string;
}
