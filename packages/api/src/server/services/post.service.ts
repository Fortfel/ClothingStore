import type { z } from 'zod/v4'
import { errAsync, okAsync, ResultAsync } from 'neverthrow'

import type { DatabaseInstance } from '@workspace/db/client'
import type { postInsertSchema } from '@workspace/db/schema'
import { desc, eq } from '@workspace/db'
import { post } from '@workspace/db/schema'

import { dbError, notFound } from '../errors'

type PostInsert = z.infer<typeof postInsertSchema>

export const getAllPosts = (db: DatabaseInstance) =>
  ResultAsync.fromPromise(
    db.query.post.findMany({
      orderBy: desc(post.id),
      limit: 50,
    }),
    (e) => dbError('Failed to fetch posts', e),
  )

export const getPostById = (db: DatabaseInstance, id: number) =>
  ResultAsync.fromPromise(
    db.query.post.findFirst({
      where: eq(post.id, id),
    }),
    (e) => dbError('Failed to fetch post', e),
  ).andThen((p) => (p ? okAsync(p) : errAsync(notFound('post', id))))

export const createPost = (db: DatabaseInstance, input: PostInsert) =>
  ResultAsync.fromPromise(db.insert(post).values(input), (e) => dbError('Failed to create post', e))

export const deletePost = (db: DatabaseInstance, id: number) =>
  ResultAsync.fromPromise(db.delete(post).where(eq(post.id, id)), (e) => dbError('Failed to delete post', e))
