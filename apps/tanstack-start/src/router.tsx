import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@workspace/api/client'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import { authClient } from '~/auth/client'
import { env } from '~/env'
import { makeTRPCClient, TRPCProvider } from '~/lib/trpc'
import { DefaultCatchBoundary } from '~/routes/-components/default-catch-boundary'
import { NotFound } from '~/routes/-components/not-found'
import { routeTree } from './routeTree.gen'

export interface RouterContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
  authClient: typeof authClient
  getTitle?: () => string
}

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: { serializeData: SuperJSON.serialize },
      hydrate: { deserializeData: SuperJSON.deserialize },
    },
  })
  const trpcClient = makeTRPCClient()
  const trpc = createTRPCOptionsProxy<AppRouter>({
    client: trpcClient,
    queryClient,
  })

  const router = createRouter({
    routeTree,
    context: { queryClient, trpc, authClient } satisfies RouterContext,
    // TanStack Router needs basepath without trailing slash
    basepath: import.meta.env.PROD ? env.PUBLIC_BASE_PATH.replace(/\/$/, '') : '',
    scrollRestoration: true,
    defaultPreload: 'intent',
    Wrap: (props) => <TRPCProvider trpcClient={trpcClient} queryClient={queryClient} {...props} />,
    defaultPendingComponent: () => (
      <div className="flex items-center justify-center">
        <CircleSpinner />
      </div>
    ),
    defaultErrorComponent: (props) => <DefaultCatchBoundary {...props} />,
    defaultNotFoundComponent: () => <NotFound />,
  })
  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
