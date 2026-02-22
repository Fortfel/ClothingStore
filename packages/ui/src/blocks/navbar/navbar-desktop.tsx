import type * as React from 'react'
import { Link } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@workspace/ui/components/navigation-menu'
import { cn } from '@workspace/ui/lib/utils'

import type { NavigationLink } from './navbar-types'

interface NavbarDesktopProps extends React.ComponentProps<'div'> {
  /** Navigation links to display in the horizontal menu. */
  links: ReadonlyArray<NavigationLink>
  /** Whether to render the NavigationMenu viewport (used for dropdown sub-menus). */
  viewport?: boolean
}

const NavbarDesktop = ({ links, viewport = false, className, ...props }: NavbarDesktopProps) => {
  return (
    <div data-slot="navbar-desktop" className={cn(className)} {...props}>
      <NavigationMenu viewport={viewport}>
        <NavigationMenuList>
          {links.map((link) => (
            <NavigationMenuItem key={link.label}>
              <NavigationMenuLink
                asChild
                className={cn(
                  'transition-colors',
                  'focus:text-foreground hover:text-foreground hover:bg-black/4 focus:bg-black/4 [&.active]:text-black',
                  'dark:hover:text-foreground dark:focus:text-foreground dark:hover:bg-white/5 dark:focus:bg-white/5 dark:[&.active]:text-white',
                  link.className,
                )}
              >
                <Link
                  {...link.linkOptions}
                  onClick={(e) => {
                    // Blur the link after clicking to remove focus styles
                    e.currentTarget.blur()
                  }}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export { NavbarDesktop }
