import { useQuery } from '@tanstack/react-query'
import { getProjectImages } from '@/services/projectImages'

/** Query hook for gallery-visible project images. */
export const useProjectImages = () =>
  useQuery({
    queryKey: ['project_images'],
    queryFn: getProjectImages,
  })
