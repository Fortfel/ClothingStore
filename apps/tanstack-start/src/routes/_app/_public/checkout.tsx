import { createFileRoute, Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'

import { selectCartCount, selectCartTotal, useCartStore } from '~/hooks/use-cart-store'
import { shopLinkOptions } from '~/routes/_app/-validations/app-link-options'

export const Route = createFileRoute('/_app/_public/checkout')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Checkout',
      },
    ],
  }),
})

function RouteComponent() {
  const { store, incrementItem, decrementItem, removeItem, clearCart } = useCartStore()

  const items = useStore(store, (state) => state.items)
  const cartCount = useStore(store, selectCartCount)
  const cartTotal = useStore(store, selectCartTotal)

  if (cartCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-20">
        <ShoppingCart className="text-muted-foreground size-16" />
        <div className="text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground mt-2">Looks like you haven&apos;t added any items yet.</p>
        </div>
        <Button asChild>
          <Link {...shopLinkOptions()}>Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="py-6">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <p className="text-muted-foreground text-sm">
              {cartCount} item{cartCount === 1 ? '' : 's'} in your cart
            </p>
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
              Clear Cart
            </Button>
          </div>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-lg border p-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="bg-muted size-24 shrink-0 rounded-md object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-muted-foreground text-sm">${item.price.toFixed(2)} each</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => decrementItem(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => incrementItem(item.id)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate pr-2">
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button className="w-full" size="lg" disabled>
                Proceed to Payment
              </Button>
              <p className="text-muted-foreground text-center text-xs">Payment integration coming soon</p>
              <Button variant="outline" className="w-full" asChild>
                <Link {...shopLinkOptions()}>Continue Shopping</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
