import { useEffect, useState } from 'react'
import { getSession, onAuthStateChange } from '@/features/admin/api/auth'

/**
 * The current Supabase session, kept in sync with sign-in / sign-out events.
 *
 * @returns {{ session: object|null, isChecking: boolean }}
 */
export const useSession = () => {
  const [session, setSession] = useState(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let active = true

    getSession()
      .then((current) => active && setSession(current))
      .catch(() => active && setSession(null))
      .finally(() => active && setIsChecking(false))

    const unsubscribe = onAuthStateChange((next) => active && setSession(next))

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  return { session, isChecking }
}
