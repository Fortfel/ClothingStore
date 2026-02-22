/**
 * NavbarUser — User authentication section of the navbar.
 *
 * Displays one of three states:
 * 1. **Loading** — A spinner while the session is being fetched
 * 2. **Authenticated** — Avatar with a dropdown menu (user info, links, logout)
 * 3. **Unauthenticated** — A login slot (typically a Button/Link to the login page)
 *
 * This component is decoupled from any specific auth library. The consuming app
 * provides session state and an `onSignOut` callback, keeping the block auth-agnostic.
 *
 * @example
 * ```tsx
 * <NavbarUser
 *   session={session}
 *   isSessionPending={isSessionPending}
 *   userLinks={userLinks}
 *   onSignOut={() => authClient.signOut().then(() => router.invalidate())}
 *   loginSlot={<Button asChild><Link to="/login">Login</Link></Button>}
 * />
 * ```
 */
import type * as React from 'react'
import { IconLogout } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { CircleSpinner } from '@workspace/ui/components/spinner'

import type { UserLink } from './navbar-types'

interface NavbarUserSession {
  user: {
    name: string
    email: string
    image?: string | null
  }
}

interface NavbarUserProps {
  /** Current auth session. When null, the loginSlot is shown instead. */
  session: NavbarUserSession | null
  /** Whether the session is still being loaded. Shows a spinner when true. */
  isSessionPending: boolean
  /** Links displayed in the user dropdown (e.g., Profile, Settings). */
  userLinks: ReadonlyArray<UserLink>
  /**
   * React node rendered when the user is not authenticated.
   * Typically a Button wrapping a Link to the login page.
   * The app controls the exact link, redirect params, and masking.
   */
  loginSlot: React.ReactNode
  /** Icon for the logout menu item. Defaults to IconLogout from \@tabler/icons-react. */
  logoutIcon?: React.ComponentType<React.ComponentProps<'svg'>>
  /** Label for the logout menu item. Defaults to "Logout". */
  logoutLabel?: string
  /**
   * Callback invoked when the user clicks "Logout".
   * The consuming app is responsible for calling its auth signOut method,
   * handling navigation (e.g., redirect if on a protected route), and
   * invalidating the router cache.
   */
  onSignOut: () => void
}

const NavbarUser = ({
  session,
  isSessionPending,
  userLinks,
  loginSlot,
  logoutIcon: LogoutIcon = IconLogout,
  logoutLabel = 'Logout',
  onSignOut,
}: NavbarUserProps) => {
  const navigate = useNavigate()

  if (isSessionPending)
    return (
      <>
        <CircleSpinner size={'sm'} />
      </>
    )

  return (
    <>
      {session?.user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage referrerPolicy="no-referrer" src={session.user.image ?? ''} alt={session.user.name} />
              <AvatarFallback className="text-sm">
                {(session.user.name.split(' ')[0]?.[0] ?? '') + (session.user.name.split(' ')[1]?.[0] ?? '')}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" sideOffset={5} className="w-[250px] rounded-lg">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <div className="flex flex-col items-start text-sm leading-tight">
                  <span className="truncate font-medium">{session.user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{session.user.email}</span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {userLinks.map((link) => (
                <DropdownMenuItem
                  key={link.label}
                  onClick={() => void navigate(link.linkOptions)}
                  className="cursor-pointer"
                >
                  <link.icon /> {link.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSignOut()} className="cursor-pointer">
                <LogoutIcon /> {logoutLabel}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        loginSlot
      )}
    </>
  )
}

export { NavbarUser }
