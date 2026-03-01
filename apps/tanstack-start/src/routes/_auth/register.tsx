import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/register')({
  beforeLoad: ({ search }) => {
    throw redirect({
      to: '/login',
      search,
      replace: true,
    })
  },
  component: () => null,
})
