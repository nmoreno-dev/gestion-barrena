import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customers/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Contenido de: {Route.fullPath}</div>;
}
