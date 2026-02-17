import type { RouterContext } from '@/router'
import type * as React from 'react'
import { createRootRouteWithContext, HeadContent, Outlet } from '@tanstack/react-router'

import { Toaster } from '@workspace/ui/components/sonner'

import { NotFound } from '@/routes/-components/not-found'

export const Route = createRootRouteWithContext<RouterContext>()({
  head: (_ctx) => ({
    meta: [
      {
        title: 'My App',

        // Dynamic titles via context:
        // Child routes can set context with getTitle() function, which can be
        // accessed here to build dynamic page titles like "My App - Page Name"
        //
        // Example in child route:
        // context: () => ({ getTitle: () => 'Dashboard' })
        // or
        // context: ({ context }) => {
        //     context.getTitle = () => 'new title'
        //   },
        //
        // Then access it here:
        // title: (() => {
        //   const title = ctx.matches.at(-1)?.context.getTitle?.()
        //   return title ? `My App - ${title}` : 'My App'
        // })()
        //
        // Note: This only works with the `context` property in child routes,
        // NOT with `beforeLoad`.
        //
        // See: https://tkdodo.eu/blog/context-inheritance-in-tan-stack-router
      },
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://www.google.com/s2/favicons?domain=www.fortfel.com',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
})

function RootComponent(): React.JSX.Element {
  return (
    <>
      <HeadContent />
      <Outlet />
      <Toaster />
    </>
  )
}
