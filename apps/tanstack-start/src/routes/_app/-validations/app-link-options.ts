import { linkOptions } from '@tanstack/react-router'

import type { CategorySlug } from '~/routes/_app/-categories'

export const homeLinkOptions = ({ withLabel = false }: { withLabel?: boolean } = {}) =>
  linkOptions({
    to: '/',

    'aria-label': withLabel ? 'Go to homepage' : undefined,
  })

export const profileLinkOptions = () =>
  linkOptions({
    to: '/profile',
  })

export const settingsLinkOptions = () =>
  linkOptions({
    to: '/settings',
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
