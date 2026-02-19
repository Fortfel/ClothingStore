// @see https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#avoid-internal-types-without-narrowing
/**
 * Shared type definitions for the Navbar block.
 *
 * These interfaces define the data contracts between the consuming app
 * and the navbar components. Apps provide navigation data, session state,
 * and configuration through these types.
 *
 * Type safety is enforced at the consumer level via
 * `as const satisfies ReadonlyArray<NavigationLink>` in each app's `data.ts`,
 * where the registered router narrows `linkOptions()` to exact route types.
 *
 */

import type { LinkProps } from '@tanstack/react-router'
import type * as React from 'react'

interface NavigationLinkBasic {
  type: 'basic'
  className: string
  label: string
  linkOptions: LinkProps
}

// interface NavigationLinkIcon = {
//   type: 'icon'
//   label: string
//   href: LinkProps['to']
//   // submenu?: boolean
//   // items?: ReadonlyArray<NavigationLinks>
// }

type NavigationLink = NavigationLinkBasic

interface UserLink {
  label: string
  icon: React.ComponentType<React.ComponentProps<'svg'>>
  className: string
  linkOptions: LinkProps
}

export type { NavigationLink, UserLink }
