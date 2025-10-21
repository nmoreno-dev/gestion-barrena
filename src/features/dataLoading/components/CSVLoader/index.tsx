import React, { useState, useEffect } from 'react';
import { FileLoader } from '@/common/components';
import { useCsvParser, type CsvParseStats } from '../../hooks/useCsvParser';
import type { Deudor } from '../../interfaces/deudor';
import CsvLoadingModal, { useCsvLoadingModal } from '../CsvLoadingModal';

interface CsvLoaderProps {
  onDataLoaded: (data: Deudor[], fileName: string) => void; // callback para devolver los datos parseados
  onStatsUpdate?: (stats: CsvParseStats) => void; // callback opcional para estadísticas de progreso
  onError?: (error: string) => void; // callback opcional para manejo de errores
}

const CsvLoader: React.FC<CsvLoaderProps> = ({ onDataLoaded, onStatsUpdate, onError }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const { error, stats, isLoading, parseFile, resetState, cancelParsing } = useCsvParser();
  const { modalRef, showModal, closeModal } = useCsvLoadingModal();

  // Mostrar modal cuando inicia el parsing
  useEffect(() => {
    if (isLoading && !stats.isComplete) {
      showModal();
    }
  }, [isLoading, stats, showModal]);

  //   // Cerrar modal cuando se completa
  //   useEffect(() => {
  //     if (stats?.isComplete) {
  //       const timer = setTimeout(() => {
  //         closeModal();
  //       }, 5000);
  //       return () => clearTimeout(timer);
  //     }
  //   }, [stats?.isComplete, closeModal]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    resetState();

    try {
      const result = await parseFile(file, progressStats => {
        onStatsUpdate?.(progressStats);
      });

      onDataLoaded(result.data, file.name);
      onStatsUpdate?.(result.stats);

      if (result.stats.errors.length > 0) {
        console.warn('Errores encontrados durante el parsing:', result.stats.errors);
      }
    } catch (err) {
      closeModal();
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido al procesar el archivo';
      onError?.(errorMessage);
      console.error('Error al procesar CSV:', err);
    }
  };

  const handleCancelLoading = () => {
    cancelParsing();
    closeModal();
  };
  return (
    <div className="flex flex-col gap-2 p-4 border rounded-lg bg-base-200">
      <FileLoader
        color="primary"
        size="md"
        accept=".csv"
        withFieldset
        fieldsetLegend="Cargar CSV"
        fieldsetLabel="Seleccioná un archivo .csv"
        onChange={handleFileChange}
      />

      {fileName && (
        <div className="text-sm text-gray-500 mt-1">
          Archivo seleccionado: <strong>{fileName}</strong>
        </div>
      )}

      {error && <div className="mt-2 text-error font-medium">{error}</div>}

      {/* Modal de carga CSV */}
      <CsvLoadingModal
        ref={modalRef}
        id="csv-loading-modal"
        stats={stats}
        onCancel={handleCancelLoading}
        showCancelButton={true}
      />
    </div>
  );
};

export default CsvLoader;
