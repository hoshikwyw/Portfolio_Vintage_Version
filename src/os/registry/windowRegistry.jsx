import { About } from '@/features/about'
import { Projects } from '@/features/projects'
import { Gallery } from '@/features/gallery'
import { Terminal } from '@/features/terminal'
import { Settings } from '@/features/settings'
import Admin from '@/components/windows/admin/Admin'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'
import NotFound from '@/shared/components/feedback/NotFound'

/**
 * Maps an app id (see `@/os/config/apps`) to the component rendered inside its
 * window. Adding a window is: register it in `apps.js` and add a line here.
 *
 * This is the single seam between the OS shell and the feature slices — no
 * other shell module imports a feature.
 */
const windowRegistry = {
  Home: About,
  Projects,
  Gallery,
  'Send-Message': Terminal,
  Settings,
  Dashboard: Admin,
}

/**
 * Render the window body for a given app id. Unknown ids fall back to a 404,
 * and every window is wrapped in its own error boundary so one crashing app
 * shows an inline error instead of taking down the whole desktop.
 */
const WindowContent = ({ id }) => {
  const Window = windowRegistry[id]

  return (
    <ErrorBoundary key={id} variant="inline">
      {Window ? <Window /> : <NotFound title={id} />}
    </ErrorBoundary>
  )
}

export default WindowContent
