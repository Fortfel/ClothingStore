import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod/v4'

import { authEnv } from '@workspace/auth/env'

// cloudflare:workers is only available in the worker/SSR context
// dynamically access it to avoid client bundle resolution errors
function getCfEnv(): Record<string, string> {
  try {
    // @ts-ignore — this module doesn't exist in client/Node context
    return globalThis.__env__ ?? {}
  } catch {
    return {}
  }
}

export const env = createEnv({
  clientPrefix: 'PUBLIC_',
  extends: [authEnv],
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PUBLIC_TANSTACK_WEB_URL: z.url({
      protocol: /^https?$/,
      hostname: z.regexes.hostname,
      error: 'Invalid web URL',
    }),
    PUBLIC_TANSTACK_API_PATH: z
      .string()
      .startsWith('/', { error: 'API Path must start with "/" if provided.' })
      .refine((val) => val === '/' || !val.endsWith('/'), {
        error: 'API Path must not end with "/" unless it is exactly "/"',
      })
      .default('/api'),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.url('Invalid database URL'),
    STRIPE_SECRET_KEY: z.string().min(1, 'Stripe secret key is required'),
    STRIPE_WEBHOOK_SECRET: z.string().min(1, 'Stripe webhook secret is required'),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `PUBLIC_`.
   */
  client: {
    PUBLIC_BASE_PATH: z
      .string()
      .startsWith('/', { error: 'Base Path must start with "/" if provided.' })
      .endsWith('/', { error: 'Base Path must end with "/" if provided.' })
      .default('/'),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   * Merge with import.meta.env for client-side access to PUBLIC_* variables in Vite/SSR apps.
   * Merge with Cloudflare Workers env bindings for worker runtime (dev via wrangler.json + root
   * .env, production via `wrangler secret put`).
   */
  runtimeEnv: {
    ...process.env,
    ...(typeof import.meta !== 'undefined' ? import.meta.env : {}),
    ...getCfEnv(),
  },
  skipValidation: !!process.env.CI || process.env.npm_lifecycle_event === 'lint',
})
