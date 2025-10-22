import { PlantillaCard } from '../PlantillaCard';
import { Plantilla } from '../../interfaces/plantilla';

interface PlantillasListProps {
  plantillas: Plantilla[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function PlantillasList({ plantillas, onEdit, onDelete, onDuplicate }: PlantillasListProps) {
  return (
    <div className="space-y-4">
      {plantillas.map(plantilla => (
        <PlantillaCard
          key={plantilla.id}
          plantilla={plantilla}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
}
