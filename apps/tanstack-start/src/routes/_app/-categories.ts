// eslint-disable-line unicorn/filename-case
export const CATEGORY_SLUGS = {
  HATS: 'hats',
  JACKETS: 'jackets',
  SNEAKERS: 'sneakers',
  WOMENS: 'womens',
  MENS: 'mens',
} as const
export type CategorySlug = (typeof CATEGORY_SLUGS)[keyof typeof CATEGORY_SLUGS]
