import { supabase, unwrap } from '@/shared/lib/supabase'

/** Fetch gallery-visible project images, joined with their parent project. */
export const getProjectImages = async () =>
  unwrap(
    await supabase
      .from('project_images')
      .select(
        `
          id,
          image_url,
          is_cover,
          show_in_gallery,
          sort_order,
          project_id,
          projects ( id, title, demo_url )
        `,
      )
      .eq('show_in_gallery', true)
      .order('sort_order', { ascending: true }),
  )
