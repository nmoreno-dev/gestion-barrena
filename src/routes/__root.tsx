import '@/app/index.css';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { IS_DEV } from '@/app/constants';
import { Layout } from '@/common/components';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Layout>
      <Outlet />
      {IS_DEV && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
      )}
    </Layout>
  );
}

// Lazy-load de los DevTools
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools })),
);
const TanStackRouterDevtools = lazy(() =>
  import('@tanstack/react-router-devtools').then(m => ({ default: m.TanStackRouterDevtools })),
);
