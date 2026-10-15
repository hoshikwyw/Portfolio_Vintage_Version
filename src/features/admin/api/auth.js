import { isSupabaseConfigured, supabase, unwrap } from '@/shared/lib/supabase'
import { ADMIN_EMAIL_DOMAIN } from '@/features/admin/constants'

/** Supabase Auth requires an email; bare usernames get the admin domain. */
const toEmail = (username) =>
  username.includes('@') ? username : `${username}@${ADMIN_EMAIL_DOMAIN}`

export const signIn = async ({ username, password }) =>
  unwrap(await supabase.auth.signInWithPassword({ email: toEmail(username), password })).session

export const signOut = async () => {
  unwrap(await supabase.auth.signOut())
}

export const getSession = async () => unwrap(await supabase.auth.getSession()).session

/**
 * Subscribe to sign-in / sign-out events.
 *
 * @param {(session: object|null) => void} onChange
 * @returns {() => void} Unsubscribe.
 */
export const onAuthStateChange = (onChange) => {
  // Called synchronously from an effect, so it cannot lean on the rejected-
  // promise path the other calls use when Supabase is not configured.
  if (!isSupabaseConfigured) return () => {}

  const { data } = supabase.auth.onAuthStateChange((_event, session) => onChange(session))
  return () => data.subscription.unsubscribe()
}
