import { createFileRoute, Link } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/components/sonner'

import { useCartStore } from '~/hooks/use-cart-store'
import { SHOP_DATA } from '~/routes/_app/-data'
import { shopCategoryLinkOptions } from '~/routes/_app/-validations/app-link-options'

export const Route = createFileRoute('/_app/_public/shop/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { addItem } = useCartStore()

  return (
    <div className="flex flex-col gap-4">
      {SHOP_DATA.map((category) => (
        <div key={category.title}>
          <h2 className="mb-4 text-2xl font-bold uppercase">
            <Link {...shopCategoryLinkOptions({ category: category.title })} className={'hover:underline'}>
              {category.title}
            </Link>
          </h2>
          <div className="grid auto-cols-[calc(50%-8px)] grid-flow-col gap-4 overflow-hidden sm:auto-cols-[calc(33.333%-11px)] lg:auto-cols-[calc(25%-12px)]">
            {category.items.map((item) => (
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
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
