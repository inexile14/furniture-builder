import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { QueryClientProvider } from '@tanstack/react-query'
import App from './components/App'
import { TableProvider } from './context/TableContext'
import { trpc, queryClient, createTRPCClient } from './lib/trpc'
import './index.css'

// Get Clerk publishable key from environment
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn(
    'Missing VITE_CLERK_PUBLISHABLE_KEY. Auth features will be disabled. ' +
    'Add it to your .env file to enable authentication.'
  )
}

// Inner component that has access to Clerk auth
function AppWithProviders() {
  const { getToken } = useAuth()

  const trpcClient = React.useMemo(
    () => createTRPCClient(getToken),
    [getToken]
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TableProvider>
          <App />
        </TableProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

// Root component with Clerk provider
function Root() {
  // If no Clerk key, render without auth
  if (!CLERK_PUBLISHABLE_KEY) {
    return (
      <TableProvider>
        <App />
      </TableProvider>
    )
  }

  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AppWithProviders />
    </ClerkProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
