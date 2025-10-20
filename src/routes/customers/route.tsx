import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/customers')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <h3 className="text-2xl">{Route.fullPath} Laoyut</h3>
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
}
