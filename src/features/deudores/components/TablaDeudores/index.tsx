import { memo, useMemo, useCallback, useRef, useState } from 'react';
import { Deudor } from '../../interfaces/deudor';
import {
  Table,
  createBasicColumn,
  createActionColumn,
  type ColumnDef,
} from '@/common/components/Table/exports';
import { toast } from '@/utils/toast';
import { copyToClipboard } from '@/utils/clipboard';
import { sendEmail, processPlantillaForDeudor, type PlantillaData } from '../../utils';
import formatCuil from '@/utils/cuilFormater';
import GestionModal, { type GestionModalRef } from '../GestionModal';
import type { EstadoGestion } from '../../interfaces/gestion';
import { useCreateGestion, useUpdateDeudorInCollection } from '../../queries';
import type { BatchStatusResponse } from '../../interfaces/gestion';
import { batchStatus } from '../../api/gestionesApi';
import { batchUpdateDeudoresInCollection } from '../../api/deudoresCollectionsApi';

const copyMessageToClipboard = async (htmlString: string) => {
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      // Copia el HTML con formato (Gmail lo renderiza correctamente)
      const blobInput = new Blob([htmlString], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobInput,
        'text/plain': new Blob([htmlString.replace(/<[^>]+>/g, '')], {
          type: 'text/plain',
        }),
      });
      await navigator.clipboard.write([clipboardItem]);
    } else {
      // Fallback: copia texto plano si ClipboardItem no está soportado
      await navigator.clipboard.writeText(htmlString);
    }

    toast.success('Mensaje copiado al portapapeles correctamente', {
      duration: 3000,
    });
  } catch (error) {
    console.error('Error copying message to clipboard:', error);
    toast.error('Error al copiar el mensaje al portapapeles', {
      duration: 4000,
    });
  }
};

const copyCellValueToClipboard = async (value: string, label: string) => {
  try {
    await copyToClipboard(value);
    toast.success(`${label} copiado al portapapeles: ${value}`, {
      duration: 2000,
    });
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    toast.error(`Error al copiar ${label}`, {
      duration: 3000,
    });
  }
};

