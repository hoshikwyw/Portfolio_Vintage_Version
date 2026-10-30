/**
 * The site's standalone pages, as paths.
 *
 * Shared rather than living only in `app/routes`: the desktop (in `os/`) links
 * to these pages, and the layering rule keeps `os/` from importing `app/`.
 * `app/routes` builds its route table from these, so the two cannot drift.
 */
export const PATHS = {
  desktop: '/',
  portfolio: '/portfolio',
  resume: '/resume',
}
