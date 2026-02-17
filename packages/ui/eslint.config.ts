import { defineConfig } from 'eslint/config'

import { baseConfig } from '@workspace/eslint-config/base'
import { reactConfig } from '@workspace/eslint-config/react'

export default defineConfig(
  {
    ignores: ['dist/**'],
  },
  baseConfig,
  reactConfig,
  {
    // Override rules for shadcn component files
    files: ['src/components/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    ignores: ['src/components/vaul/*'],
  },
)
