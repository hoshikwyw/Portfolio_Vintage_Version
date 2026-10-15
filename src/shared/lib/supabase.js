import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** False in a checkout without a `.env` (see `.env.example`). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

/*
 * Without credentials `createClient` throws as soon as this module is
 * imported, which took down every window that touches data — including the
 * Terminal, which only wants projects for one command. The stand-in throws on
 * first *use* instead, inside the async API functions, so the failure arrives
 * as an ordinary rejected query and each window shows its own error state.
 */
const unconfigured = new Proxy({}, {
  get() {
    throw new Error('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  },
})

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : unconfigured

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
