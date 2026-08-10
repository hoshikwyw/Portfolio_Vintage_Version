import { useQuery } from '@tanstack/react-query'
import { getProjectImages } from '@/features/gallery/api/projectImages'

/** Cache key for gallery images, shared with any code that invalidates it. */
export const PROJECT_IMAGES_QUERY_KEY = ['project_images']

/** Query hook for gallery-visible project images. */
export const useProjectImages = () =>
  useQuery({
    queryKey: PROJECT_IMAGES_QUERY_KEY,
    queryFn: getProjectImages,
  })
