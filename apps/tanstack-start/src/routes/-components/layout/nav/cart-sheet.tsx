import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { ScrollArea } from '@workspace/ui/components/scroll-area'
import { Separator } from '@workspace/ui/components/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@workspace/ui/components/sheet'
import { useIsSSR } from '@workspace/ui/hooks/use-is-ssr'

import { selectCartCount, selectCartTotal, useCartStore } from '~/hooks/use-cart-store'
import { checkoutLinkOptions } from '~/routes/_app/-validations/app-link-options'

const CartSheet = () => {
  const { store, incrementItem, decrementItem, removeItem, clearCart } = useCartStore()
  const isSSR = useIsSSR()

  const items = useStore(store, (state) => state.items)
  const cartCount = useStore(store, selectCartCount)
  const cartTotal = useStore(store, selectCartTotal)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Open cart">
          <ShoppingCart className="size-5" />
          {!isSSR && cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 flex size-5 items-center justify-center p-0 text-[10px]">
              {cartCount > 99 ? '99+' : cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cartCount === 0
              ? 'Your cart is empty'
              : `${cartCount.toString()} item${cartCount === 1 ? '' : 's'} in your cart`}
          </SheetDescription>
        </SheetHeader>

        {cartCount === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingCart className="text-muted-foreground size-12" />
            <p className="text-muted-foreground text-sm">Your cart is empty</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[calc(100dvh-18rem)] flex-1 px-4">
              <div className="flex flex-col gap-4 py-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="bg-muted size-16 shrink-0 rounded-md object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive size-6 shrink-0"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            onClick={() => decrementItem(item.id)}
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-6"
                            onClick={() => incrementItem(item.id)}
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-4">
              <Separator />
            </div>

            <SheetFooter className="flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <SheetClose asChild>
                <Button asChild className="w-full">
                  <Link {...checkoutLinkOptions()}>Go to Checkout</Link>
                </Button>
              </SheetClose>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { CartSheet }
