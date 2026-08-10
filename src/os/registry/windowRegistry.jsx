import { lazy, Suspense } from 'react'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'
import NotFound from '@/shared/components/feedback/NotFound'
import StatusMessage from '@/shared/components/feedback/StatusMessage'

/**
 * Maps an app id (see `@/os/config/apps`) to the component rendered inside its
 * window. Adding a window is: register it in `apps.js` and add a line here.
 *
 * This is the single seam between the OS shell and the feature slices — no
 * other shell module imports a feature.
 *
 * Each window is lazily imported so its dependencies (Swiper for Projects, the
 * Supabase admin surface for Dashboard) leave the initial bundle and load only
 * when that window is first opened.
 */
const windowRegistry = {
  Home: lazy(() => import('@/features/about')),
  Projects: lazy(() => import('@/features/projects')),
  Gallery: lazy(() => import('@/features/gallery')),
  'Send-Message': lazy(() => import('@/features/terminal')),
  Settings: lazy(() => import('@/features/settings')),
  Dashboard: lazy(() => import('@/features/admin')),
}

/**
 * Render the window body for a given app id. Unknown ids fall back to a 404,
 * and every window is wrapped in its own error boundary so one crashing app
 * shows an inline error instead of taking down the whole desktop.
 */
const WindowContent = ({ id }) => {
  const Window = windowRegistry[id]
  if (!Window) return <NotFound title={id} />

  return (
    <ErrorBoundary key={id} variant="inline">
      <Suspense fallback={<StatusMessage>Opening {id}...</StatusMessage>}>
        <Window />
      </Suspense>
    </ErrorBoundary>
  )
}

export default WindowContent
