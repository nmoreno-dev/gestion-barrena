import { createFileRoute } from '@tanstack/react-router';
import { DeudoresTabs, TablaDeudores } from '@/features/deudores/components';
import CsvLoader from '@/features/deudores/components/CSVLoader';
import { useState, useEffect, useRef } from 'react';
import {
  useDeudoresCollections,
  useCollectionInfo,
  useSaveDeudoresToCollection,
  useDeleteCollection,
  useCreateCollection,
  formatLoadDate,
  Deudor,
} from '@/features/deudores';
import { usePlantillasForDeudores } from '@/common/hooks';

export const Route = createFileRoute('/deudores/')({
  component: DeudoresPage,
});

const DEFAULT_COLLECTION_NAME = 'Principal';

function DeudoresPage() {
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedPlantillaId, setSelectedPlantillaId] = useState<string | null>(null);
  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(null);
  const hasInitialized = useRef(false);

  // Obtener todas las colecciones
  const { data: collections = [], isLoading: isLoadingCollections } = useDeudoresCollections();

  // Obtener datos de la colección actual
  const {
    collection,
    deudores,
    hasData,
    loadDate: lastLoadDate,
    fileName,
    isLoading: isLoadingDeudores,
  } = useCollectionInfo(currentCollectionId);

  const saveMutation = useSaveDeudoresToCollection();
  const clearMutation = useDeleteCollection();
  const createMutation = useCreateCollection();

  const { data: plantillas = [], isLoading: isLoadingPlantillas } = usePlantillasForDeudores();

  // Efecto para crear colección inicial o seleccionar la primera
  useEffect(() => {
    if (!isLoadingCollections && !currentCollectionId && !hasInitialized.current) {
      hasInitialized.current = true;

      if (collections.length === 0) {
        // Crear colección inicial
        createMutation.mutate(DEFAULT_COLLECTION_NAME, {
          onSuccess: collectionId => {
            setCurrentCollectionId(collectionId);
          },
        });
      } else {
        // Seleccionar la primera colección
        setCurrentCollectionId(collections[0].id);
      }
    }
  }, [collections, isLoadingCollections, currentCollectionId, createMutation]);

  useEffect(() => {
    if (plantillas.length > 0 && !selectedPlantillaId) {
      setSelectedPlantillaId(plantillas[0].id);
    }
  }, [plantillas, selectedPlantillaId]);

  const handleDataLoaded = async (data: Deudor[], uploadedFileName: string) => {
    if (!currentCollectionId) return;

    saveMutation.mutate({
      collectionId: currentCollectionId,
      deudores: data,
      fileName: uploadedFileName,
    });
  };

  const handleClearData = async () => {
    if (!currentCollectionId) return;

    clearMutation.mutate(currentCollectionId, {
      onSuccess: () => {
        setShowClearModal(false);
        // Si era la única colección, crear una nueva
        if (collections.length === 1) {
          createMutation.mutate(DEFAULT_COLLECTION_NAME, {
            onSuccess: collectionId => {
              setCurrentCollectionId(collectionId);
            },
          });
        } else {
          // Seleccionar otra colección
          const otherCollection = collections.find(c => c.id !== currentCollectionId);
          if (otherCollection) {
            setCurrentCollectionId(otherCollection.id);
          }
        }
      },
    });
  };

  if (isLoadingDeudores || isLoadingCollections) {
    return (
      <div className="container mx-auto p-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-center items-center py-8">
              <span className="loading loading-spinner loading-lg"></span>
              <span className="ml-2">Cargando datos...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="card w-full bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <h2 className="card-title mb-4 md:mb-0 text-2xl">
              Gestión de Deudores {collection && `- ${collection.name}`}
            </h2>
            {hasData && (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 flex-col sm:flex-row">
                  {lastLoadDate && (
                    <div className="text-gray-500 wrap-anywhere">
                      <div>
                        <strong>Archivo:</strong> {fileName || 'Sin nombre'}
                      </div>
                      <div>
                        <strong>Cargado:</strong>{' '}
                        <span className="font-medium">{formatLoadDate(lastLoadDate)}</span>
                      </div>
                    </div>
                  )}
                  <button className="btn btn-warning" onClick={() => setShowClearModal(true)}>
                    🗑️ Eliminar Datos
                  </button>
                </div>
              </div>
            )}
          </div>

          {!hasData ? (
            <CsvLoader onDataLoaded={handleDataLoaded} />
          ) : (
            <div className="alert alert-info">
              <div className="flex justify-between items-center w-full">
                <div>
                  <div className="wrap-anywhere">
                    Tienes {deudores.length} registros cargados del archivo{' '}
                    <strong>{fileName}</strong>. Para cargar un nuevo archivo, primero debes
                    eliminar los datos actuales.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeudoresTabs>
        <TablaDeudores
          deudores={deudores}
          plantillas={plantillas}
          selectedPlantillaId={selectedPlantillaId}
          onPlantillaChange={setSelectedPlantillaId}
          isLoadingPlantillas={isLoadingPlantillas}
        />
      </DeudoresTabs>

      {/* Modal de confirmación para eliminar datos */}
      {showClearModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">⚠️ Confirmar eliminación</h3>
            <p className="py-4">
              ¿Estás seguro de que quieres eliminar todos los datos cargados?
              <br />
              <span className="text-warning font-medium">
                Esta acción no se puede deshacer y perderás {deudores.length} registros.
              </span>
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowClearModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-error" onClick={handleClearData}>
                Eliminar Datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
