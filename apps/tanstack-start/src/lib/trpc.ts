import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { createTRPCClient, httpBatchStreamLink, loggerLink, unstable_localLink } from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'
import urlJoin from 'url-join'

import * as Api from '@workspace/api/server'

import { auth } from '~/auth/server'
import { env } from '~/env'
import { db } from '~/lib/db'
import { getBaseUrl } from '~/lib/url'

export const makeTRPCClient = createIsomorphicFn()
  .server(() => {
    return createTRPCClient<Api.AppRouter>({
      links: [
        unstable_localLink({
          router: Api.appRouter,
          transformer: SuperJSON,
          createContext: () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const headers = new Headers(getRequestHeaders())
            headers.set('x-trpc-source', 'tanstack-start-server')
            return Api.createTRPCContext({ headers, auth, db })
          },
        }),
      ],
    })
  })
  .client(() => {
    return createTRPCClient<Api.AppRouter>({
      links: [
        loggerLink({
          enabled: (op) => env.NODE_ENV === 'development' || (op.direction === 'down' && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          transformer: SuperJSON,
          url: urlJoin(getBaseUrl(), env.PUBLIC_TANSTACK_API_PATH),
          headers() {
            const headers = new Headers()
            headers.set('x-trpc-source', 'tanstack-start-client')
            return headers
          },
        }),
      ],
    })
  })

export const { useTRPC, TRPCProvider } = createTRPCContext<Api.AppRouter>()
