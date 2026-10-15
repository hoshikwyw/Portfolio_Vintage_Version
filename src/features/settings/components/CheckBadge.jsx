import { Check } from 'lucide-react'

/**
 * The accent tick on a selected swatch, shared by the theme and wallpaper
 * pickers. `className` sizes and shapes the badge; `size` sizes the tick.
 */
const CheckBadge = ({ className, size }) => (
  <div className={className} style={{ background: 'var(--os-accent)' }}>
    <Check className={size} strokeWidth={3} style={{ color: '#fff' }} aria-hidden="true" />
  </div>
)

export default CheckBadge
