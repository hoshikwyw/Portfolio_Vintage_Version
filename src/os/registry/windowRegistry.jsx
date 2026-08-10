import About from '@/components/windows/About'
import Projects from '@/components/windows/Projects'
import Gallery from '@/components/windows/Gallery'
import Terminal from '@/components/windows/Terminal'
import Settings from '@/components/windows/Settings'
import Admin from '@/components/windows/admin/Admin'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'
import NotFound from '@/shared/components/feedback/NotFound'

/**
 * Maps an app id (see `@/os/config/apps`) to the component rendered inside its
 * window. Adding a window is: register it in `apps.js` and add a line here.
 */
const windowRegistry = {
  Home: () => <About />,
  Projects: ({ windowSize }) => <Projects windowSize={windowSize} />,
  Gallery: () => <Gallery />,
  'Send-Message': () => <Terminal />,
  Settings: () => <Settings />,
  Dashboard: () => <Admin />,
}

/**
 * Render the window body for a given app id. Unknown ids fall back to a 404,
 * and every window is wrapped in its own error boundary so one crashing app
 * shows an inline error instead of taking down the whole desktop.
 */
const WindowContent = ({ id, windowSize }) => {
  const render = windowRegistry[id]
  const body = render ? render({ windowSize }) : <NotFound title={id} />

  return (
    <ErrorBoundary key={id} variant="inline">
      {body}
    </ErrorBoundary>
  )
}

export default WindowContent
