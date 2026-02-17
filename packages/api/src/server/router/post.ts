import type { TRPCRouterRecord } from '@trpc/server'
import { z } from 'zod/v4'

import { postInsertSchema } from '@workspace/db/schema'

import { unwrapResult } from '../errors'
import * as PostService from '../services/post.service'
import { protectedProcedure, publicProcedure } from '../trpc'

export const postRouter = {
  all: publicProcedure.query(({ ctx }) => PostService.getAllPosts(ctx.db).then(unwrapResult)),

  byId: publicProcedure
    .input(z.object({ id: z.int() }))
    .query(({ ctx, input }) => PostService.getPostById(ctx.db, input.id).then(unwrapResult)),

  create: protectedProcedure
    .input(postInsertSchema)
    .mutation(({ ctx, input }) => PostService.createPost(ctx.db, input).then(unwrapResult)),

  delete: protectedProcedure
    .input(z.int())
    .mutation(({ ctx, input }) => PostService.deletePost(ctx.db, input).then(unwrapResult)),
} satisfies TRPCRouterRecord
