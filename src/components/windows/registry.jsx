import About from './About'
import Projects from './Projects'
import Gallery from './Gallery'
import Terminal from './Terminal'
import Settings from './Settings'
import Admin from './admin/Admin'

/**
 * Maps an app id (see `@/config/apps`) to the component rendered inside its
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

/** Render the window body for a given app id. Returns null if unknown. */
const WindowContent = ({ id, windowSize }) => {
  const render = windowRegistry[id]
  return render ? render({ windowSize }) : null
}

export default WindowContent
