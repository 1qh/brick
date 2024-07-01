import type { Config } from 'drizzle-kit'

if (!process.env.TURSO_URL || !process.env.TURSO_TOKEN) {
  throw new Error('Missing TURSO_URL or TURSO_TOKEN')
}

export default {
  schema: './src/schema.ts',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN
  }
} satisfies Config
