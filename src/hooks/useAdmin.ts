/**
 * Admin mode detection hook
 *
 * Enables admin features for authorized users.
 * Admin mode can be activated via:
 * - URL parameter: ?admin=siegel99@gmail.com
 * - localStorage (persists after URL param is used once)
 */

import { useState, useEffect } from 'react'

const ADMIN_EMAIL = 'siegel99@gmail.com'
const ADMIN_STORAGE_KEY = 'furniture-builder-admin'

export function useAdmin(): { isAdmin: boolean; adminEmail: string | null } {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)

  useEffect(() => {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search)
    const urlAdmin = urlParams.get('admin')

    if (urlAdmin === ADMIN_EMAIL) {
      // Store in localStorage for persistence
      localStorage.setItem(ADMIN_STORAGE_KEY, urlAdmin)
      setIsAdmin(true)
      setAdminEmail(urlAdmin)
      return
    }

    // Check localStorage
    const storedAdmin = localStorage.getItem(ADMIN_STORAGE_KEY)
    if (storedAdmin === ADMIN_EMAIL) {
      setIsAdmin(true)
      setAdminEmail(storedAdmin)
    }
  }, [])

  return { isAdmin, adminEmail }
}

/**
 * Clear admin mode (for logout)
 */
export function clearAdminMode(): void {
  localStorage.removeItem(ADMIN_STORAGE_KEY)
}
