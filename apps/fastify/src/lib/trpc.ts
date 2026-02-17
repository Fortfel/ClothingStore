import type { CreateFastifyContextOptions, FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify'

import type { AppRouter } from '@workspace/api/server'
import type { AuthInstance } from '@workspace/auth/server'
import type { DatabaseInstance } from '@workspace/db/client'
import { appRouter, createTRPCContext } from '@workspace/api/server'

import { env } from '#/env'

export const getFastifyTRPCPluginOptions = (
  db: DatabaseInstance,
  auth: AuthInstance,
): FastifyTRPCPluginOptions<AppRouter> => ({
  prefix: env.PUBLIC_SERVER_API_PATH,
  trpcOptions: {
    router: appRouter,
    createContext: ({ req }: CreateFastifyContextOptions) => {
      // Convert Fastify headers to standard Headers object
      const headers = new Headers()

      Object.entries(req.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString())
      })

      return createTRPCContext({
        headers,
        db,
        auth,
      })
    },
    onError({ path, error, type }) {
      const isProduction = env.NODE_ENV === 'production'

      if (error.code === 'INTERNAL_SERVER_ERROR') {
        console.error(`[TRPC Error] ${type} on ${path as string}:`, error)
      } else if (!isProduction) {
        // Log all errors in development
        console.log(`[TRPC] ${error.code} on ${path as string}: ${error.message}`)
      }
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
})