const TablaDeudores = memo(
  ({
    deudores,
    plantillas = [],
    selectedPlantillaId,
    onPlantillaChange,
    isLoadingPlantillas = false,
    onGestionChange,
    collectionId,
  }: {
    deudores: Deudor[];
    plantillas?: PlantillaData[];
    selectedPlantillaId?: string | null;
    onPlantillaChange?: (id: string | null) => void;
    isLoadingPlantillas?: boolean;
    onGestionChange?: (deudor: Deudor, estado: EstadoGestion, notas?: string) => void;
    collectionId?: string;
  }) => {
    const gestionModalRef = useRef<GestionModalRef>(null);
    const createGestionMutation = useCreateGestion();
    const updateDeudorMutation = useUpdateDeudorInCollection();
    const [selectedDeudor, setSelectedDeudor] = useState<Deudor | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    // Obtener números de crédito únicos
    const nrosCredito = useMemo(
      () => Array.from(new Set(deudores.map(d => d.numeroCredito))),
      [deudores],
    );

    // Encontrar la plantilla seleccionada
    const selectedPlantilla = useMemo(
      () => (selectedPlantillaId ? plantillas.find(p => p.id === selectedPlantillaId) : null),
      [selectedPlantillaId, plantillas],
    );

    // Memoizar handlers para evitar recrearlos en cada render
    const handleCopyCuil = useCallback((value: string) => {
      copyCellValueToClipboard(value, 'CUIL');
    }, []);

    const handleCopyNumeroCredito = useCallback((value: string) => {
      copyCellValueToClipboard(value, 'N° Crédito');
    }, []);

    // Handler para abrir modal de gestión
    const handleOpenGestionModal = useCallback((deudor: Deudor) => {
      setSelectedDeudor(deudor);
      gestionModalRef.current?.open();
    }, []);

    // Handler para sincronización manual con chunking
    const handleSyncManual = useCallback(async () => {
      if (nrosCredito.length === 0) {
        toast.warning('No hay créditos para sincronizar', { duration: 2000 });
        return;
      }

      if (!collectionId) {
        toast.error('No se puede sincronizar sin ID de colección', { duration: 3000 });
        return;
      }

      setIsSyncing(true);
      const CHUNK_SIZE = 10000;
      const chunks: string[][] = [];

      // Dividir en chunks de 10k
      for (let i = 0; i < nrosCredito.length; i += CHUNK_SIZE) {
        chunks.push(nrosCredito.slice(i, i + CHUNK_SIZE));
      }

      try {
        toast.info(
          `Sincronizando ${nrosCredito.length} créditos en ${chunks.length} lote${chunks.length > 1 ? 's' : ''}...`,
          { duration: 3000 },
        );

        let totalSynced = 0;
        const allResults: Record<string, BatchStatusResponse['estados'][string]> = {};

        // Procesar cada chunk secuencialmente
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const response = await batchStatus(chunk);

          if (response?.estados) {
            Object.assign(allResults, response.estados);
            totalSynced += Object.keys(response.estados).length;

            if (chunks.length > 1) {
              toast.info(`Procesado lote ${i + 1}/${chunks.length} (${totalSynced} créditos)`, {
                duration: 2000,
              });
            }
          }
        }

        // Actualizar IndexedDB con los resultados en batch
        const batchUpdates = Object.entries(allResults)
          .filter(([, estadoCredito]) => estadoCredito !== null)
          .map(([nroCredito, estadoCredito]) => ({
            numeroCredito: nroCredito,
            updates: {
              estadoGestion: estadoCredito!.estado,
              timestampGestion: estadoCredito!.timestamp,
              notasGestion: estadoCredito!.notas,
            },
          }));

        if (batchUpdates.length > 0) {
          const result = await batchUpdateDeudoresInCollection(collectionId, batchUpdates);

          toast.success(
            `Sincronización completa: ${result.updated} créditos actualizados de ${nrosCredito.length}`,
            { duration: 4000 },
          );

          if (result.notFound.length > 0) {
            console.warn(
              `${result.notFound.length} créditos no encontrados en IndexedDB:`,
              result.notFound.slice(0, 5),
            );
          }
        } else {
          toast.info('No se encontraron actualizaciones', { duration: 2000 });
        }
      } catch (error) {
        console.error('Error en sincronización manual:', error);
        toast.error('Error al sincronizar con la base de datos', { duration: 4000 });
      } finally {
        setIsSyncing(false);
      }
    }, [nrosCredito, collectionId]);

    // Handler para confirmar gestión
    const handleConfirmGestion = useCallback(
      (estado: EstadoGestion, notas?: string) => {
        if (!selectedDeudor) return;

        const timestamp = new Date().toISOString();

        // Crear gestión en la API
        createGestionMutation.mutate(
          {
            cuil: selectedDeudor.cuil,
            nroCredito: selectedDeudor.numeroCredito,
            estado,
            notas,
            monto: selectedDeudor.deudaActual,
            colocador: selectedDeudor.acreedor.nombre,
          },
          {
            onSuccess: () => {
              toast.success('Gestión registrada correctamente', { duration: 3000 });

              // Actualizar en IndexedDB si tenemos el collectionId
              if (collectionId) {
                updateDeudorMutation.mutate({
                  collectionId,
                  numeroCredito: selectedDeudor.numeroCredito,
                  updates: {
                    estadoGestion: estado,
                    timestampGestion: timestamp,
                    notasGestion: notas,
                  },
                });
              }

              // Notificar al componente padre si existe el callback
              onGestionChange?.(selectedDeudor, estado, notas);
            },
            onError: error => {
              console.error('Error al crear gestión:', error);
              toast.error('Error al registrar la gestión', { duration: 4000 });
            },
          },
        );
      },
      [selectedDeudor, createGestionMutation, updateDeudorMutation, collectionId, onGestionChange],
    );

    // Crear columnas dinámicamente basadas en si hay plantilla seleccionada
    const columns: ColumnDef<Deudor>[] = useMemo(
      () => [
        createBasicColumn({
          key: 'cuil',
          title: 'CUIL',
          render: value => {
            const formattedCuil = formatCuil(value as string);
            return (
              <span
                className="underline cursor-pointer hover:text-success"
                title="Click para copiar CUIL"
                onClick={() => handleCopyCuil(value as string)}
              >
                {formattedCuil}
              </span>
            );
          },
        }),
        createBasicColumn({
          key: 'nombre',
          title: 'Nombre',
          width: 200,
        }),
        {
          accessorKey: 'acreedor.nombre',
          header: 'Acreedor',
          size: 150,
        },
        createBasicColumn({
          key: 'numeroCredito',
          title: 'N° Crédito',
          width: 120,
          align: 'center',
          render: value => (
            <span
              className="underline cursor-pointer hover:text-success"
              title="Click para copiar N° Crédito"
              onClick={() => handleCopyNumeroCredito(value?.toString() || '')}
            >
              {value?.toString() || ''}
            </span>
          ),
        }),
        createBasicColumn({
          key: 'deudaActual',
          title: 'Deuda Actual',
          width: 130,
          align: 'right',
          render: value => (
            <span className="font-mono text-success">
              ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          ),
        }),
        createBasicColumn({
          key: 'deudaCancelatoria',
          title: 'Deuda Cancelatoria',
          width: 150,
          align: 'right',
          render: value => (
            <span className="font-mono text-warning">
              ${Number(value).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
            </span>
          ),
        }),
        createBasicColumn({
          key: 'estadoGestion',
          title: 'Estado',
          width: 120,
          align: 'center',
          render: (value, deudor) => {
            const badgeClass =
              value === 'contactado'
                ? 'badge-success'
                : value === 'gestionado'
                  ? 'badge-info'
                  : 'badge-warning';
            return (
              <span className={`badge ${badgeClass} badge-sm`} title={deudor.notasGestion || ''}>
                {value === 'contactado'
                  ? 'Contactado'
                  : value === 'gestionado'
                    ? 'Gestionado'
                    : 'Pendiente'}
              </span>
            );
          },
        }),
        createActionColumn({
          title: 'Acciones',
          width: 150,
          render: deudor => {
            const handleSendEmail = () => {
              // Usar plantilla seleccionada o la primera disponible
              const plantillaToUse =
                selectedPlantilla || (plantillas.length > 0 ? plantillas[0] : null);

              if (!plantillaToUse) {
                toast.error('Debes configurar al menos una plantilla para enviar emails', {
                  duration: 4000,
                });
                return;
              }

              const processed = processPlantillaForDeudor(plantillaToUse, deudor);

              sendEmail({
                to: [deudor.email],
                bcc: processed.bcc,
                subject: processed.subject,
              });
            };

            const handleCopyMessage = () => {
              // Usar plantilla seleccionada o la primera disponible
              const plantillaToUse =
                selectedPlantilla || (plantillas.length > 0 ? plantillas[0] : null);

              if (!plantillaToUse) {
                toast.error('Debes configurar al menos una plantilla para copiar mensajes', {
                  duration: 4000,
                });
                return;
              }

              const processed = processPlantillaForDeudor(plantillaToUse, deudor);
              copyMessageToClipboard(processed.body);
            };

            return (
              <div className="flex gap-1">
                <button
                  className="btn btn-ghost btn-xs text-xl"
                  title="Gestionar"
                  onClick={() => handleOpenGestionModal(deudor)}
                >
                  ✅
                </button>
                <button
                  className="btn btn-ghost btn-xs text-xl"
                  title="Enviar Mail"
                  onClick={handleSendEmail}
                >
                  📨
                </button>
                <button
                  className="btn btn-ghost btn-xs text-xl"
                  title="Copiar Mensaje"
                  onClick={handleCopyMessage}
                >
                  📄
                </button>
              </div>
            );
          },
        }),
      ],
      [
        selectedPlantilla,
        plantillas,
        handleCopyCuil,
        handleCopyNumeroCredito,
        handleOpenGestionModal,
      ],
    );

    return (
      <>
        <div className="flex justify-between items-center mb-4 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-semibold">
              Lista de Deudores ({deudores.length} registros)
            </h3>

            {/* Botón de sync manual */}
            <button
              className="btn btn-sm btn-outline btn-info gap-2"
              onClick={handleSyncManual}
              disabled={isSyncing || !collectionId}
              title={
                !collectionId
                  ? 'No disponible sin ID de colección'
                  : 'Sincronizar estados con la base de datos'
              }
            >
              {isSyncing ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Sincronizando...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Dropdown de selección de plantilla */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm font-medium whitespace-nowrap">Plantilla:</label>
            {isLoadingPlantillas ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : plantillas.length === 0 ? (
              <div className="text-sm text-base-content/60 italic">
                No hay plantillas configuradas
              </div>
            ) : (
              <select
                className="select select-bordered select-sm w-full md:w-64"
                value={selectedPlantillaId || plantillas[0]?.id || ''}
                onChange={e => onPlantillaChange?.(e.target.value)}
              >
                {plantillas.map(plantilla => (
                  <option key={plantilla.id} value={plantilla.id}>
                    {plantilla.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Indicador de plantilla seleccionada */}
        {selectedPlantilla && (
          <div className="alert alert-info mb-4">
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
            <div>
              <div className="font-semibold">Usando plantilla: {selectedPlantilla.name}</div>
              <div className="text-sm">Asunto: {selectedPlantilla.subject}</div>
            </div>
          </div>
        )}

        <Table enableFiltering enablePagination enableSorting columns={columns} data={deudores} />

        {/* Modal de gestión */}
        <GestionModal
          ref={gestionModalRef}
          onConfirm={handleConfirmGestion}
          currentEstado={selectedDeudor?.estadoGestion}
          currentNotas={selectedDeudor?.notasGestion}
          deudorNombre={selectedDeudor?.nombre}
        />
      </>
    );
  },
);

TablaDeudores.displayName = 'TablaDeudores';

export default TablaDeudores;
