import { createDatabase } from '@workspace/db/client'

import { env } from '~/env'

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof createDatabase> | undefined
}

export const db = globalForDb.db ?? createDatabase({ url: env.DATABASE_URL })

if (env.NODE_ENV !== 'production') {
  globalForDb.db = db
}
