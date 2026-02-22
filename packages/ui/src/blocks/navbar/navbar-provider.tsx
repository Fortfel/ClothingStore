import * as React from 'react'

import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'

interface NavbarContextValue {
  isMenuOpen: boolean
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDesktop: boolean | undefined
}

const NavbarContext = React.createContext<NavbarContextValue | null>(null)

interface NavbarProviderProps {
  /**
   * Whether to initialize `useMediaQuery` with a value on first render.
   * Set to `false` for SSR frameworks (e.g., TanStack Start) to avoid hydration mismatches.
   * True is suitable for client-only SPAs.
   */
  shouldInitializeMediaQueryWithValue: boolean
  children: React.ReactNode
}

const NavbarProvider = ({ shouldInitializeMediaQueryWithValue, children }: NavbarProviderProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: shouldInitializeMediaQueryWithValue,
  })

  const value = React.useMemo<NavbarContextValue>(
    () => ({ isMenuOpen, setIsMenuOpen, isDesktop }),
    [isMenuOpen, setIsMenuOpen, isDesktop],
  )

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
}

export { NavbarProvider, NavbarContext }
