import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import type { Deudor } from '../interfaces/deudor';
import { validateAndParseRow } from '../utils/csvValidators';
import { mapRowToRecord } from '../utils/csvTransformers';
import { PAPA_PARSE_CONFIG, MIN_COLUMNS } from '../utils/csvConstants';

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
          ...PAPA_PARSE_CONFIG,
          chunk: (results: Papa.ParseResult<string[]>) => {
            if (abortControllerRef.current?.signal.aborted) return;

            // results.data es string[][]
            const rows = results.data as string[][];

            rows.forEach((row, i) => {
              // validá cantidad de columnas
              if (!row || row.length < MIN_COLUMNS) {
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
              const rawRow = mapRowToRecord(row);

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
