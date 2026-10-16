/**
 * Route paths, in one place so links and route definitions cannot drift.
 *
 * `window` is a deep link: `/window/Projects` boots the desktop with that
 * window already open and focused.
 */
export const ROUTES = {
  desktop: '/',
  resume: '/resume',
  window: '/window/:appId',
  windowFor: (appId) => `/window/${appId}`,
}
