import type * as React from 'react'
import { Link, useLocation, useMatches, useNavigate, useRouter } from '@tanstack/react-router'

import type { AppNavbarProps as AppNavbarBlockProps } from '@workspace/ui/blocks/navbar'
import { AppNavbar as AppNavbarBlock } from '@workspace/ui/blocks/navbar'
import { Button } from '@workspace/ui/components/button'
import { useTheme } from '@workspace/ui/components/theme-provider'
import { ThemeSwitcherSwap, ThemeSwitcherToggle } from '@workspace/ui/components/theme-switcher'
import { useMediaQuery } from '@workspace/ui/hooks/use-media-query'

import { authClient } from '~/auth/client'
import { config } from '~/config'
import { homeLinkOptions } from '~/routes/_app/-validations/app-link-options'
import { loginLinkOptions } from '~/routes/_auth/-validations/auth-link-options'
import { Logo } from '~/routes/-components/layout/logo'
import { navigationDesktopLinks, navigationMobileLinks, userLinks } from './data'

const AppNavbar = ({ className, ...props }: React.ComponentProps<'header'> & Pick<AppNavbarBlockProps, 'height'>) => {
  const router = useRouter()
  const navigate = useNavigate()
  const location = useLocation()
  const matches = useMatches()
  const { data: session, isPending: isSessionPending } = authClient.useSession()
  const { theme, setTheme } = useTheme()
  const shouldShowThemeChangeAnimation = useMediaQuery('(min-width: 768px)', { initializeWithValue: false })

  const isProtectedRoute = matches.some((match) => match.routeId.includes('/_protected'))

  /**
   * Sign-out handler.
   * Calls the auth client, redirects to home if on a protected route,
   * and invalidates the router cache to refresh server data.
   */
  const handleSignOut = () => {
    void authClient.signOut().then(async () => {
      if (isProtectedRoute) {
        await navigate({ ...homeLinkOptions(), replace: true })
      }
      void router.invalidate()
    })
  }

  return (
    <AppNavbarBlock
      logo={<Logo aria-hidden="true" />}
      homeLinkOptions={homeLinkOptions({ withLabel: true })}
      desktopLinks={navigationDesktopLinks}
      mobileLinks={navigationMobileLinks}
      shouldInitializeMediaQueryWithValue={false}
      actions={
        <>
          <ThemeSwitcherToggle
            themes={config.themes}
            defaultValue={config.themeDefault}
            onChange={setTheme}
            value={theme}
            labelToggle={'Toggle theme'}
            enableAnimation={shouldShowThemeChangeAnimation}
            className={
              '[&>button]:hover:text-foreground hidden lg:block [&>button]:hover:bg-black/4 dark:[&>button]:hover:bg-white/5'
            }
          />
          <ThemeSwitcherSwap
            themes={config.themes}
            defaultValue={config.themeDefault}
            onChange={setTheme}
            value={theme}
            buttonVariant={'ghost'}
            labelToggle={'Toggle theme'}
            enableAnimation={shouldShowThemeChangeAnimation}
            className={
              '[&>button]:hover:text-foreground -mx-1 lg:hidden [&>button]:hover:bg-black/4 dark:[&>button]:hover:bg-white/5'
            }
          />
        </>
      }
      user={{
        enabled: true,
        session,
        isSessionPending,
        userLinks,
        loginSlot: (
          <Button variant="primary" asChild size={'sm'} className="max-lg:ml-1 max-lg:px-2">
            <Link {...loginLinkOptions()} search={{ redirect: location.href }} mask={loginLinkOptions()}>
              Login
            </Link>
          </Button>
        ),
        onSignOut: handleSignOut,
      }}
      className={className}
      {...props}
    />
  )
}

export { AppNavbar }
