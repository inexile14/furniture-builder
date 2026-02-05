import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'

export default function UserMenu() {
  const { user } = useUser()

  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="modal">
          <button className="btn-secondary text-sm">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center gap-3">
          <span className="text-sm text-workshop-600 hidden sm:inline">
            {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </span>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: 'w-8 h-8',
              },
            }}
          />
        </div>
      </SignedIn>
    </div>
  )
}
