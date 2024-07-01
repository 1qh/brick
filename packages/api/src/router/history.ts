import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod'

import { desc, eq, inArray } from '@a/db'
import { CreateHistorySchema, History } from '@a/db/schema'

import { protectedProcedure, publicProcedure } from '../trpc'

export const historyRouter = {
  infinite: publicProcedure
    .input(
      z.object({
        user: z.string(),
        cursor: z.number().nullish(),
        limit: z.number().min(1)
      })
    )
    .query(async ({ ctx, input }) => {
      const cursor = input.cursor ?? 0
      const { limit } = input
      const items = await ctx.db
        .select()
        .from(History)
        .where(eq(History.user, input.user))
        .orderBy(desc(History.date))
        .offset(cursor)
        .limit(limit)
      return {
        items,
        next: items.length === limit ? cursor + limit : null
      }
    }),
  create: protectedProcedure
    .input(CreateHistorySchema)
    .mutation(({ ctx, input }) => ctx.db.insert(History).values(input)),

  delete: protectedProcedure
    .input(z.array(z.string()))
    .mutation(({ ctx, input }) => ctx.db.delete(History).where(inArray(History.id, input)))
} satisfies TRPCRouterRecord
