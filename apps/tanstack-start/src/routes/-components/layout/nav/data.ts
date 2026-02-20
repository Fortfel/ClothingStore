// @see https://tanstack.com/router/latest/docs/framework/react/guide/type-safety#avoid-internal-types-without-narrowing

import { IconSettings, IconUser } from '@tabler/icons-react'

import type { NavigationLink, UserLink } from '@workspace/ui/blocks/navbar'

import {
  aboutLinkOptions,
  contactLinkOptions,
  profileLinkOptions,
  settingsLinkOptions,
} from '~/routes/_app/-validations/app-link-options'

export const navigationDesktopLinks = [
  { type: 'basic', className: '', label: 'About', linkOptions: aboutLinkOptions() },
  { type: 'basic', className: '', label: 'Contact', linkOptions: contactLinkOptions() },
] as const satisfies ReadonlyArray<NavigationLink>

export const navigationMobileLinks = [...navigationDesktopLinks] as const satisfies ReadonlyArray<NavigationLink>

export const userLinks = [
  { label: 'Profile', icon: IconUser, className: '', linkOptions: profileLinkOptions() },
  { label: 'Settings', icon: IconSettings, className: '', linkOptions: settingsLinkOptions() },
] as const satisfies ReadonlyArray<UserLink>
