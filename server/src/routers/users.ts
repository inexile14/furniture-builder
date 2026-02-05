import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { router, protectedProcedure } from '../trpc.js'
import { users } from '../db/schema.js'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { Webhook } from 'svix'
import { db } from '../db/index.js'

export const userRouter = router({
  // Get current user profile
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.auth.userId))
      .limit(1)

    return user[0] || null
  }),

  // Update current user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(users)
        .set({
          name: input.name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, ctx.auth.userId))
        .returning()

      return updated[0]
    }),
})

// Clerk webhook handler for user sync
export async function handleWebhook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET not set')
    return reply.status(500).send({ error: 'Webhook secret not configured' })
  }

  const svixId = request.headers['svix-id'] as string
  const svixTimestamp = request.headers['svix-timestamp'] as string
  const svixSignature = request.headers['svix-signature'] as string

  if (!svixId || !svixTimestamp || !svixSignature) {
    return reply.status(400).send({ error: 'Missing svix headers' })
  }

  const body = JSON.stringify(request.body)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Webhook verification failed:', err)
    return reply.status(400).send({ error: 'Invalid webhook signature' })
  }

  // Handle the webhook event
  const eventType = evt.type

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data

    const email = email_addresses?.[0]?.email_address
    const name = [first_name, last_name].filter(Boolean).join(' ') || null

    if (!email) {
      return reply.status(400).send({ error: 'User has no email' })
    }

    await db
      .insert(users)
      .values({
        id,
        email,
        name,
        avatarUrl: image_url,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email,
          name,
          avatarUrl: image_url,
          updatedAt: new Date(),
        },
      })

    console.log(`User ${eventType === 'user.created' ? 'created' : 'updated'}: ${id}`)
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    if (id) {
      await db.delete(users).where(eq(users.id, id))
      console.log(`User deleted: ${id}`)
    }
  }

  return reply.status(200).send({ received: true })
}

// Webhook event types (simplified)
interface WebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    email_addresses?: { email_address: string }[]
    first_name?: string
    last_name?: string
    image_url?: string
  }
}

