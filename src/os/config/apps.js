/**
 * Registry of every window ("app") the OS can open.
 *
 * The `id` is the runtime key used everywhere — context state, taskbar,
 * z-index focus — so it must stay stable. Icons, labels and behaviour flags
 * are declared once here and consumed by the desktop icons, taskbar, start
 * menu and window chrome, replacing four separate hand-maintained maps.
 */

export const apps = [
  { id: 'Home', icon: 'icons/home.svg', label: 'About Me', inStartMenu: true },
  { id: 'Projects', icon: 'icons/openFolder.svg', label: 'Projects', inStartMenu: true },
  { id: 'Gallery', icon: 'icons/gallery.svg', label: 'Gallery', inStartMenu: true },
  { id: 'Send-Message', icon: 'icons/terminal.svg', label: 'Terminal', inStartMenu: true },
  { id: 'Settings', icon: 'icons/settings.svg', label: 'Settings', inStartMenu: true },
  // Dashboard is an admin-only surface: reachable via desktop/taskbar but
  // intentionally kept out of the start menu, and rendered with a lock icon.
  { id: 'Dashboard', icon: null, label: 'Dashboard', locked: true },
]

/** Apps shown as start-menu entries. */
export const startMenuApps = apps.filter((app) => app.inStartMenu)

const appById = Object.fromEntries(apps.map((app) => [app.id, app]))

/** Look up a single app definition by its id. */
export const getApp = (id) => appById[id]

/** Icon path for an app id (null when it uses a custom inline icon). */
export const getAppIcon = (id) => appById[id]?.icon ?? null

/** Human-friendly label for an app id, falling back to the id itself. */
export const getAppLabel = (id) => appById[id]?.label ?? id
