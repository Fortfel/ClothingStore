import { createFileRoute } from '@tanstack/react-router'

import { env } from '~/env'
import { stripeClient } from '~/lib/stripe'

export const Route = createFileRoute('/api/stripe/webhook')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.text()
        const signature = request.headers.get('stripe-signature')

        if (!signature) {
          return new Response('Missing Stripe signature', { status: 400 })
        }

        try {
          const event = await stripeClient.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET)

          // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
          switch (event.type) {
            case 'checkout.session.completed': {
              const session = event.data.object
              console.log(
                `[Stripe Webhook] Checkout session completed: ${session.id}`,
                `| Customer: ${String(session.customer_email)}`,
                `| Amount: ${String(session.amount_total)} ${String(session.currency)}`,
                `| User ID: ${String(session.metadata?.userId)}`,
              )
              break
            }
            default: {
              console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`)
            }
          }

          return Response.json({ received: true })
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error'
          console.error(`[Stripe Webhook] Error: ${message}`)
          return new Response(`Webhook Error: ${message}`, { status: 400 })
        }
      },
    },
  },
})
