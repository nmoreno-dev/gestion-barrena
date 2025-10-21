import '@/app/index.css';
import { Outlet, HeadContent, createRootRouteWithContext, Scripts } from '@tanstack/react-router';
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
        title: 'Gestión Selena',
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
    <html data-theme="corporate">
      <head>
        <link rel="preload" href="../app/index.css" as="style" />
        <HeadContent />
      </head>
      <body className="bg-base-200">
        <main className="w-full flex flex-col">
          <h1 className="text-3xl p-4 font-bold bg-base-100">Gestión Selena</h1>
          <div className="w-full p-4">{children}</div>
          <footer className="flex flex-col items-center">
            <p className="text-center">
              Gestión Selena v{PACKAGE_JSON.version} - Hecho con 💕 por Nahuel Moreno
            </p>
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
