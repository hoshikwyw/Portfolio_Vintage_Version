/**
 * Registry of every window ("app") the OS can open.
 *
 * The `id` is the runtime key used everywhere — context state, taskbar,
 * z-index focus — so it must stay stable. Icons, labels and behaviour flags
 * are declared once here and consumed by the desktop icons, taskbar, start
 * menu and window chrome, replacing four separate hand-maintained maps.
 *
 * `initialSize` is optional: windows without one open at a fraction of the
 * desktop (see `WINDOW_INITIAL_*_RATIO`). Declare it for a window whose
 * content has a fixed size that the default would clip.
 */

export const apps = [
  { id: 'Home', icon: 'icons/home.svg', label: 'About Me', inStartMenu: true },
  {
    id: 'Projects',
    icon: 'icons/openFolder.svg',
    label: 'Projects',
    inStartMenu: true,
    /*
     * The carousel slide is a fixed 420px tall, so the default height ratio
     * clipped the cards' action buttons on shorter viewports. 560 leaves
     * ~500px of content area: the 420px slide, its 12px margins, and slack.
     *
     * A literal rather than an import from the projects slice — the window
     * registry is meant to be the only place the shell reaches into a
     * feature. Revisit alongside SLIDE_HEIGHT in `features/projects/constants`.
     */
    initialSize: { width: 860, height: 560 },
  },
  { id: 'Gallery', icon: 'icons/gallery.svg', label: 'Gallery', inStartMenu: true },
  { id: 'Send-Message', icon: 'icons/terminal.svg', label: 'Terminal', inStartMenu: true },
  { id: 'Settings', icon: 'icons/settings.svg', label: 'Settings', inStartMenu: true },
  {
    id: 'Minesweeper',
    icon: 'icons/mine.svg',
    label: 'Minesweeper',
    inStartMenu: true,
    // Sized for the Medium board; Expert scrolls rather than forcing a window
    // wider than most laptops.
    initialSize: { width: 470, height: 600 },
  },
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

/**
 * DOM id of a window's title element, referenced by the frame's
 * `aria-labelledby`. Lives here with the other id-derived helpers rather than
 * in the chrome component, where a non-component export breaks Fast Refresh.
 */
export const windowTitleId = (id) => `window-title-${id}`
