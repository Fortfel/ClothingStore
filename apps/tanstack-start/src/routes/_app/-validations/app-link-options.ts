import { linkOptions } from '@tanstack/react-router'

import type { CategorySlug } from '~/routes/_app/-categories'

export const homeLinkOptions = ({ withLabel = false }: { withLabel?: boolean } = {}) =>
  linkOptions({
    to: '/',

    'aria-label': withLabel ? 'Go to homepage' : undefined,
  })

// SHOP
export const shopLinkOptions = () =>
  linkOptions({
    to: '/shop',
  })

export const shopCategoryLinkOptions = ({ category }: { category: CategorySlug }) =>
  linkOptions({
    to: '/shop/$category',
    params: { category },
  })

// CHECKOUT
export const checkoutLinkOptions = () =>
  linkOptions({
    to: '/checkout',
  })
