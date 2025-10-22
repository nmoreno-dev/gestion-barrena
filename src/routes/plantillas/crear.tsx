import { PlantillaForm } from '@/features/plantillas/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/plantillas/crear')({
  component: PlantillaForm,
});
