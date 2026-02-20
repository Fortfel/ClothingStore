import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
// NOTE: @vitejs/plugin-legacy is incompatible with SSR/Nitro builds.
// It generates `import("_")` which Rollup cannot resolve during SSR bundling.
// import legacy from '@vitejs/plugin-legacy'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig, loadEnv } from 'vite'
import VitePluginBrowserSync from 'vite-plugin-browser-sync'
import tsConfigPaths from 'vite-tsconfig-paths'
import { z } from 'zod/v4'

const envSchema = z.object({
  /**
   * Since vite is only used during development, we can assume the structure
   * will resemble a URL such as: http://localhost:3030.
   * This will then be used to set the vite dev server's host and port.
   */
  PUBLIC_TANSTACK_WEB_URL: z
    .url({
      protocol: /^https?$/,
      hostname: z.regexes.hostname,
      error: 'Invalid web URL',
    })
    .default('http://localhost:3030'),

  /**
   * Set this if you want to run or deploy your app at a base URL. This is
   * usually required for deploying a repository to Github/Gitlab pages.
   * PUBLIC_BASE_PATH=/repository-name/
   */
  PUBLIC_BASE_PATH: z
    .string()
    .startsWith('/', { error: 'Base Path must start with "/" if provided.' })
    .endsWith('/', { error: 'Base Path must end with "/" if provided.' })
    .default('/'),
})

export default defineConfig(({ mode }) => {
  const env = envSchema.parse(loadEnv(mode, process.cwd(), 'PUBLIC_'))

  const webUrl = new URL(env.PUBLIC_TANSTACK_WEB_URL)
  const HOST = webUrl.hostname
  const PORT = Number.parseInt(webUrl.port, 10)
  const isProd = mode === 'production'

  return {
    envPrefix: 'PUBLIC_',
    base: isProd ? env.PUBLIC_BASE_PATH : '/',
    plugins: [
      devtools({
        removeDevtoolsOnBuild: true,
      }),
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      nitro(),
      tanstackStart({
        router: {
          routeToken: 'layout',
        },
      }),
      viteReact(),
      tailwindcss(),
      // todo legacy plugin
      // legacy plugin disabled - incompatible with SSR/Nitro
      // legacy({
      //   // targets: ['defaults', 'not IE 11'], // its in browserlist option in packgae.json
      // }),
      VitePluginBrowserSync({
        dev: {
          bs: {
            port: PORT + 11,
          },
        },
      }),
    ],
    build: {
      outDir: 'build',
      emptyOutDir: true,
    },
    server: {
      host: HOST,
      port: PORT,
      strictPort: true,
    },
    optimizeDeps: {
      // Exclude TanStack Start packages from Vite's dependency optimization
      // to prevent issues with virtual imports (#tanstack-router-entry, etc.)
      exclude: [
        '@tanstack/start-server-core',
        // '@tanstack/react-start',
        // '@tanstack/react-start/client',
        // '@tanstack/react-start/server',
      ],
    },
  }
})
