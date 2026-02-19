import type { LinkProps } from '@tanstack/react-router'
import * as React from 'react'
import { Link } from '@tanstack/react-router'

import { DivideLinePseudo } from '@workspace/ui/components/divide-line'
import { Separator } from '@workspace/ui/components/separator'
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'
import { cn } from '@workspace/ui/lib/utils'

import type { NavUserProps } from './nav-user'
import type { NavigationLink, UserLink } from './navbar-types'
import { NavMain } from './nav-main'
import { NavMobile } from './nav-mobile'
import { NavUser } from './nav-user'

interface AppNavbarProps extends React.ComponentProps<'header'> {
  /** Height of the navbar. Applied as CSS custom property `--nav-height`. Defaults to `"64px"`. */
  height?: string
  /** The app logo element, rendered in the navbar header and mobile sheet. */
  logo: React.ReactNode
  /** TanStack Router link options for the home/logo link. */
  homeLinkOptions: LinkProps
  /** Navigation links shown in the desktop horizontal menu. */
  desktopLinks: ReadonlyArray<NavigationLink>
  /** Navigation links shown in the mobile sheet menu. Can differ from desktop links. */
  mobileLinks: ReadonlyArray<NavigationLink>
  /**
   * Generic slot for additional action controls (theme switchers, language switchers, etc.).
   * Rendered between the desktop nav and the user section.
   * The consuming app is responsible for responsive visibility classes.
   */
  actions?: React.ReactNode
  /**
   * Whether to initialize `useMediaQuery` with a value on first render.
   * Set to `false` for SSR frameworks (e.g., TanStack Start) to avoid hydration mismatches.
   * Defaults to `true` (suitable for client-only SPAs).
   */
  shouldInitializeMediaQueryWithValue?: boolean
  /**
   * Configuration for the user section.
   * When `enabled: false`, the user section is not rendered.
   * When `enabled: true`, the user section is rendered with the provided props.
   * By default, the user section is disabled.
   */
  user?:
    | {
        enabled: false
      }
    | {
        enabled: true
        /** Current auth session. When null, the loginSlot is shown instead. */
        session: NavUserProps['session']
        /** Whether the session is still being loaded. Shows a spinner when true. */
        isSessionPending: boolean
        /** Links displayed in the user dropdown (e.g., Profile, Settings). */
        userLinks: ReadonlyArray<UserLink>
        /**
         * React node rendered when the user is not authenticated.
         * Typically a Button wrapping a Link to the login page.
         */
        loginSlot: React.ReactNode
        /** Icon for the logout menu item. Defaults to IconLogout. */
        logoutIcon?: React.ComponentType<React.ComponentProps<'svg'>>
        /** Label for the logout menu item. Defaults to "Logout". */
        logoutLabel?: string
        /**
         * Callback invoked when the user clicks "Logout".
         * The consuming app handles sign-out, navigation, and cache invalidation.
         */
        onSignOut: () => void
      }
}

const AppNavbar = (props: AppNavbarProps) => {
  const {
    height = '64px',
    logo,
    homeLinkOptions,
    desktopLinks,
    mobileLinks,
    actions,
    shouldInitializeMediaQueryWithValue = true,
    user = { enabled: false },
    className,
    ...restProps
  } = props

  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 640px)', {
    initializeWithValue: shouldInitializeMediaQueryWithValue,
  })

  // Close mobile menu when switching to desktop viewport
  React.useEffect(() => {
    if (isDesktop && isMenuOpen) {
      setIsMenuOpen(false)
    }
  }, [isDesktop, isMenuOpen])

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

  const hasRightSection = !!actions || user.enabled

  return (
    <header
      data-slot="navbar"
      data-open={isMenuOpen}
      data-scrolled={isScrolled}
      className={cn('fixed inset-x-0 top-0 z-10 mr-(--removed-body-scroll-bar-size,0px)', className)}
      style={{ '--nav-height': height } as React.CSSProperties}
      {...restProps}
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
            <div className={'flex items-center justify-center gap-3'}>
              {/* Mobile Menu — visible only on small screens */}
              <NavMobile
                links={mobileLinks}
                logo={logo}
                homeLinkOptions={homeLinkOptions}
                isOpen={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                className={'sm:hidden'}
              />

              <Link {...homeLinkOptions} className={'w-fit'}>
                {logo}
              </Link>
            </div>
            <div className={'flex items-center gap-4'}>
              {/* Desktop Menu — hidden on small screens */}
              <NavMain links={desktopLinks} className={'hidden sm:block'} />

              {hasRightSection && (
                <>
                  <Separator orientation={'vertical'} className={'hidden sm:block'} />
                  <div className={'flex items-center gap-4'}>
                    {actions}
                    {actions && user.enabled && <Separator orientation={'vertical'} />}
                    {user.enabled && (
                      <NavUser
                        session={user.session}
                        isSessionPending={user.isSessionPending}
                        userLinks={user.userLinks}
                        onSignOut={user.onSignOut}
                        loginSlot={user.loginSlot}
                        logoutIcon={user.logoutIcon}
                        logoutLabel={user.logoutLabel}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DivideLinePseudo>
    </header>
  )
}

export { AppNavbar }
export type { AppNavbarProps }
