import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/customers/$customerId')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();

  return (
    // Muy interesante ver como con este layout podemos navegar las rutas
    // observar como cambia el contenido de la pagina (en el <Outlet />)
    // y aun asi mantener un estado sin path ni query params!!
    // Muy util para un sistema de tabs, un wizard o stepper, menus laterales o Modales basados en ruta.
    <>
      <h3 className="text-xl">{Route.fullPath} Laoyut</h3>
      <div role="tablist" className="tabs tabs-border">
        <Link
          role="tab"
          className="tab"
          activeProps={{ className: 'tab tab-active' }}
          activeOptions={{ exact: true }}
          to="/customers/$customerId"
          params={params}
        >
          Link to details
        </Link>
        <Link
          role="tab"
          className="tab"
          activeProps={{ className: 'tab tab-active' }}
          to="/customers/$customerId/edit"
          params={params}
        >
          Link to edit
        </Link>
      </div>
      <div className="p-8">
        <Outlet />
      </div>
    </>
  );
}
