import { betterAuth } from 'better-auth'

import { getBaseOptions } from '@workspace/auth/server'
import { createDatabase } from '@workspace/db/client'

/**
 * @internal
 *
 * This export is needed strictly for the CLI to work with
 *     pnpm auth:schema:generate
 *
 * DO NOT USE THIS FILE DIRECTLY IN YOUR APPLICATION.
 * It should not be imported or used for any other purpose.
 *
 * This configuration is consumed by the CLI command:
 * `pnpx @better-auth/cli generate --config script/auth-cli.ts --output ../db/src/schemas/auth.ts`
 *
 * For actual authentication usage, import from "../src/index.ts" instead.
 *
 * The documentation for better-auth CLI can be found here:
 * - https://www.better-auth.com/docs/concepts/cli
 */
export const auth = betterAuth(
  getBaseOptions(
    createDatabase({
      url: 'postgresql://user:password@localhost:3306/mock',
    }),
    'http://localhost:2022',
  ),
)
