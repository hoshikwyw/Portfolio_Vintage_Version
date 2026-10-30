import { PATHS } from '@/shared/config/paths'

/**
 * Route paths, in one place so links and route definitions cannot drift.
 *
 * `window` is a deep link: `/window/Projects` boots the desktop with that
 * window already open and focused. The standalone pages come from
 * `shared/config/paths`, which the desktop links to as well.
 */
export const ROUTES = {
  ...PATHS,
  window: '/window/:appId',
  windowFor: (appId) => `/window/${appId}`,
}
