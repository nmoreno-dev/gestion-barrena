import { useState } from 'react';
import {
  PlantillasHeader,
  PlantillasSearch,
  PlantillasList,
  PlantillasEmptyState,
} from './components';
import { useNavigate } from '@tanstack/react-router';

// Mock data para la UI
const mockPlantillas = [
  {
    id: '1',
    name: 'Recordatorio de Pago',
    body: 'Estimado [DEUDOR_NOMBRE], le recordamos que tiene una deuda pendiente de [DEUDA_ACTUAL]...',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: '2',
    name: 'Notificación Legal',
    body: 'Sr./Sra. [DEUDOR_NOMBRE], CUIL: [DEUDOR_CUIL], nos dirigimos a usted para informarle...',
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-18'),
  },
  {
    id: '3',
    name: 'Propuesta de Cancelación',
    body: 'Le ofrecemos la posibilidad de cancelar su deuda de [DEUDA_CANCELATORIA] mediante...',
    createdAt: new Date('2024-10-08'),
    updatedAt: new Date('2024-10-16'),
  },
];

function Plantillas() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Filtrar plantillas basado en el término de búsqueda
  const filteredPlantillas = mockPlantillas.filter(plantilla =>
    plantilla.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handlers para las acciones
  const handleCreatePlantilla = () => {
    navigate({ to: '/plantillas/crear' });
  };

  const handleEditPlantilla = (id: string) => {
    console.log('Editar plantilla:', id);
  };

  const handleDeletePlantilla = (id: string) => {
    console.log('Eliminar plantilla:', id);
  };

  const handlePreviewPlantilla = (id: string) => {
    console.log('Vista previa plantilla:', id);
  };

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
          onPreview={handlePreviewPlantilla}
        />
      )}
    </div>
  );
}

export default Plantillas;
