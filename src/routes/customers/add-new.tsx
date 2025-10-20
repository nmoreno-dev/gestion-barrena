import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customers/add-new')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Contenido de: {Route.fullPath}</div>;
}
