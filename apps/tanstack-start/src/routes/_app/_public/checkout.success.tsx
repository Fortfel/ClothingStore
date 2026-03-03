import * as React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { CheckCircle } from 'lucide-react'

import { Button } from '@workspace/ui/components/button'

import { useCartStore } from '~/hooks/use-cart-store'
import { shopLinkOptions } from '~/routes/_app/-validations/app-link-options'

export const Route = createFileRoute('/_app/_public/checkout/success')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Order Confirmed',
      },
    ],
  }),
})

function RouteComponent() {
  const { clearCart } = useCartStore()

  React.useLayoutEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <CheckCircle className="size-16 text-green-500" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">Thank you for your order!</h1>
        <p className="text-muted-foreground mt-2">
          Your payment was successful. You will receive a confirmation email shortly.
        </p>
      </div>
      <Button asChild>
        <Link {...shopLinkOptions()}>Continue Shopping</Link>
      </Button>
    </div>
  )
}
