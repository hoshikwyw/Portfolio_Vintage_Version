import { supabase } from '@/shared/lib/supabase'

/**
 * Fetch all projects from the `projects_with_details` view, which joins
 * projects with their tags and cover image. Ordered by curated sort order.
 */
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects_with_details')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}
