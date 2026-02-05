import { router } from './trpc.js'
import { userRouter } from './routers/users.js'
import { designRouter } from './routers/designs.js'

// Re-export from trpc for convenience
export { router, publicProcedure, protectedProcedure } from './trpc.js'

// Main app router
export const appRouter = router({
  users: userRouter,
  designs: designRouter,
})

export type AppRouter = typeof appRouter
