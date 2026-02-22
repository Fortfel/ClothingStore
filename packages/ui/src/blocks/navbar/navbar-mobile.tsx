import * as React from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { Menu } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Separator } from '@workspace/ui/components/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet'
import { cn } from '@workspace/ui/lib/utils'

import type { NavigationLink } from './navbar-types'
import { useNavbar } from './use-navbar'

interface NavbarMobileProps extends React.ComponentProps<'div'> {
  /** Navigation links to display in the mobile sheet. */
  links: ReadonlyArray<NavigationLink>
  /** The app header rendered in the sheet header. */
  header: React.ReactNode
}

const NavbarMobile = ({ links, header, className, children, ...props }: NavbarMobileProps) => {
  const { isMenuOpen, setIsMenuOpen } = useNavbar()
  const router = useRouter()

  // Automatically close the sheet when navigating to a new route
  React.useEffect(() => {
    const unsubscribe = router.subscribe('onBeforeLoad', () => {
      setIsMenuOpen(false)
    })

    return unsubscribe
  }, [router, setIsMenuOpen])

  return (
    <div data-slot="navbar-mobile" className={cn(className)} {...props}>
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild className={'hover:text-foreground hover:bg-black/4 dark:hover:bg-white/5'}>
          {children ?? (
            <Button variant="ghost" size="icon">
              <Menu />
              <span className="sr-only">Toggle menu</span>
            </Button>
          )}
        </SheetTrigger>
        <SheetContent side="left" className={'w-xs'}>
          <SheetHeader className="-mb-2">
            <SheetTitle>{header}</SheetTitle>
          </SheetHeader>
          <Separator />
          <div
            data-slot="navbar-mobile-content"
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

export { NavbarMobile }
