import { ACREEDORES } from '../interfaces/acreedor';
import type { Acreedor } from '../interfaces/acreedor';

/**
 * Parsea un monto en formato string a number
 * Elimina símbolos como $, espacios y separadores de miles
 *
 * @example
 * parseMonto("$ 1.234,56") // 1234.56
 * parseMonto("1234.56") // 1234.56
 */
export function parseMonto(valor: string): number {
  if (!valor) return 0;

  return (
    parseFloat(
      valor
        .replace(/[^\d,.-]/g, '') // elimina $, espacios y otros símbolos
        .replace(/,/g, ''), // quita separador de miles
    ) || 0
  );
}

/**
 * Busca un acreedor por su identificador/nombre
 * Retorna el acreedor encontrado o el primero por defecto
 *
 * @example
 * findAcreedor("SANJORGE") // Retorna acreedor correspondiente
 * findAcreedor("DESCONOCIDO") // Retorna ACREEDORES[0]
 */
export function findAcreedor(colocadorId: string): Acreedor {
  const normalizedName = colocadorId.toUpperCase().trim();

  // Búsqueda general por nombre o ID
  const foundAcreedor = ACREEDORES.find(
    acreedor =>
      acreedor.id.toUpperCase().includes(normalizedName) ||
      normalizedName.includes(acreedor.id.toUpperCase()),
  );

  return foundAcreedor || ACREEDORES[0]; // Default al primero si no encuentra
}

/**
 * Mapea una fila del CSV (array de strings) a un objeto Record con nombres de campos
 *
 * @param row - Array de strings con los valores de la fila
 * @returns Objeto con los campos mapeados a sus nombres correspondientes
 */
export function mapRowToRecord(row: string[]): Record<string, string> {
  return {
    CUIL: row[0],
    TITULAR: row[1],
    MAIL: row[2],
    TELEFONO: row[3],
    COLOCADOR: row[4],
    'DEUDA ACTUAL': row[5],
    'DEUDA CANCELATORIA': row[6],
    'N° DE CRÉDITO': row[7],
  };
}
