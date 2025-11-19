import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Modal, type ModalRef } from '@/common/components';
import type { EstadoGestion } from '../../interfaces/gestion';

interface GestionModalProps {
  onConfirm: (estado: EstadoGestion, notas?: string) => void;
  currentEstado?: EstadoGestion;
  currentNotas?: string;
  deudorNombre?: string;
}

export interface GestionModalRef {
  open: () => void;
  close: () => void;
}

const ESTADOS: { value: EstadoGestion; label: string; color: string }[] = [
  { value: 'pendiente', label: 'Pendiente', color: 'badge-warning' },
  { value: 'gestionado', label: 'Gestionado', color: 'badge-info' },
  { value: 'contactado', label: 'Contactado', color: 'badge-success' },
];

const GestionModal = forwardRef<GestionModalRef, GestionModalProps>(
  ({ onConfirm, currentEstado, currentNotas, deudorNombre }, ref) => {
    const modalRef = useRef<ModalRef>(null);
    const [estado, setEstado] = useState<EstadoGestion>(currentEstado || 'pendiente');
    const [notas, setNotas] = useState(currentNotas || '');
    const [isOpen, setIsOpen] = useState(false);

    // Generar ID único para esta instancia de modal
    const uniqueId = useMemo(
      () => `gestion-modal-${Math.random().toString(36).substring(2, 9)}`,
      [],
    );
    const uniqueRadioName = useMemo(() => `estado-${uniqueId}`, [uniqueId]);

    // Solo actualizar el estado cuando la modal se abre (no en cada prop change)
    useEffect(() => {
      if (isOpen) {
        setEstado(currentEstado || 'pendiente');
        setNotas(currentNotas || '');
      }
    }, [isOpen, currentEstado, currentNotas]);

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        modalRef.current?.showModal();
      },
      close: () => {
        setIsOpen(false);
        modalRef.current?.close();
      },
    }));

    const handleConfirm = () => {
      onConfirm(estado, notas.trim() || undefined);
      setIsOpen(false);
      modalRef.current?.close();
    };

    const handleClose = () => {
      setIsOpen(false);
      modalRef.current?.close();
    };

    return (
      <Modal id={uniqueId} ref={modalRef} title="Gestionar Crédito">
        <div className="space-y-4">
          {/* Información del deudor */}
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Gestionando crédito de: {deudorNombre}</span>
          </div>

          {/* Selector de estado */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Estado de gestión</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {ESTADOS.map(e => (
                <label key={e.value} className="label cursor-pointer gap-2 flex-1 min-w-[120px]">
                  <input
                    type="radio"
                    name={uniqueRadioName}
                    className="radio radio-primary"
                    checked={estado === e.value}
                    onChange={() => setEstado(e.value)}
                  />
                  <span className={`badge ${e.color} badge-lg flex-1`}>{e.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Campo de notas */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Notas (opcional)</span>
              <span className="label-text-alt text-base-content/60">
                {notas.length}/1000 caracteres
              </span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 resize-none"
              placeholder="Agregar detalles sobre la gestión..."
              value={notas}
              onChange={e => setNotas(e.target.value.slice(0, 1000))}
              maxLength={1000}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 justify-end pt-4">
            <button className="btn btn-ghost" onClick={handleClose} type="button">
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleConfirm} type="button">
              Guardar Gestión
            </button>
          </div>
        </div>
      </Modal>
    );
  },
);

GestionModal.displayName = 'GestionModal';

export default GestionModal;
