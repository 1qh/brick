import type { InferSelectModel } from 'drizzle-orm'
import { relations, sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const History = sqliteTable('history', {
  id: text('id').primaryKey(),
  user: text('user')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  query: text('query').notNull(),
  source: text('source').notNull(),
  date: integer('date', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

export type Query = InferSelectModel<typeof History>

export const CreateHistorySchema = createInsertSchema(History, {
  id: z.string(),
  user: z.string(),
  query: z.string(),
  source: z.string()
}).omit({ date: true })

export const User = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),

  job: text('job').default(''),
  company: text('company').default(''),
  product: text('product').default(''),
  description: text('description').default(''),
  sellingPoint: text('sellingPoint').default('')
})

export const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),

  job: z.string().optional(),
  company: z.string().optional(),
  product: z.string().optional(),
  description: z.string().optional(),
  sellingPoint: z.string().optional()
})

export type UpdateUser = z.infer<typeof UpdateUserSchema>

export const UserRelations = relations(User, ({ many }) => ({ accounts: many(Account) }))

export const Account = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => User.id, { onDelete: 'cascade' }),
    type: text('type').$type<'email' | 'oauth' | 'oidc' | 'webauthn'>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state')
  },
  account => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
  })
)

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] })
}))

export const Session = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => User.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
})

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] })
}))
