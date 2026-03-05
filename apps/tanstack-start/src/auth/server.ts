import { tanstackStartCookies } from 'better-auth/tanstack-start'

import { initAuth } from '@workspace/auth/server'

import { env } from '~/env'
import { db } from '~/lib/db'
import { getBaseUrl } from '~/lib/url'

export const auth = initAuth({
  db,
  webUrl: getBaseUrl(),
  baseUrl: getBaseUrl(),
  productionUrl: env.PUBLIC_TANSTACK_WEB_URL,
  apiPath: env.PUBLIC_TANSTACK_API_PATH,
  authSecret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_CLIENT_ID,
  googleClientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
  discordClientId: env.AUTH_DISCORD_CLIENT_ID,
  discordClientSecret: env.AUTH_DISCORD_CLIENT_SECRET,

  extraPlugins: [tanstackStartCookies()],
})
