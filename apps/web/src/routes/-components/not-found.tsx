import { Link } from '@tanstack/react-router'

import { Button } from '@workspace/ui/components/button'

import { homeLinkOptions } from '@/routes/_app/-validations/app-link-options'

const NotFound = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;ixlib=rb-1.2.1&amp;auto=format&amp;fit=crop&amp;w=3050&amp;q=80&amp;exp=-20&amp;con=-15&amp;sat=-75"
        alt=""
        className="absolute inset-0 h-screen w-full object-cover"
      />
      <main className="relative grid place-items-center px-6 pt-6 sm:pt-16 lg:px-8">
        <div className="relative z-10 flex flex-col items-center text-white">
          {children || (
            <>
              <p className="text-base font-semibold">404</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">Page not found</h1>
              <p className="mt-6 text-center text-lg font-medium text-white/70 sm:text-xl/8">
                Sorry, we couldn&apos;t find the page you&apos;re looking for.
              </p>
            </>
          )}

          <div className="mt-16 flex flex-row gap-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="cursor-pointer border-white! uppercase"
            >
              Go back
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="border-white! uppercase"
            >
              <Link {...homeLinkOptions()}>Start Over</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

export { NotFound }
