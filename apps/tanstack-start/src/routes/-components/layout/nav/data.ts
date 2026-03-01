// @see https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#avoid-internal-types-without-narrowing

import type { NavigationLink, UserLink } from '@workspace/ui/blocks/navbar'

import { shopLinkOptions } from '~/routes/_app/-validations/app-link-options'

export const navigationDesktopLinks = [
  { type: 'basic', className: '', label: 'Shop', linkOptions: shopLinkOptions() },
] as const satisfies ReadonlyArray<NavigationLink>

export const navigationMobileLinks = [...navigationDesktopLinks] as const satisfies ReadonlyArray<NavigationLink>

export const userLinks = [] as const satisfies ReadonlyArray<UserLink>
