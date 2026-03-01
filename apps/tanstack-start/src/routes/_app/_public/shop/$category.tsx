import { createFileRoute, notFound } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/components/sonner'

import type { CategorySlug } from '~/routes/_app/-categories'
import { useCartStore } from '~/hooks/use-cart-store'
import { CATEGORY_SLUGS } from '~/routes/_app/-categories'
import { SHOP_DATA } from '~/routes/_app/-data'

export const Route = createFileRoute('/_app/_public/shop/$category')({
  loader: ({ params }) => {
    if (!Object.values(CATEGORY_SLUGS).includes(params.category as CategorySlug)) {
      notFound({ throw: true })
    }
  },
  component: RouteComponent,
  notFoundComponent: () => <div>This page does not exist</div>,
})

function RouteComponent() {
  const { category } = Route.useParams()
  const { addItem } = useCartStore()

  return (
    <div>
      <h1 className="py-8 text-center text-4xl font-bold uppercase">{category}</h1>
      <div className="grid grid-cols-1 gap-8 space-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {SHOP_DATA.map(
          (cat) =>
            cat.title === category &&
            cat.items.map((item) => (
              <div key={item.id} className="group relative">
                <img
                  className="aspect-square w-full object-cover group-hover:opacity-80"
                  src={item.imageUrl}
                  alt={item.name}
                />
                <div className="flex justify-between">
                  <h3>{item.name}</h3>
                  <p>{item.price}</p>
                </div>
                <Button
                  size="lg"
                  variant="secondary"
                  className="hover:bg-secondary-foreground hover:text-secondary absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer opacity-100 group-hover:opacity-100 sm:opacity-0"
                  onClick={() => {
                    addItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, price: item.price })
                    toast.success(`${item.name} added to cart`)
                  }}
                >
                  ADD TO CART
                </Button>
              </div>
            )),
        )}
      </div>
    </div>
  )
}
