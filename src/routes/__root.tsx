import '@/app/index.css';
import {
  Outlet,
  HeadContent,
  createRootRouteWithContext,
  Scripts,
  Link,
} from '@tanstack/react-router';
import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { IS_DEV, PACKAGE_JSON } from '@/app/constants';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

// Lazy-load de los DevTools
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })),
);
const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then(m => ({ default: m.TanStackRouterDevtools })),
);

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <link rel="preload" href="../app/index.css" as="style" />
        <HeadContent />
      </head>
      <body className="h-dvh w-dvw flex">
        <main className="grow flex flex-col bg-lime-500">
          <h1 className="text-3xl">App Laoyut</h1>
          <div role="tablist" className="tabs tabs-border">
            <Link className="tab" activeProps={{ className: 'tab tab-active' }} role="tab" to="/">
              Home
            </Link>
            <Link
              className="tab"
              activeProps={{ className: 'tab tab-active' }}
              activeOptions={{ exact: true }}
              role="tab"
              to="/customers"
            >
              Costumers
            </Link>
            <Link
              className="tab"
              activeProps={{ className: 'tab tab-active' }}
              role="tab"
              to="/customers/add-new"
              params={{ customerId: '1234' }}
            >
              Add Costumer
            </Link>
            <Link
              className="tab"
              activeProps={{ className: 'tab tab-active' }}
              activeOptions={{ exact: true }}
              role="tab"
              to="/customers/$customerId"
              params={{ customerId: '1234' }}
            >
              Costumer 1234 Details
            </Link>
            <Link
              className="tab"
              activeProps={{ className: 'tab tab-active' }}
              role="tab"
              to="/customers/$customerId/edit"
              params={{ customerId: '1234' }}
            >
              Costumer 1234 Edit
            </Link>
          </div>
          <div className="grow p-4 bg-cyan-500">{children}</div>
          <footer className="flex flex-col items-center bg-yellow-500">
            <p>Facturillo v{PACKAGE_JSON.version} - Hecho con 💕 por Los Galeses</p>
          </footer>
        </main>
        {IS_DEV && (
          <Suspense fallback={null}>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </Suspense>
        )}
        <Scripts />
      </body>
    </html>
  );
}
