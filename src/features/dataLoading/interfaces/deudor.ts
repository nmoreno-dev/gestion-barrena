import { Acreedor } from './acreedor';

export interface Deudor {
  cuil: number;
  nombre: string;
  email: string;
  telefono: string;
  acreedor: Acreedor;
  numeroCredito: number | number[];
  deudaActual: number;
  deudaCancelatoria: number;
}
