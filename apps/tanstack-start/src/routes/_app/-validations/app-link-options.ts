import { linkOptions } from '@tanstack/react-router'

export const homeLinkOptions = ({ withLabel = false }: { withLabel?: boolean } = {}) =>
  linkOptions({
    to: '/',

    'aria-label': withLabel ? 'Go to homepage' : undefined,
  })

export const aboutLinkOptions = () =>
  linkOptions({
    to: '/about',
  })

export const contactLinkOptions = () =>
  linkOptions({
    to: '/contact',
  })

export const profileLinkOptions = () =>
  linkOptions({
    to: '/profile',
  })

export const settingsLinkOptions = () =>
  linkOptions({
    to: '/settings',
  })
