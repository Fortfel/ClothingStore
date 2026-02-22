import * as React from 'react'

import { DivideLinePseudo } from '@workspace/ui/components/divide-line'
import { cn } from '@workspace/ui/lib/utils'

import { NavbarProvider } from './navbar-provider'
import { useNavbar } from './use-navbar'

interface NavbarProps extends React.ComponentProps<'header'> {
  /** Height of the navbar. Applied as CSS custom property `--nav-height`. Defaults to `"64px"`. */
  height?: string
  /**
   * Whether to initialize `useMediaQuery` with a value on first render.
   * Set to `false` for SSR frameworks (e.g., TanStack Start) to avoid hydration mismatches.
   * True is suitable for client-only SPAs.
   * Defaults to `false`.
   */
  shouldInitializeMediaQueryWithValue?: boolean
}

const NavbarInner = ({
  height,
  className,
  children,
  ...props
}: { height: string } & Omit<NavbarProps, 'shouldInitializeMediaQueryWithValue'>) => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const { isMenuOpen, setIsMenuOpen, isDesktop } = useNavbar()

  // Close mobile menu when switching to desktop viewport
  React.useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isDesktop, isMenuOpen, setIsMenuOpen])

  // Track scroll position for navbar styling (blur + border intensity)
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header
      data-slot="navbar"
      data-open={isMenuOpen}
      data-scrolled={isScrolled}
      className={cn('fixed inset-x-0 top-0 z-10 mr-(--removed-body-scroll-bar-size,0px)', className)}
      style={{ '--nav-height': height } as React.CSSProperties}
      {...props}
    >
      <DivideLinePseudo
        orientation={'horizontal'}
        position={'bottom'}
        variant={'default'}
        asChild
        className={cn(
          'after:-bottom-0.5! after:opacity-0 after:brightness-[0.8]  after:transition-opacity',
          isScrolled && 'after:opacity-100',
        )}
      >
        <div className={'border-border bg-background/80 border-b backdrop-blur-md'}>
          <div
            className={
              'mx-auto my-0 flex h-(--nav-height) max-w-(--breakpoint-xl) items-center justify-between px-2 **:data-[slot="separator"]:h-6 sm:px-6'
            }
          >
            {children}
          </div>
        </div>
      </DivideLinePseudo>
    </header>
  )
}

const Navbar = ({ shouldInitializeMediaQueryWithValue = false, height = '64px', ...props }: NavbarProps) => {
  return (
    <NavbarProvider shouldInitializeMediaQueryWithValue={shouldInitializeMediaQueryWithValue}>
      <NavbarInner height={height} {...props} />
    </NavbarProvider>
  )
}

const NavbarLeft = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="navbar-left" className={cn('flex items-center gap-4', className)} {...props} />
}

const NavbarRight = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div data-slot="navbar-right" className={cn('flex items-center gap-4', className)} {...props} />
}

export { Navbar, NavbarLeft, NavbarRight }
