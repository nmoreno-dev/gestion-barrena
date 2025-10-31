import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import type { CsvParseStats } from '@/features/deudores/hooks/useCsvParser';
import Modal, { ModalRef } from '@/common/components/Modal';
import { Progress } from '@/common/components';

export interface CsvLoadingModalProps {
  /** Unique identifier for the modal */
  id: string;
  /** Statistics from the CSV parsing process */
  stats?: CsvParseStats;
  /** Custom message to display */
  message?: string;
  /** Callback when user tries to cancel */
  onCancel?: () => void;
  /** Whether to show cancel button */
  showCancelButton?: boolean;
}

export interface CsvLoadingModalRef {
  showModal: () => void;
  close: () => void;
}

const CsvLoadingModal = forwardRef<CsvLoadingModalRef, CsvLoadingModalProps>(
  (
    {
      id,
      stats,
      message = 'Cargando datos, esto puede tomar un momento...',
      onCancel,
      showCancelButton = true,
    },
    ref,
  ) => {
    const modalRef = useRef<ModalRef>(null);

    useImperativeHandle(ref, () => ({
      showModal: () => {
        modalRef.current?.showModal();
      },
      close: () => {
        modalRef.current?.close();
      },
    }));

    const getProgressValue = () => {
      if (!stats) return undefined;
      if (stats.totalRows === 0) return undefined;
      return stats.progress;
    };

    const getProgressMessage = () => {
      if (!stats) return message;

      if (stats.totalRows === 0) {
        return 'Iniciando carga...';
      }

      // Si hay un mensaje de sincronización, mostrarlo
      if (stats.syncMessage) {
        return `🔄 ${stats.syncMessage}\nEsto puede tomar unos momentos...`;
      }

      // Si el parsing está completo pero el progreso no es 100%, estamos sincronizando
      if (stats.validRows === stats.totalRows && stats.progress < 100 && !stats.isComplete) {
        return '🔄 Sincronizando estados con el servidor...\nEsto puede tomar unos momentos.';
      }

      if (stats.isComplete) {
        return `✅ Completado: ${stats.validRows} filas procesadas correctamente`;
      }

      return `${message}\n      (${stats.validRows}/${stats.totalRows} filas procesadas)`;
    };

    const getProgressColor = () => {
      if (!stats) return 'primary';
      if (stats.isComplete) return 'success';
      return 'primary';
    };

    return (
      <Modal
        ref={modalRef}
        id={id}
        title="Cargando archivo CSV"
        showCloseButton={true}
        closeOnBackdrop={true}
        modalBoxClassName="w-11/12 max-w-md"
      >
        <div className="py-4">
          {/* Loading message */}
          <div className="text-center mb-6">
            <p className="text-base-content">{getProgressMessage()}</p>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <Progress
              value={getProgressValue()}
              max={100}
              color={getProgressColor()}
              className="w-full h-3"
            />
            {stats && stats.totalRows > 0 && (
              <div className="flex justify-between text-xs text-base-content/70 mt-1">
                <span>0%</span>
                <span>{Math.round(stats.progress)}%</span>
                <span>100%</span>
              </div>
            )}
          </div>

          {/* Statistics details */}
          {stats && stats.totalRows > 0 && (
            <div className="bg-base-200 rounded-lg p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-base-content/70">Total:</span>
                  <span className="ml-1 font-medium">{stats.totalRows}</span>
                </div>
                <div>
                  <span className="text-base-content/70">Válidas:</span>
                  <span className="ml-1 font-medium text-success">{stats.validRows}</span>
                </div>
                <div>
                  <span className="text-base-content/70">Con errores:</span>
                  <span className="ml-1 font-medium text-error">{stats.invalidRows}</span>
                </div>
                <div>
                  <span className="text-base-content/70">Progreso:</span>
                  <span className="ml-1 font-medium">{Math.round(stats.progress)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Cancel button */}
          {showCancelButton && onCancel && (
            <div className="flex justify-center">
              <button
                className="btn btn-outline btn-sm"
                onClick={onCancel}
                disabled={stats?.isComplete}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </Modal>
    );
  },
);

CsvLoadingModal.displayName = 'CsvLoadingModal';

export default CsvLoadingModal;

// Hook para usar la modal de carga de CSV más fácilmente
export const useCsvLoadingModal = () => {
  const modalRef = useRef<CsvLoadingModalRef>(null);

  const showModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  return { modalRef, showModal, closeModal };
};
