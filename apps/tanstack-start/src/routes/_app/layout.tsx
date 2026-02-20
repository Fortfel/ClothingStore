import type * as React from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

import { AppNavbar } from '~/routes/-components/layout/nav/app-navbar'

const NAVBAR_HEIGHT = '64px'

export const Route = createFileRoute('/_app')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <AppNavbar height={NAVBAR_HEIGHT} />
      <main
        className={'mx-auto min-h-dvh max-w-7xl px-4 py-6 pt-[calc(var(--nav-height)+1.5rem)] sm:px-6 lg:px-8'}
        style={{ '--nav-height': NAVBAR_HEIGHT } as React.CSSProperties}
      >
        <Outlet />
      </main>
    </>
  )
}
