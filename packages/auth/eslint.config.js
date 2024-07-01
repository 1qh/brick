import baseConfig, { restrictEnvAccess } from '@a/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: []
  },
  ...baseConfig,
  ...restrictEnvAccess
]
