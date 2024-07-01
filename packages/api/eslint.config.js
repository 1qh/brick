import baseConfig from '@a/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**']
  },
  ...baseConfig
]
