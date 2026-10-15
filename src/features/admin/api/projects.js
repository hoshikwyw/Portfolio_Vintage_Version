import { supabase, unwrap } from '@/shared/lib/supabase'

/** Every project, including unpublished ones, in curated order. */
export const listProjects = async () =>
  unwrap(await supabase.from('projects').select('*').order('sort_order')) ?? []

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

export const createProject = async (fields) =>
  unwrap(await supabase.from('projects').insert(normalizeFields(fields)).select().single())

export const updateProject = async (id, fields) =>
  unwrap(
    await supabase
      .from('projects')
      .update(normalizeFields(fields))
      .eq('id', id)
      .select()
      .single(),
  )

/** Deletes the project row; `project_images` and `project_tags` cascade. */
export const deleteProject = async (id) => {
  unwrap(await supabase.from('projects').delete().eq('id', id))
}

/** Tag ids currently attached to a project. */
export const getProjectTagIds = async (projectId) => {
  const rows = unwrap(await supabase.from('project_tags').select('tag_id').eq('project_id', projectId))
  return rows?.map((row) => row.tag_id) ?? []
}

/**
 * Replace a project's tags wholesale.
 *
 * There is no upsert that expresses "exactly this set", so the join rows are
 * cleared and re-inserted.
 */
export const setProjectTags = async (projectId, tagIds) => {
  unwrap(await supabase.from('project_tags').delete().eq('project_id', projectId))

  if (!tagIds.length) return

  unwrap(
    await supabase
      .from('project_tags')
      .insert(tagIds.map((tagId) => ({ project_id: projectId, tag_id: tagId }))),
  )
}
