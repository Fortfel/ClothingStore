import * as React from 'react'

interface NavbarContextValue {
  isMenuOpen: boolean
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavbarContext = React.createContext<NavbarContextValue | null>(null)

const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const value = React.useMemo<NavbarContextValue>(() => ({ isMenuOpen, setIsMenuOpen }), [isMenuOpen, setIsMenuOpen])

  return <NavbarContext.Provider value={value}>{children}</NavbarContext.Provider>
}

export { NavbarProvider, NavbarContext }
