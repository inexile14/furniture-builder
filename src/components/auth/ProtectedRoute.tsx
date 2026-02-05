import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-workshop-100">
        <div className="animate-pulse text-workshop-600">Loading...</div>
      </div>
    )
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />
  }

  return <>{children}</>
}
