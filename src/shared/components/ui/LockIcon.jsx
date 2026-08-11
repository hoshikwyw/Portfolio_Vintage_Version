/**
 * Padlock glyph used to mark the admin-only Dashboard window across the
 * desktop icons, taskbar and window title bar. `variant` toggles the visual
 * treatment expected in each context.
 */
const LockIcon = ({ size = 14, variant = 'inline', className = '', style }) => {
  const variantStyles = {
    // Inside a window title bar, which stays dark in every theme — so the
    // glyph is forced white here rather than following the desktop token.
    inline: {
      className: 'inline-block mr-2 opacity-70',
      style: { verticalAlign: 'middle', filter: 'brightness(0) invert(1)' },
    },
    // On the taskbar tray / running-app row (inherits currentColor).
    tray: { className: 'flex-shrink-0', style: { opacity: 0.6 } },
    // Large desktop shortcut icon. Tinted from the same token as the <img>
    // shortcuts beside it, so it stays visible on a light wallpaper instead of
    // being forced white.
    desktop: {
      className: '',
      style: {
        filter: 'var(--os-desktop-icon-filter)',
        opacity: 0.85,
      },
    },
  }

  const preset = variantStyles[variant] ?? variantStyles.inline

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`${preset.className} ${className}`.trim()}
      style={{ ...preset.style, ...style }}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

export default LockIcon
