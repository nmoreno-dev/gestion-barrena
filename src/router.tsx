import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { routerWithQueryClient } from '@tanstack/react-router-with-query';
import { QueryClient } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { ErrorPage, NotFoundPage } from './common/components';

const queryClient = new QueryClient();

export function createRouter() {
  const router = routerWithQueryClient(
    createTanStackRouter({
      context: {
        queryClient,
      },
      routeTree,
      scrollRestoration: true,
      defaultNotFoundComponent: NotFoundPage,
      defaultErrorComponent: ErrorPage,
    }),
    queryClient,
  );

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
