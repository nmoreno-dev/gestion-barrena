import '@/app/index.css';
import { Outlet, HeadContent, createRootRouteWithContext, Scripts } from '@tanstack/react-router';
import { lazy, Suspense, type ReactNode } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { IS_DEV, PACKAGE_JSON } from '@/app/constants';
import { Layout } from '@/common/components';

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
      <Layout>
        <Outlet />
      </Layout>
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
    <html data-theme="dracula">
      <head>
        <link rel="preload" href="../app/index.css" as="style" />
        <HeadContent />
      </head>
      <body className="bg-base-200">
        <div className="min-h-screen flex flex-col">
          {children}
          <footer className="mt-auto p-4 text-center bg-base-100 border-t border-base-300">
            <p className="text-sm text-base-content/60">
              Gestión Selena v{PACKAGE_JSON.version} - Hecho con 💕 por Nahuel Moreno
            </p>
          </footer>
        </div>
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
