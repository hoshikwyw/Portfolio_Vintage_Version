import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/services/projects'

/** Query hook for the full project list (sorted, with tags + cover image). */
export const useProjects = () =>
  useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })
