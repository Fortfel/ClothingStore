import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/_protected/test')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello &#34;/_app/_protected/test&#34;!</div>
}
