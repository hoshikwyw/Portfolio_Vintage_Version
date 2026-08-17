import { lazy, memo, Suspense } from 'react'
import ErrorBoundary from '@/shared/components/feedback/ErrorBoundary'
import NotFound from '@/shared/components/feedback/NotFound'
import WindowSkeleton from '@/shared/components/feedback/WindowSkeleton'
import { windowImports } from './windowImports'

/**
 * Maps an app id (see `@/os/config/apps`) to the component rendered inside its
 * window. Adding a window is: register it in `apps.js` and add a line to
 * `./windowImports`.
 *
 * This is the single seam between the OS shell and the feature slices — no
 * other shell module imports a feature.
 *
 * Each window is lazily imported so its dependencies (Swiper for Projects, the
 * Supabase admin surface for Dashboard) leave the initial bundle and load only
 * when that window is first opened — or when `preloadWindow` warms it on hover.
 */
const windowRegistry = Object.fromEntries(
  Object.entries(windowImports).map(([id, load]) => [id, lazy(load)]),
)

/**
 * Render the window body for a given app id. Unknown ids fall back to a 404,
 * and every window is wrapped in its own error boundary so one crashing app
 * shows an inline error instead of taking down the whole desktop.
 *
 * Memoized on `id`, which is the only thing it renders from.
 *
 * Without this, anything that re-rendered `WindowLayer` — focusing a window,
 * dragging one, a resize event — re-rendered the *body* of every open window
 * along with it. Clicking between two windows would re-run the Projects
 * carousel and the Gallery grid each time, despite neither having changed.
 */
const WindowContent = memo(({ id }) => {
  const Window = windowRegistry[id]
  if (!Window) return <NotFound title={id} />

  return (
    <ErrorBoundary key={id} variant="inline">
      <Suspense fallback={<WindowSkeleton label={`Opening ${id}`} />}>
        <Window />
      </Suspense>
    </ErrorBoundary>
  )
})

WindowContent.displayName = 'WindowContent'

export default WindowContent
