import { FileText, Plus } from 'lucide-react';

interface PlantillasEmptyStateProps {
  onCreateFirst: () => void;
}

export function PlantillasEmptyState({ onCreateFirst }: PlantillasEmptyStateProps) {
  return (
    <div className="card w-full bg-base-100 shadow-sm border border-base-300">
      <div className="card-body text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-base-200 rounded-full">
            <FileText size={48} className="text-base-content/30" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">No hay plantillas</h3>
        <p className="text-base-content/60 mb-6">
          Comienza creando tu primera plantilla de mensaje usando las variables disponibles
        </p>
        <button className="btn btn-primary gap-2" onClick={onCreateFirst}>
          <Plus size={16} />
          Crear Primera Plantilla
        </button>
      </div>
    </div>
  );
}
