import { Plus } from 'lucide-react';

interface PlantillasHeaderProps {
  onCreateClick: () => void;
}

export function PlantillasHeader({ onCreateClick }: PlantillasHeaderProps) {
  return (
    <div className="card w-full bg-base-100 shadow-sm border border-base-300">
      <div className="card-body">
        <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-base-content mb-2">Gestión de Plantillas</h1>
            <p className="text-base-content/70">
              Crea y administra plantillas de mensajes con variables dinámicas para personalizar tus
              comunicaciones
            </p>
          </div>
          <button className="btn btn-primary gap-2" onClick={onCreateClick}>
            <Plus size={16} />
            Nueva Plantilla
          </button>
        </div>
      </div>
    </div>
  );
}
