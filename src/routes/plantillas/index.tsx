import { Plantillas } from '@/features/plantillas';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/plantillas/')({
  component: PlantillasPage,
});

function PlantillasPage() {
  return <Plantillas />;
}
