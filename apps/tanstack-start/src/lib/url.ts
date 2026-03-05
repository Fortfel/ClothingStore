import { env } from '~/env'

export function getBaseUrl() {
  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return env.PUBLIC_TANSTACK_WEB_URL
}
