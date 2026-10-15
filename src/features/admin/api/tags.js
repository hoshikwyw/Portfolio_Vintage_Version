import { supabase, unwrap } from '@/shared/lib/supabase'

export const listTags = async () =>
  unwrap(await supabase.from('tags').select('*').order('name')) ?? []

export const createTag = async (name) =>
  unwrap(await supabase.from('tags').insert({ name }).select().single())

export const deleteTag = async (id) => {
  unwrap(await supabase.from('tags').delete().eq('id', id))
}
