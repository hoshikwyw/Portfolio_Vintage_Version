import { supabase } from '@/shared/lib/supabase'
import { ADMIN_EMAIL_DOMAIN } from '@/features/admin/constants'

/** Supabase Auth requires an email; bare usernames get the admin domain. */
const toEmail = (username) =>
  username.includes('@') ? username : `${username}@${ADMIN_EMAIL_DOMAIN}`

export const signIn = async ({ username, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: toEmail(username),
    password,
  })
  if (error) throw new Error(error.message)
  return data.session
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error(error.message)
  return data.session
}

/**
 * Subscribe to sign-in / sign-out events.
 *
 * @param {(session: object|null) => void} onChange
 * @returns {() => void} Unsubscribe.
 */
export const onAuthStateChange = (onChange) => {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => onChange(session))
  return () => data.subscription.unsubscribe()
}
