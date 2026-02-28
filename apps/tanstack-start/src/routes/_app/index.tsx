import { createFileRoute, Link } from '@tanstack/react-router'

import { cn } from '@workspace/ui/lib/utils'

import { categories } from '~/routes/_app/-data'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="grid grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            {...category.route}
            className={cn(getSpan(index, categories.length), 'group relative h-60 cursor-pointer overflow-hidden')}
          >
            <div
              className={
                'absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105 group-hover:opacity-90'
              }
              style={{ backgroundImage: `url(${category.imageUrl})` }}
            />
            <div className={'relative flex size-full items-center justify-center'}>
              <div className="bg-muted border-muted-foreground text-foreground flex flex-col items-center gap-4 rounded-md border p-4 opacity-80 group-hover:opacity-100">
                <span className="font-bold uppercase">{category.title}</span>
                <span>Shop Now</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const getSpan = (index: number, total: number) => {
  // Mobile: 1 col → always full width
  const mobile = 'col-span-6'

  // Tablet: 2 cols (grid of 2, so use col-span-1 on a grid-cols-2...
  const mdRemainder = total % 2
  const isMdOrphan = mdRemainder === 1 && index === total - 1
  const tablet = isMdOrphan ? 'md:col-span-6' : 'md:col-span-3'

  // Desktop: 3 cols (grid of 6)
  const lgRemainder = total % 3
  const isLgInLastRow = index >= total - lgRemainder
  let desktop = 'lg:col-span-2'
  if (lgRemainder === 2 && isLgInLastRow) desktop = 'lg:col-span-3'
  if (lgRemainder === 1 && isLgInLastRow) desktop = 'lg:col-span-6'

  return `${mobile} ${tablet} ${desktop}`
}
