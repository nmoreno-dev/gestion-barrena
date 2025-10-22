import { createFileRoute } from '@tanstack/react-router';
import PlantillaForm from '@/features/plantillas/components/PlantillaForm';
import { useCreatePlantilla } from '@/features/plantillas/queries/plantillasQueries';
import type { CreatePlantillaData } from '@/features/plantillas/interfaces/plantilla';

export const Route = createFileRoute('/plantillas/crear')({
  component: CrearPlantillaPage,
});

function CrearPlantillaPage() {
  const createPlantillaMutation = useCreatePlantilla();

  const handleSubmit = async (data: CreatePlantillaData) => {
    await createPlantillaMutation.mutateAsync(data);
  };

  return <PlantillaForm mode="create" onSubmit={handleSubmit} />;
}
