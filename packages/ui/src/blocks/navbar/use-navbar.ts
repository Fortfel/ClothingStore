import * as React from 'react'

import { NavbarContext } from './navbar-provider'

const useNavbar = () => {
  const context = React.useContext(NavbarContext)
  if (!context) {
    throw new Error('useNavbar must be used within a <Navbar> component.')
  }
  return context
}

export { useNavbar }
