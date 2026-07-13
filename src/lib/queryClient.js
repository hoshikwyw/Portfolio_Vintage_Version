import { QueryClient } from '@tanstack/react-query'

/**
 * Shared React Query client. Data here (projects, gallery, weather) changes
 * rarely, so we keep it fresh for 5 minutes and cached for 10 to avoid
 * refetching on every window open.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (React Query v5: was `cacheTime`)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
