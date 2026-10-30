import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import OSRoot from '@/os/components/OSRoot'
import NotFoundPage from '@/shared/components/feedback/NotFoundPage'
import { ROUTES } from './routes'

// Lazy: the résumé is a page of its own, and none of it belongs in the
// desktop's first load.
const ResumePage = lazy(() => import('@/features/resume'))
const OnePagePortfolio = lazy(() => import('@/features/portfolio'))

/**
 * Routes:
 *   /                 → the desktop OS
 *   /window/:appId    → the OS with a specific window deep-linked open
 *   /portfolio        → the whole portfolio as one scrolling page
 *   /resume           → printable résumé generated from the profile
 *   *                 → full-page 404
 */
const App = () => (
  <Routes>
    <Route path={ROUTES.desktop} element={<OSRoot />} />
    <Route path={ROUTES.window} element={<OSRoot />} />
    <Route
      path={ROUTES.portfolio}
      element={(
        <Suspense fallback={null}>
          <OnePagePortfolio />
        </Suspense>
      )}
    />
    <Route
      path={ROUTES.resume}
      element={(
        <Suspense fallback={null}>
          <ResumePage />
        </Suspense>
      )}
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)

export default App
