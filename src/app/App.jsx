import { Routes, Route } from 'react-router-dom'
import OSRoot from '@/os/components/OSRoot'
import NotFoundPage from '@/shared/components/feedback/NotFoundPage'
import { ROUTES } from './routes'

/**
 * Routes:
 *   /                 → the desktop OS
 *   /window/:appId    → the OS with a specific window deep-linked open
 *   *                 → full-page 404
 */
const App = () => (
  <Routes>
    <Route path={ROUTES.desktop} element={<OSRoot />} />
    <Route path={ROUTES.window} element={<OSRoot />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default App
