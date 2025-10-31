import { Acreedor } from './acreedor';
import { EstadoGestion } from './gestion';

export interface Deudor {
  cuil: string;
  nombre: string;
  email: string;
  telefono: string;
  acreedor: Acreedor;
  numeroCredito: string;
  deudaActual: number;
  deudaCancelatoria: number;
  // Campos para almacenar el estado de gestión más reciente
  estadoGestion?: EstadoGestion;
  timestampGestion?: string; // ISO 8601 date string
  notasGestion?: string;
}
