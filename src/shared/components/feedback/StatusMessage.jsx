import { FONT_STACK } from '@/shared/constants/fonts'

/**
 * Centered single-line message filling its container — the loading, error and
 * empty states for a window body.
 *
 * @param {'info'|'error'} [tone]
 */
const StatusMessage = ({ children, tone = 'info' }) => (
  <div className="w-full h-full flex items-center justify-center">
    <p
      className="text-[12px]"
      style={{ color: tone === 'error' ? '#8a3030' : '#5a5a5a', fontFamily: FONT_STACK }}
    >
      {children}
    </p>
  </div>
)

export default StatusMessage
