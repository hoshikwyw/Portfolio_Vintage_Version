import { Routes, Route } from 'react-router-dom'
import OSRoot from '@/os/components/OSRoot'
import NotFoundPage from '@/shared/components/feedback/NotFoundPage'

/**
 * Routes:
 *   /                 → the desktop OS
 *   /window/:appId    → the OS with a specific window deep-linked open
 *   *                 → full-page 404
 */
const App = () => (
  <Routes>
    <Route path="/" element={<OSRoot />} />
    <Route path="/window/:appId" element={<OSRoot />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default App
