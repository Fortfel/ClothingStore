import type Stripe from 'stripe'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import urlJoin from 'url-join'

import { auth } from '~/auth/server'
import { stripeClient } from '~/lib/stripe'
import { getBaseUrl } from '~/lib/url'

interface CheckoutItem {
  readonly id: number
  readonly name: string
  readonly price: number
  readonly quantity: number
  readonly imageUrl: string
}

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: { items: ReadonlyArray<CheckoutItem> }) => data)
  .handler(async ({ data }) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const headers = getRequestHeaders()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      throw new Error('You must be logged in to proceed to payment.')
    }

    if (data.items.length === 0) {
      throw new Error('Cart is empty.')
    }

    const baseUrl = getBaseUrl()

    const lineItems: Array<Stripe.Checkout.SessionCreateParams.LineItem> = data.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.imageUrl],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const checkoutSession = await stripeClient.checkout.sessions.create({
      mode: 'payment',
      customer_email: session.user.email,
      line_items: lineItems,
      success_url: urlJoin(baseUrl, '/checkout/success?session_id={CHECKOUT_SESSION_ID}'),
      cancel_url: urlJoin(baseUrl, '/checkout'),
      metadata: {
        userId: session.user.id,
      },
    })

    if (!checkoutSession.url) {
      throw new Error('Failed to create checkout session.')
    }

    return { url: checkoutSession.url }
  })
