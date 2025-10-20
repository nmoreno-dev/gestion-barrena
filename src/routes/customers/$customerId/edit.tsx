import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/customers/$customerId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  throw new Error('Error a proposito');
  return (
    <>
      <div>Contenido de: {Route.fullPath}</div>
      <p>
        <strong>Path params:</strong> {JSON.stringify(params, null, 2)}
      </p>
    </>
  );
}
