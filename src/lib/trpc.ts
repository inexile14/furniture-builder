import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import { QueryClient } from '@tanstack/react-query'
import superjson from 'superjson'
import type { AppRouter } from '../../server/src/router'

// tRPC React client
export const trpc = createTRPCReact<AppRouter>()

// Query client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

// tRPC client configuration
export function createTRPCClient(getToken: () => Promise<string | null>) {
  return trpc.createClient({
    transformer: superjson,
    links: [
      httpBatchLink({
        url: `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/trpc`,
        async headers() {
          const token = await getToken()
          return token
            ? { Authorization: `Bearer ${token}` }
            : {}
        },
      }),
    ],
  })
}
