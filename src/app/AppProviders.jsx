import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'

/**
 * Every app-wide provider, composed in one place.
 *
 * The error boundary is outermost so a crash inside routing or data fetching
 * still renders the OS-styled crash screen rather than a blank page.
 */
const AppProviders = ({ children }) => (
  <ErrorBoundary variant="fullscreen">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
)

export default AppProviders
