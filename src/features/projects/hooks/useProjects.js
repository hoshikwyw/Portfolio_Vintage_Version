import { useQuery } from '@tanstack/react-query'
import { getProjects } from '@/features/projects/api/projects'

/** Cache key for the project list, shared with any code that invalidates it. */
export const PROJECTS_QUERY_KEY = ['projects']

/** Query hook for the full project list (sorted, with tags + cover image). */
export const useProjects = () =>
  useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: getProjects,
  })
