import {
  pgTable,
  text,
  timestamp,
  jsonb,
  boolean,
  integer,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table - synced from Clerk
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Designs table - saved furniture configurations
export const designs = pgTable('designs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),

  // The full table parameters as JSON
  params: jsonb('params').notNull(),

  // Furniture metadata
  furnitureType: text('furniture_type').notNull().default('table'),
  style: text('style'),

  // Visibility and marketplace
  isPublic: boolean('is_public').default(false).notNull(),
  isForSale: boolean('is_for_sale').default(false).notNull(),
  price: integer('price'), // In cents

  // Thumbnail (base64 or URL)
  thumbnail: text('thumbnail'),

  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  designs: many(designs),
}))

export const designsRelations = relations(designs, ({ one }) => ({
  user: one(users, {
    fields: [designs.userId],
    references: [users.id],
  }),
}))

// Type exports for use in application code
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Design = typeof designs.$inferSelect
export type NewDesign = typeof designs.$inferInsert
