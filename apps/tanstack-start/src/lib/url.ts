/* eslint-disable no-restricted-properties */
import { env } from '~/env'

export function getBaseUrl() {
  // Client-side
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side
  // Cloudflare Pages (auto-injected in production/preview)
  if (process.env.CF_PAGES_URL) {
    return process.env.CF_PAGES_URL
  }

  return env.PUBLIC_TANSTACK_WEB_URL
}
