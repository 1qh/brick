import baseConfig from '@a/eslint-config/base'
import reactConfig from '@a/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: []
  },
  ...baseConfig,
  ...reactConfig
]
