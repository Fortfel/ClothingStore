import { relations } from 'drizzle-orm'
import { pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

import { user as userTable } from './auth'

const timestamps = {
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}

export const post = pgTable('post', {
  id: serial().primaryKey(),
  title: varchar({ length: 256 }).notNull(),
  content: text().notNull(),
  ...timestamps,
  userId: text()
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
})

export const postInsertSchema = createInsertSchema(post, {
  userId: z.uuid(),
  title: z.string().min(3).max(256),
  content: z.string().min(3).max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const userPostRelations = relations(userTable, ({ many }) => ({
  posts: many(post),
}))

export const postUserRelations = relations(post, ({ one }) => ({
  user: one(userTable, {
    fields: [post.userId],
    references: [userTable.id],
  }),
}))
