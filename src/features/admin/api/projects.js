import { supabase } from '@/shared/lib/supabase'

/** Every project, including unpublished ones, in curated order. */
export const listProjects = async () => {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

/** Text columns an empty form field should clear rather than blank out. */
const NULLABLE_TEXT = ['description', 'demo_url', 'repo_url', 'role', 'problem', 'outcome']

/**
 * Turn empty form inputs into real NULLs before writing.
 *
 * An untouched input hands back `''`. Postgres rejects that outright for the
 * integer `year` column, and for the text columns it stores an empty string —
 * which then reads as "present but blank" everywhere downstream, so a project
 * with no write-up would still offer to show one.
 */
const normalizeFields = (fields) => {
  const next = { ...fields }

  for (const key of NULLABLE_TEXT) {
    if (typeof next[key] === 'string' && next[key].trim() === '') next[key] = null
  }

  if (next.year === '' || next.year === undefined || next.year === null) {
    next.year = null
  } else {
    const parsed = Number(next.year)
    next.year = Number.isFinite(parsed) ? parsed : null
  }

  return next
}

export const createProject = async (fields) => {
  const { data, error } = await supabase.from('projects').insert(normalizeFields(fields)).select().single()
  if (error) throw new Error(error.message)
  return data
}

export const updateProject = async (id, fields) => {
  const { data, error } = await supabase
    .from('projects')
    .update(normalizeFields(fields))
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

/** Deletes the project row; `project_images` and `project_tags` cascade. */
export const deleteProject = async (id) => {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/** Tag ids currently attached to a project. */
export const getProjectTagIds = async (projectId) => {
  const { data, error } = await supabase.from('project_tags').select('tag_id').eq('project_id', projectId)
  if (error) throw new Error(error.message)
  return data?.map((row) => row.tag_id) ?? []
}

/**
 * Replace a project's tags wholesale.
 *
 * There is no upsert that expresses "exactly this set", so the join rows are
 * cleared and re-inserted.
 */
export const setProjectTags = async (projectId, tagIds) => {
  const { error: deleteError } = await supabase.from('project_tags').delete().eq('project_id', projectId)
  if (deleteError) throw new Error(deleteError.message)

  if (!tagIds.length) return

  const { error: insertError } = await supabase
    .from('project_tags')
    .insert(tagIds.map((tagId) => ({ project_id: projectId, tag_id: tagId })))
  if (insertError) throw new Error(insertError.message)
}
