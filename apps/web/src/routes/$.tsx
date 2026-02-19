import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/$')({
  loader: () => {
    // This triggers notFoundComponent from __root.tsx
    notFound({ throw: true })
  },
})
