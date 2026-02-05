import { z } from 'zod'
import { eq, and, desc } from 'drizzle-orm'
import { router, protectedProcedure, publicProcedure } from '../trpc.js'
import { designs, users } from '../db/schema.js'

// Ensure user exists in database (creates if not present)
async function ensureUserExists(db: any, userId: string) {
  await db
    .insert(users)
    .values({
      id: userId,
      email: `${userId}@placeholder.clerk`, // Webhook will update with real email
    })
    .onConflictDoNothing({ target: users.id })
}

// Schema for table parameters (matches frontend TableParams)
const tableParamsSchema = z.object({
  tableType: z.string(),
  style: z.string(),
  length: z.number(),
  width: z.number(),
  height: z.number(),
  primaryWood: z.string(),
  secondaryWood: z.string().optional(),
  // Allow additional fields since TableParams is extensive
}).passthrough()

export const designRouter = router({
  // List user's own designs
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 20, offset = 0 } = input || {}

      const results = await ctx.db
        .select()
        .from(designs)
        .where(eq(designs.userId, ctx.auth.userId))
        .orderBy(desc(designs.updatedAt))
        .limit(limit)
        .offset(offset)

      return results
    }),

  // Get a single design by ID
  get: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(designs)
        .where(
          and(
            eq(designs.id, input.id),
            eq(designs.userId, ctx.auth.userId)
          )
        )
        .limit(1)

      if (!result[0]) {
        return null
      }

      return result[0]
    }),

  // Create a new design
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        description: z.string().max(2000).optional(),
        params: tableParamsSchema,
        furnitureType: z.string().default('table'),
        style: z.string().optional(),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure user exists (handles case where webhook hasn't run yet)
      await ensureUserExists(ctx.db, ctx.auth.userId)

      const result = await ctx.db
        .insert(designs)
        .values({
          userId: ctx.auth.userId,
          name: input.name,
          description: input.description,
          params: input.params,
          furnitureType: input.furnitureType,
          style: input.style || (input.params as any).style,
          thumbnail: input.thumbnail,
        })
        .returning()

      return result[0]
    }),

  // Update a design
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1).max(200).optional(),
        description: z.string().max(2000).optional(),
        params: tableParamsSchema.optional(),
        thumbnail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updates } = input

      // Build update object, only including provided fields
      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.params !== undefined) {
        updateData.params = updates.params
        updateData.style = (updates.params as any).style
      }
      if (updates.thumbnail !== undefined) updateData.thumbnail = updates.thumbnail

      const result = await ctx.db
        .update(designs)
        .set(updateData)
        .where(
          and(
            eq(designs.id, id),
            eq(designs.userId, ctx.auth.userId)
          )
        )
        .returning()

      return result[0] || null
    }),

  // Delete a design
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .delete(designs)
        .where(
          and(
            eq(designs.id, input.id),
            eq(designs.userId, ctx.auth.userId)
          )
        )
        .returning()

      return { deleted: result.length > 0 }
    }),

  // Browse public designs (for future marketplace)
  browse: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
        style: z.string().optional(),
        furnitureType: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 20, offset = 0 } = input || {}

      // For now, just return public designs
      // Future: add filtering by style, type, etc.
      const results = await ctx.db
        .select({
          id: designs.id,
          name: designs.name,
          description: designs.description,
          style: designs.style,
          furnitureType: designs.furnitureType,
          thumbnail: designs.thumbnail,
          createdAt: designs.createdAt,
          user: {
            id: users.id,
            name: users.name,
            avatarUrl: users.avatarUrl,
          },
        })
        .from(designs)
        .leftJoin(users, eq(designs.userId, users.id))
        .where(eq(designs.isPublic, true))
        .orderBy(desc(designs.createdAt))
        .limit(limit)
        .offset(offset)

      return results
    }),
})
