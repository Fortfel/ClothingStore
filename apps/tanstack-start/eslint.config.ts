import { defineConfig } from 'eslint/config'

import { baseConfig } from '@workspace/eslint-config/base'
import { reactConfig } from '@workspace/eslint-config/react'

export default defineConfig(
  {
    ignores: ['.nitro/**', '.output/**', '.tanstack/**'],
  },
  baseConfig,
  reactConfig,
)
