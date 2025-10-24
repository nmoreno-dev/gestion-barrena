import { createFileRoute } from '@tanstack/react-router';
import { DeudoresTabs, CollectionTable } from '@/features/deudores/components';
import CsvLoader from '@/features/deudores/components/CSVLoader';
import { useState, useEffect, useRef } from 'react';
import {
  useDeudoresCollections,
  useCollectionInfo,
  useSaveDeudoresToCollection,
  useDeleteCollection,
  useCreateCollection,
  useUpdateCollectionName,
  formatLoadDate,
  Deudor,
} from '@/features/deudores';
import { usePlantillasForDeudores } from '@/common/hooks';

export const Route = createFileRoute('/deudores/')({
  component: DeudoresPage,
});

const DEFAULT_COLLECTION_NAME = 'Principal';

function DeudoresPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string | null>(null);
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
  const updateNameMutation = useUpdateCollectionName();

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

  const handleAddTab = () => {
    const newTabNumber = collections.length + 1;
    const newName = `Tabla ${newTabNumber}`;

    createMutation.mutate(newName, {
      onSuccess: collectionId => {
        setCurrentCollectionId(collectionId);
      },
    });
  };

  const handleDeleteCollection = (collectionId: string) => {
    setCollectionToDelete(collectionId);
    setShowDeleteModal(true);
  };

  const confirmDeleteCollection = () => {
    if (!collectionToDelete) return;

    clearMutation.mutate(collectionToDelete, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setCollectionToDelete(null);

        // Si eliminamos la colección activa, seleccionar otra
        if (collectionToDelete === currentCollectionId) {
          const otherCollection = collections.find(c => c.id !== collectionToDelete);
          if (otherCollection) {
            setCurrentCollectionId(otherCollection.id);
          } else if (collections.length === 1) {
            // Era la última, crear una nueva
            createMutation.mutate(DEFAULT_COLLECTION_NAME, {
              onSuccess: collectionId => {
                setCurrentCollectionId(collectionId);
              },
            });
          }
        }
      },
    });
  };

  const handleRenameTab = (collectionId: string, newName: string) => {
    updateNameMutation.mutate({
      collectionId,
      name: newName,
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
            {hasData && lastLoadDate && (
              <div className="text-gray-500 wrap-anywhere text-right">
                <div>
                  <strong>Archivo:</strong> {fileName || 'Sin nombre'}
                </div>
                <div>
                  <strong>Cargado:</strong>{' '}
                  <span className="font-medium">{formatLoadDate(lastLoadDate)}</span>
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

      <DeudoresTabs
        collections={collections}
        activeCollectionId={currentCollectionId}
        onTabChange={setCurrentCollectionId}
        onAddTab={handleAddTab}
        onDeleteTab={handleDeleteCollection}
        onRenameTab={handleRenameTab}
      >
        {collections.map(col => (
          <CollectionTable
            key={col.id}
            collectionId={col.id}
            isActive={col.id === currentCollectionId}
            plantillas={plantillas}
            selectedPlantillaId={selectedPlantillaId}
            onPlantillaChange={setSelectedPlantillaId}
            isLoadingPlantillas={isLoadingPlantillas}
          />
        ))}
      </DeudoresTabs>

      {/* Modal de confirmación para eliminar colección */}
      {showDeleteModal &&
        collectionToDelete &&
        (() => {
          const collectionData = collections.find(c => c.id === collectionToDelete);
          const recordCount = collectionData?.totalRecords || 0;

          return (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">⚠️ Confirmar eliminación de tabla</h3>
                <p className="py-4">
                  ¿Estás seguro de que quieres eliminar la tabla{' '}
                  <strong>{collectionData?.name}</strong> y todos sus datos?
                  <br />
                  <span className="text-warning font-medium">
                    Esta acción no se puede deshacer
                    {recordCount > 0 && ` y perderás ${recordCount} registros`}.
                  </span>
                </p>
                <div className="modal-action">
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setCollectionToDelete(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-error" onClick={confirmDeleteCollection}>
                    Eliminar Tabla
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
