import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('Missing DATABASE_URL')
}

// const getDatabaseUrl = (): string => {
//   // Skip env validation in CI build pipeline where DATABASE_URL isn't available.
//   // The web build depends on db package build, which triggers db:generate.
//   // Drizzle only needs a valid URL format to generate migrations from schema -
//   // no actual database connection is made during generation.
//   if (process.env.CI) {
//     return 'mysql://dummy:dummy@localhost:3306/dummy'
//   }
//
//   const { env } = require('../../apps/fastify/src/env')
//   return env.DATABASE_URL
// }

export default defineConfig({
  out: './drizzle',
  schema: './src/schema.ts',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    // url: getDatabaseUrl(),
    url: process.env.DATABASE_URL,
  },
})
