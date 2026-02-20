import { createAuthClient } from '@workspace/auth/client'

import { env } from '~/env'
import { getBaseUrl } from '~/lib/url'

export const authClient = createAuthClient({
  apiBaseUrl: getBaseUrl(),
  apiBasePath: env.PUBLIC_TANSTACK_API_PATH,
})
