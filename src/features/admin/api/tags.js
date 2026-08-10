import { supabase } from '@/shared/lib/supabase'

export const listTags = async () => {
  const { data, error } = await supabase.from('tags').select('*').order('name')
  if (error) throw new Error(error.message)
  return data ?? []
}

export const createTag = async (name) => {
  const { data, error } = await supabase.from('tags').insert({ name }).select().single()
  if (error) throw new Error(error.message)
  return data
}

export const deleteTag = async (id) => {
  const { error } = await supabase.from('tags').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
