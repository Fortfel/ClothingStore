import { createTRPCClient, httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'
import urlJoin from 'url-join'

import type { AppRouter } from '@workspace/api/client'

import { env } from '@/env'
import { queryClient } from '@/lib/query-client'

export const trpcClient = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient<AppRouter>({
    links: [
      // Enable logging in dev or on errors
      loggerLink({
        enabled: (op) => import.meta.env.DEV || (op.direction === 'down' && op.result instanceof Error),
      }),
      httpBatchLink({
        url: urlJoin(env.PUBLIC_SERVER_URL, env.PUBLIC_SERVER_API_PATH),
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
        transformer: SuperJSON,
      }),
    ],
  }),
  queryClient,
})
