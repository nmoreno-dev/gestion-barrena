import { memo } from 'react';
import { useCollectionInfo, type PlantillaData } from '@/features/deudores';
import TablaDeudores from '../TablaDeudores';

interface CollectionTableProps {
  collectionId: string;
  isActive: boolean;
  plantillas: PlantillaData[];
  selectedPlantillaId: string | null;
  onPlantillaChange: (id: string | null) => void;
  isLoadingPlantillas: boolean;
}

const CollectionTable = memo(
  ({
    collectionId,
    isActive,
    plantillas,
    selectedPlantillaId,
    onPlantillaChange,
    isLoadingPlantillas,
  }: CollectionTableProps) => {
    const { deudores } = useCollectionInfo(collectionId);

    return (
      <div style={{ display: isActive ? 'block' : 'none' }}>
        <TablaDeudores
          deudores={deudores}
          plantillas={plantillas}
          selectedPlantillaId={selectedPlantillaId}
          onPlantillaChange={onPlantillaChange}
          isLoadingPlantillas={isLoadingPlantillas}
          collectionId={collectionId}
        />
      </div>
    );
  },
);

CollectionTable.displayName = 'CollectionTable';

export default CollectionTable;
