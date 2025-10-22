import { useState } from 'react';
import {
  PlantillasHeader,
  PlantillasSearch,
  PlantillasList,
  PlantillasEmptyState,
} from './components';
import { useNavigate } from '@tanstack/react-router';
import { usePlantillas, useDeletePlantilla, useCreatePlantilla } from './queries/plantillasQueries';
import { nameToSlug } from './utils/slugify';

function Plantillas() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch plantillas from database
  const { data: plantillas = [], isLoading, isError, error } = usePlantillas();
  const deletePlantillaMutation = useDeletePlantilla();
  const createPlantillaMutation = useCreatePlantilla();

  // Filtrar plantillas basado en el término de búsqueda
  const filteredPlantillas = plantillas.filter(plantilla =>
    plantilla.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handlers para las acciones
  const handleCreatePlantilla = () => {
    navigate({ to: '/plantillas/crear' });
  };

  const handleEditPlantilla = (id: string) => {
    const plantilla = plantillas.find(p => p.id === id);
    if (plantilla) {
      const slug = nameToSlug(plantilla.name);
      navigate({ to: '/plantillas/editar/$slug', params: { slug } });
    }
  };

  const handleDeletePlantilla = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta plantilla?')) {
      deletePlantillaMutation.mutate(id);
    }
  };

  const handleDuplicatePlantilla = (id: string) => {
    const plantilla = plantillas.find(p => p.id === id);
    if (plantilla) {
      createPlantillaMutation.mutate({
        name: `${plantilla.name} (copia)`,
        subject: plantilla.subject,
        body: plantilla.body,
        bcc: plantilla.bcc,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <PlantillasHeader onCreateClick={handleCreatePlantilla} />
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full space-y-6">
        <PlantillasHeader onCreateClick={handleCreatePlantilla} />
        <div className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error al cargar las plantillas: {error?.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header principal */}
      <PlantillasHeader onCreateClick={handleCreatePlantilla} />

      {/* Barra de búsqueda */}
      <PlantillasSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={filteredPlantillas.length}
      />

      {/* Lista de plantillas o estado vacío */}
      {filteredPlantillas.length === 0 && searchTerm === '' ? (
        <PlantillasEmptyState onCreateFirst={handleCreatePlantilla} />
      ) : filteredPlantillas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-base-content/60">
            No se encontraron plantillas que coincidan con &ldquo;{searchTerm}&rdquo;
          </p>
        </div>
      ) : (
        <PlantillasList
          plantillas={filteredPlantillas}
          onEdit={handleEditPlantilla}
          onDelete={handleDeletePlantilla}
          onDuplicate={handleDuplicatePlantilla}
        />
      )}
    </div>
  );
}

export default Plantillas;
