import Fastify from 'fastify'
import cors from '@fastify/cors'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import { clerkPlugin } from '@clerk/fastify'
import dotenv from 'dotenv'
import { appRouter } from './router.js'
import { createContext } from './context.js'

dotenv.config()

const server = Fastify({
  logger: true,
  maxParamLength: 5000,
})

async function main() {
  // CORS for frontend (supports multiple origins for dev + production)
  const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[]

  await server.register(cors, {
    origin: allowedOrigins,
    credentials: true,
  })

  // Clerk authentication
  await server.register(clerkPlugin, {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })

  // tRPC API
  await server.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: { router: appRouter, createContext },
  })

  // Health check
  server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })

  // Clerk webhook handler (for user sync)
  server.post('/api/webhooks/clerk', async (request, reply) => {
    // Webhook verification and user sync handled in webhook router
    const { handleWebhook } = await import('./routers/users.js')
    return handleWebhook(request, reply)
  })

  const port = parseInt(process.env.PORT || '3001', 10)
  const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

  try {
    await server.listen({ port, host })
    console.log(`Server running at http://${host}:${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

main()
