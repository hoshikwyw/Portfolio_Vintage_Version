import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Turn a Supabase `{ data, error }` result into a plain value or a throw.
 *
 * Supabase resolves rather than rejects on failure, which React Query would
 * treat as success. Every API module funnels its results through here so a
 * failed query reaches the UI as an ordinary rejected promise.
 *
 * @param {{ data: any, error: { message: string } | null }} result
 * @returns {any} `result.data`
 */
export const unwrap = ({ data, error }) => {
  if (error) throw new Error(error.message)
  return data
}
