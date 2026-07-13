import { Routes, Route } from 'react-router-dom'
import OSRoot from '@/components/os/OSRoot'
import NotFoundPage from '@/components/system/NotFoundPage'

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
