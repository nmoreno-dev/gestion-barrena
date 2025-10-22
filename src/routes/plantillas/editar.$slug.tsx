import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import PlantillaForm from '@/features/plantillas/components/PlantillaForm';
import { usePlantillas, useUpdatePlantilla } from '@/features/plantillas/queries/plantillasQueries';
import type { CreatePlantillaData } from '@/features/plantillas/interfaces/plantilla';
import { nameToSlug } from '@/features/plantillas/utils/slugify';

export const Route = createFileRoute('/plantillas/editar/$slug')({
  component: EditarPlantillaPage,
});

function EditarPlantillaPage() {
  const navigate = useNavigate();
  const { slug } = Route.useParams();
  const { data: plantillas = [], isLoading } = usePlantillas();
  const updatePlantillaMutation = useUpdatePlantilla();

  // Buscar la plantilla por slug
  const plantilla = plantillas.find(p => nameToSlug(p.name) === slug);

  const handleSubmit = async (data: CreatePlantillaData) => {
    if (!plantilla) return;
    await updatePlantillaMutation.mutateAsync({
      id: plantilla.id,
      data,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  // Plantilla no encontrada
  if (!plantilla) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
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
          <span>Plantilla no encontrada</span>
        </div>
        <button onClick={() => navigate({ to: '/plantillas' })} className="btn btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Volver a plantillas
        </button>
      </div>
    );
  }

  return <PlantillaForm mode="edit" initialData={plantilla} onSubmit={handleSubmit} />;
}
