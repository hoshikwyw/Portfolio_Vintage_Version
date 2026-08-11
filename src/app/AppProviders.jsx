import { BrowserRouter } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'

/*
 * Load the animation features after first paint. Until the import resolves,
 * `m` elements render as plain DOM nodes at their `initial` styles, so the
 * shell is visible and interactive without waiting on it.
 */
const loadMotionFeatures = () => import('@/shared/lib/motionFeatures').then((mod) => mod.default)

/**
 * Every app-wide provider, composed in one place.
 *
 * The error boundary is outermost so a crash inside routing or data fetching
 * still renders the OS-styled crash screen rather than a blank page.
 *
 * `strict` on LazyMotion makes the full `motion.*` component throw on sight —
 * a deliberate guardrail, because importing it anywhere would pull the feature
 * bundle back into the initial download and quietly undo the split.
 */
const AppProviders = ({ children }) => (
  <ErrorBoundary variant="fullscreen">
    <LazyMotion features={loadMotionFeatures} strict>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>
    </LazyMotion>
  </ErrorBoundary>
)

export default AppProviders
