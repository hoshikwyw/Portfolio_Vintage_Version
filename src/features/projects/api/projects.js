import { supabase, unwrap } from '@/shared/lib/supabase'

/**
 * Fetch all projects from the `projects_with_details` view, which joins
 * projects with their tags and cover image. Ordered by curated sort order.
 */
export const getProjects = async () =>
  unwrap(
    await supabase
      .from('projects_with_details')
      .select('*')
      .order('sort_order', { ascending: true }),
  )
