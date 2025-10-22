import { PlantillaCard } from '../PlantillaCard';

interface Plantilla {
  id: string;
  name: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PlantillasListProps {
  plantillas: Plantilla[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (id: string) => void;
}

export function PlantillasList({ plantillas, onEdit, onDelete, onPreview }: PlantillasListProps) {
  return (
    <div className="space-y-4">
      {plantillas.map(plantilla => (
        <PlantillaCard
          key={plantilla.id}
          plantilla={plantilla}
          onEdit={onEdit}
          onDelete={onDelete}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
}
