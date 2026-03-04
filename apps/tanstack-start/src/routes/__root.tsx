/// <reference types="vite/client" />
import * as React from 'react'
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'

import { Toaster } from '@workspace/ui/components/sonner'
import { ThemeProvider } from '@workspace/ui/components/theme-provider'

import type { RouterContext } from '~/router'
import { config } from '~/config'
import { DefaultCatchBoundary } from '~/routes/-components/default-catch-boundary'
import appCss from '~/styles.css?url'
import { seo } from '~/utils/seo'

// Lazy load ALL devtools — they must never run on the server
const TanStackDevtools = React.lazy(() =>
  import('@tanstack/react-devtools').then((m) => ({ default: m.TanStackDevtools })),
)
const ReactQueryDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtoolsPanel })),
)
const TanStackRouterDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-router-devtools').then((m) => ({ default: m.TanStackRouterDevtoolsPanel })),
)
const FormDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-form-devtools').then((m) => ({ default: m.FormDevtoolsPanel })),
)

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'UTF-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
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
      }),
    ],
    links: [
      {
        rel: 'icon',
        type: 'image/png',
        href: 'https://www.google.com/s2/favicons?domain=www.fortfel.com',
      },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    )
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background text-foreground min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme={config.themeDefault}
          themes={config.themes.filter((theme) => theme.key !== 'system').map((theme) => theme.key)}
          storageKey={config.themeStorageKey}
          enableSystem
        >
          {children}
          <Toaster />
          <React.Suspense>
            <TanStackDevtools
              plugins={[
                {
                  name: 'Tanstack Query',
                  render: <ReactQueryDevtoolsPanel />,
                  defaultOpen: true,
                },
                {
                  name: 'Tanstack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: 'Tanstack Form',
                  render: <FormDevtoolsPanel />,
                },
              ]}
            />
          </React.Suspense>
          <Scripts />
        </ThemeProvider>
      </body>
    </html>
  )
}
