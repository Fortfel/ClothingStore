import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/_protected/test"!</div>
}
