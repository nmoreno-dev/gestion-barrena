import type { CsvRowError } from '../hooks/useCsvParser';
import type { Deudor } from '../interfaces/deudor';
import { REQUIRED_FIELDS } from './csvConstants';
import { parseMonto, findAcreedor } from './csvTransformers';

/**
 * Valida que un CUIL tenga el formato correcto (11 dígitos)
 */
export function validateCuil(cuil: string): boolean {
  const cleanCuil = cuil.replace(/[^\d]/g, '');
  return cleanCuil.length === 11;
}

/**
 * Valida que un email tenga formato válido
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida que un teléfono tenga al menos 8 dígitos
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return cleanPhone.length >= 8;
}

/**
 * Valida y parsea una fila del CSV, retornando el objeto Deudor o errores
 */
export function validateAndParseRow(
  rawRow: Record<string, string>,
  rowIndex: number,
): {
  data: Deudor | null;
  errors: CsvRowError[];
} {
  const errors: CsvRowError[] = [];

  // Verificar campos requeridos
  for (const field of REQUIRED_FIELDS) {
    if (!rawRow[field] || String(rawRow[field]).trim() === '') {
      errors.push({
        row: rowIndex,
        field,
        value: rawRow[field],
        message: `Campo requerido '${field}' está vacío o faltante`,
      });
    }
  }

  if (errors.length > 0) {
    return { data: null, errors };
  }

  try {
    const cuil = String(rawRow['CUIL']).trim();
    const email = String(rawRow['MAIL']).trim();
    const telefono = String(rawRow['TELEFONO']).trim();
    const colocador = String(rawRow['COLOCADOR']).trim();

    // Validaciones específicas
    if (!validateCuil(cuil)) {
      errors.push({
        row: rowIndex,
        field: 'CUIL',
        value: cuil,
        message: 'CUIL debe tener 11 dígitos',
      });
    }

    if (!validateEmail(email)) {
      errors.push({
        row: rowIndex,
        field: 'MAIL',
        value: email,
        message: 'Email no tiene formato válido',
      });
    }

    if (!validatePhone(telefono)) {
      errors.push({
        row: rowIndex,
        field: 'TELEFONO',
        value: telefono,
        message: 'Teléfono debe tener al menos 8 dígitos',
      });
    }

    const deudaActual = parseMonto(rawRow['DEUDA ACTUAL']);
    const deudaCancelatoria = parseMonto(rawRow['DEUDA CANCELATORIA']);
    const numeroCredito = String(rawRow['N° DE CRÉDITO']).replace(/\D/g, '');

    if (isNaN(deudaActual) || deudaActual <= 0) {
      errors.push({
        row: rowIndex,
        field: 'DEUDA ACTUAL',
        value: rawRow['DEUDA ACTUAL'],
        message: 'Deuda actual debe ser un número positivo',
      });
    }

    if (isNaN(deudaCancelatoria) || deudaCancelatoria <= 0) {
      errors.push({
        row: rowIndex,
        field: 'DEUDA CANCELATORIA',
        value: rawRow['DEUDA CANCELATORIA'],
        message: 'Deuda cancelatoria debe ser un número positivo',
      });
    }

    if (errors.length > 0) {
      return { data: null, errors };
    }

    // Crear objeto Deudor
    const deudor: Deudor = {
      cuil: cuil.replace(/[^\d]/g, ''),
      nombre: String(rawRow['TITULAR']).trim(),
      email,
      telefono,
      acreedor: findAcreedor(colocador),
      numeroCredito,
      deudaActual,
      deudaCancelatoria,
    };

    return { data: deudor, errors: [] };
  } catch (error) {
    errors.push({
      row: rowIndex,
      field: 'GENERAL',
      value: rawRow,
      message: `Error inesperado al procesar fila: ${error instanceof Error ? error.message : 'Error desconocido'}`,
    });
    return { data: null, errors };
  }
}
