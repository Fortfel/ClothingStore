import type { LinkProps } from '@tanstack/react-router'
import * as React from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet'
import { useControllableState } from '@workspace/ui/hooks/use-controllable-state'
import { cn } from '@workspace/ui/lib/utils'

import type { NavigationLink } from './navbar-types'

interface NavMobileProps extends React.ComponentProps<'div'> {
  /** Navigation links to display in the mobile sheet. */
  links: ReadonlyArray<NavigationLink>
  /** The app logo rendered in the sheet header. */
  logo: React.ReactNode
  /** TanStack Router link options for the home/logo link in the sheet header. */
  homeLinkOptions: LinkProps
  /** Controlled open state. */
  isOpen?: boolean
  /** Default open state for uncontrolled usage. */
  defaultOpen?: boolean
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void
}

const NavMobile = ({
  links,
  logo,
  homeLinkOptions,
  isOpen,
  defaultOpen = false,
  onOpenChange,
  className,
  ...props
}: NavMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useControllableState({
    prop: isOpen,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })
  const router = useRouter()

  // Automatically close the sheet when navigating to a new route
  React.useEffect(() => {
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      setIsMenuOpen(false)
    })

    return unsubscribe
  }, [router, setIsMenuOpen])

  return (
    <div data-slot="navbar-sheet" className={cn(className)} {...props}>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild className={'hover:text-foreground hover:bg-black/4 dark:hover:bg-white/5'}>
          <Button variant="ghost" size="icon">
            <Menu />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={'w-xs'}>
          <SheetHeader className="-mb-2">
            <SheetTitle>
              <Link {...homeLinkOptions} className={'w-fit'}>
                {logo}
              </Link>
            </SheetTitle>
          </SheetHeader>
          <Separator />
          <div
            data-slot="navbar-sheet-content"
            className={cn(
              'flex flex-col gap-1 [&_a]:p-4 [&_a]:transition-colors',
              '[&_a]:hover:bg-black/5 [&_a]:focus:bg-black/5 [&_a.active]:bg-black/8 [&_a.active:hover]:bg-black/12 ',
              'dark:[&_a]:hover:bg-white/10 dark:[&_a]:focus:bg-white/10 dark:[&_a.active]:bg-white/15 dark:[&_a.active:hover]:bg-white/20',
            )}
          >
            {links.map((link) => (
              <Link key={link.label} {...link.linkOptions} className={link.className}>
                {link.label}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export { NavMobile }
export type { NavMobileProps }
