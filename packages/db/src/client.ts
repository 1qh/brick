/* eslint-disable no-restricted-properties */
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

export const db = drizzle(
  createClient({
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_TOKEN
  })
)
