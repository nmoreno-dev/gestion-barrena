import { Acreedor } from './acreedor';

export interface Deudor {
  cuil: string;
  nombre: string;
  email: string;
  telefono: string;
  acreedor: Acreedor;
  numeroCredito: string;
  deudaActual: number;
  deudaCancelatoria: number;
}
