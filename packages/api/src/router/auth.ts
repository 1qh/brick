import type { TRPCRouterRecord } from '@trpc/server'

import { invalidateSessionToken } from '@a/auth'

import { protectedProcedure, publicProcedure } from '../trpc'

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
  getSecretMessage: protectedProcedure.query(() => 'you can see this secret message!'),
  signOut: protectedProcedure.mutation(async opts => {
    if (!opts.ctx.token) {
      return { success: false }
    }
    await invalidateSessionToken(opts.ctx.token)
    return { success: true }
  })
} satisfies TRPCRouterRecord
