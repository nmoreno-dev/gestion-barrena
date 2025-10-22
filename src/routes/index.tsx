import { TablaDeudores } from '@/features/deudores/components';
import CsvLoader from '@/features/deudores/components/CSVLoader';
import { Deudor } from '@/features/deudores/interfaces/deudor';
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  loadDeudoresFromStorage,
  saveDeudoresToStorage,
  clearStoredDeudores,
  formatLoadDate,
} from '@/features/deudores/utils';
import { toast } from '@/utils/toast';
import { usePlantillasForDeudores } from '@/common/hooks';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [deudores, setDeudores] = useState<Deudor[]>([]);
  const [hasStoredData, setHasStoredData] = useState(false);
  const [lastLoadDate, setLastLoadDate] = useState<Date | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPlantillaId, setSelectedPlantillaId] = useState<string | null>(null);

  // Cargar plantillas disponibles
  const { data: plantillas = [], isLoading: isLoadingPlantillas } = usePlantillasForDeudores();

  // Cargar datos de IndexedDB al iniciar
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedData = await loadDeudoresFromStorage();
        if (storedData) {
          setDeudores(storedData.deudores);
          setHasStoredData(true);
          setLastLoadDate(new Date(storedData.loadDate));
          setFileName(storedData.fileName);
          toast.success(`Cargados ${storedData.deudores.length} registros desde IndexedDB`);
        } else {
          setHasStoredData(false);
          setLastLoadDate(null);
          setFileName(null);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        toast.error('Error al cargar datos guardados');
      } finally {
        setLoading(false);
      }
    };

    loadStoredData();
  }, []);

  const handleDataLoaded = async (data: Deudor[], uploadedFileName: string) => {
    try {
      // Guardar en IndexedDB automáticamente
      await saveDeudoresToStorage(data, uploadedFileName);
      setDeudores(data);
      setHasStoredData(true);
      setLastLoadDate(new Date());
      setFileName(uploadedFileName);
      toast.success(`Archivo cargado y guardado: ${data.length} registros`);
    } catch (error) {
      console.error('Error al guardar datos:', error);
      toast.error('Archivo cargado pero no se pudo guardar localmente');
      setDeudores(data);
    }
  };

  const handleClearData = async () => {
    try {
      await clearStoredDeudores();
      setDeudores([]);
      setHasStoredData(false);
      setLastLoadDate(null);
      setFileName(null);
      setShowClearModal(false);
      toast.success('Datos eliminados correctamente');
    } catch (error) {
      console.error('Error al eliminar datos:', error);
      toast.error('Error al eliminar los datos');
    }
  };

  if (loading) {
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
    <div className="w-full  space-y-4">
      <div className="card w-full  bg-base-100 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex justify-between items-center flex-col md:flex-row">
            <h2 className="card-title mb-4 md:mb-0 text-2xl">Gestión de Deudores</h2>
            {hasStoredData && (
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

          {!hasStoredData ? (
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

      <TablaDeudores
        deudores={deudores}
        plantillas={plantillas}
        selectedPlantillaId={selectedPlantillaId}
        onPlantillaChange={setSelectedPlantillaId}
        isLoadingPlantillas={isLoadingPlantillas}
      />

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
