import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import { getAuth } from '@clerk/fastify'
import { db } from './db/index.js'

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // Get Clerk auth state
  const auth = getAuth(req)

  return {
    req,
    res,
    db,
    auth: {
      userId: auth.userId,
      sessionId: auth.sessionId,
      isSignedIn: !!auth.userId,
    },
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
