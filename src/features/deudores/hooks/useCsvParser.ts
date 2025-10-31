import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { ACREEDORES } from '../interfaces/acreedor';
import type { Deudor } from '../interfaces/deudor';

export interface CsvRowError {
  row: number;
  field: string;
  value: unknown;
  message: string;
}

export interface CsvParseStats {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  errors: CsvRowError[];
  isComplete: boolean;
  progress: number;
  syncMessage?: string; // Mensaje opcional para mostrar durante la sincronización
}

export interface CsvParseResult {
  data: Deudor[];
  stats: CsvParseStats;
}

interface CsvParserState {
  isLoading: boolean;
  error: string | null;
  stats: CsvParseStats;
  validData: Deudor[];
}

const REQUIRED_FIELDS = [
  'CUIL',
  'TITULAR',
  'MAIL',
  'TELEFONO',
  'COLOCADOR',
  'DEUDA ACTUAL',
  'DEUDA CANCELATORIA',
  'N° DE CRÉDITO',
] as const;

export function useCsvParser() {
  const [state, setState] = useState<CsvParserState>({
    isLoading: false,
    error: null,
    stats: {
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [],
      isComplete: false,
      progress: 0,
    },
    validData: [],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  function parseMonto(valor: string): number {
    if (!valor) return 0;

    return (
      parseFloat(
        valor
          .replace(/[^\d,.-]/g, '') // elimina $, espacios y otros símbolos
          .replace(/,/g, ''), // quita separador de miles
      ) || 0
    );
  }

  const validateCuil = (cuil: string): boolean => {
    const cleanCuil = cuil.replace(/[^\d]/g, '');
    return cleanCuil.length === 11;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return cleanPhone.length >= 8;
  };

  const findAcreedor = (colocadorId: string) => {
    const normalizedName = colocadorId.toUpperCase().trim();

    // // Mapeo específico para los nombres comunes en los datos
    // if (normalizedName.includes('SANJORGE') || normalizedName === 'SANJORGE') {
    //   return ACREEDORES.find(a => a.nombre === 'ADELANTOS PAY SA.') || ACREEDORES[1]; // SAN_JORGE
    // }

    // if (normalizedName.includes('CEFERINO') || normalizedName === 'CEFERINO') {
    //   return ACREEDORES.find(a => a.nombre === 'CREDIPLAT S.A.') || ACREEDORES[0]; // CEFERINO
    // }

    // Búsqueda general por nombre
    const foundAcreedor = ACREEDORES.find(
      acreedor =>
        acreedor.id.toUpperCase().includes(normalizedName) ||
        normalizedName.includes(acreedor.id.toUpperCase()),
    );

    return foundAcreedor || ACREEDORES[0]; // Default al primero si no encuentra
  };

  const validateAndParseRow = (
    rawRow: Record<string, string>,
    rowIndex: number,
  ): {
    data: Deudor | null;
    errors: CsvRowError[];
  } => {
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
        numeroCredito, // Mantener como number simple
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
  };

  const parseFile = useCallback(
    async (
      file: File,
      onProgress?: (stats: CsvParseStats) => void,
      onRowParsed?: (deudor: Deudor, rowIndex: number) => void,
      enrichWithGestiones?: boolean,
    ): Promise<CsvParseResult> => {
      return new Promise((resolve, reject) => {
        // Cancelar parsing anterior si existe
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setState(prev => ({
          ...prev,
          isLoading: true,
          error: null,
          stats: {
            totalRows: 0,
            validRows: 0,
            invalidRows: 0,
            errors: [],
            isComplete: false,
            progress: 0,
          },
          validData: [],
        }));

        const validData: Deudor[] = [];
        const allErrors: CsvRowError[] = [];
        let totalRows = 0;
        let validRows = 0;
        let invalidRows = 0;

        Papa.parse(file, {
          header: false,
          skipEmptyLines: 'greedy',
          delimiter: '', // autodetecta (, ; \t)
          dynamicTyping: false,
          worker: true, // Usar Web Worker para no bloquear la UI
          chunkSize: 1024 * 10, // 1KB chunks para mejor control de progreso
          chunk: (results: Papa.ParseResult<string[]>) => {
            if (abortControllerRef.current?.signal.aborted) return;

            // results.data es string[][]
            const rows = results.data as string[][];

            rows.forEach((row, i) => {
              // validá cantidad de columnas
              if (!row || row.length < 8) {
                invalidRows++;
                allErrors.push({
                  row: totalRows + i + 1,
                  field: 'GENERAL',
                  value: row,
                  message: 'Fila incompleta',
                });
                return;
              }

              // mapeo manual por índice (orden según tu CSV)
              const rawRow = {
                CUIL: row[0],
                TITULAR: row[1],
                MAIL: row[2],
                TELEFONO: row[3],
                COLOCADOR: row[4],
                'DEUDA ACTUAL': row[5],
                'DEUDA CANCELATORIA': row[6],
                'N° DE CRÉDITO': row[7],
              } as Record<string, string>;

              const rowIndex = totalRows + i + 1; // 1-based para UI
              const { data, errors } = validateAndParseRow(rawRow, rowIndex);

              if (data) {
                validData.push(data);
                validRows++;
                onRowParsed?.(data, rowIndex);
              } else {
                invalidRows++;
                allErrors.push(...errors);
              }
            });

            totalRows += rows.length;

            // En chunk no hay % total confiable; podés estimar con meta.cursor si querés:
            const progress =
              results.meta?.cursor && file.size
                ? Math.max(0, Math.min(100, Math.round((results.meta.cursor / file.size) * 100)))
                : 0;

            const currentStats: CsvParseStats = {
              totalRows,
              validRows,
              invalidRows,
              errors: allErrors,
              isComplete: false,
              progress,
            };

            setState(prev => ({
              ...prev,
              stats: currentStats,
              validData: [...validData],
            }));

            onProgress?.(currentStats);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          complete: async _ => {
            if (abortControllerRef.current?.signal.aborted) {
              reject(new Error('Parsing was cancelled'));
              return;
            }

            const finalStats: CsvParseStats = {
              totalRows,
              validRows,
              invalidRows,
              errors: allErrors,
              isComplete: true,
              progress: 100,
            };

            // Enriquecer con gestiones si se solicitó
            let enrichedData = validData;
            if (enrichWithGestiones && validData.length > 0) {
              try {
                const { enrichDeudoresWithGestiones } = await import('../utils/gestionesSync');
                enrichedData = await enrichDeudoresWithGestiones(validData, enrichProgress => {
                  // Actualizar el progreso para mostrar la sincronización
                  const syncMessage =
                    enrichProgress.totalBatches > 1
                      ? `Sincronizando batch ${enrichProgress.currentBatch} de ${enrichProgress.totalBatches}`
                      : 'Sincronizando estados con el servidor';

                  const syncStats: CsvParseStats = {
                    ...finalStats,
                    isComplete: false,
                    progress: Math.round(enrichProgress.percentage),
                    syncMessage,
                  };

                  setState(prev => ({
                    ...prev,
                    stats: syncStats,
                  }));

                  onProgress?.(syncStats);
                });
              } catch (error) {
                console.error('Error al enriquecer con gestiones:', error);
                // Continuar con los datos sin enriquecer
              }
            }

            setState(prev => ({
              ...prev,
              isLoading: false,
              stats: finalStats,
              validData: enrichedData,
            }));

            onProgress?.(finalStats);

            resolve({
              data: enrichedData,
              stats: finalStats,
            });
          },
          error: (error: Error) => {
            if (abortControllerRef.current?.signal.aborted) {
              reject(new Error('Parsing was cancelled'));
              return;
            }

            const errorMessage = `Error parsing CSV: ${error.message}`;
            setState(prev => ({
              ...prev,
              isLoading: false,
              error: errorMessage,
            }));
            reject(new Error(errorMessage));
          },
        });
      });
    },
    [],
  );

  const cancelParsing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const resetState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      stats: {
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        errors: [],
        isComplete: false,
        progress: 0,
      },
      validData: [],
    });
  }, []);

  return {
    ...state,
    parseFile,
    cancelParsing,
    resetState,
  };
}
