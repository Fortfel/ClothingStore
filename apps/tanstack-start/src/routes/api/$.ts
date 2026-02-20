import { createFileRoute } from '@tanstack/react-router'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'

import { appRouter, createTRPCContext } from '@workspace/api/server'

import { auth } from '~/auth/server'
import { env } from '~/env'
import { db } from '~/lib/db'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: env.PUBLIC_TANSTACK_API_PATH,
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
        auth: auth,
        db: db,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path ?? 'undefined'}'`, error)
    },
  })

export const Route = createFileRoute('/api/$')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
    },
  },
})
