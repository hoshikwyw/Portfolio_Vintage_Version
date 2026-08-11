import { useId, useState } from 'react'
import { FONT_STACK } from '@/shared/constants/fonts'
import { signIn } from '@/features/admin/api/auth'
import { adminColors } from '@/features/admin/theme'
import { Button } from './ui'

const SHAKE_DURATION = 500

const LockGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const CredentialField = ({ label, type, value, onChange, autoComplete, autoFocus }) => {
  // A unique, stable name keeps password managers from auto-filling the form.
  // It used to be `x-${Date.now()}`, which changed on every keystroke.
  const name = useId()

  return (
    <div className="mb-3">
      <label htmlFor={name} className="block text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: adminColors.text }}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-[12px] outline-none px-2 py-1.5"
        style={{ border: 'var(--os-input-border)', background: adminColors.field, borderRadius: 'var(--os-btn-radius)', color: adminColors.text }}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
      />
    </div>
  )
}

/**
 * Credentials gate for the admin window.
 *
 * On success it does nothing but stop showing an error — the `useSession`
 * auth-state listener is what swaps this out for the dashboard, so there is no
 * `onLogin` callback to keep in sync.
 */
const AdminLogin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await signIn({ username, password })
    } catch (signInError) {
      setError(signInError.message)
      setShake(true)
      setTimeout(() => setShake(false), SHAKE_DURATION)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center" style={{ background: adminColors.window, fontFamily: FONT_STACK }}>
      <div
        className={shake ? 'animate-shake' : ''}
        style={{
          width: 300,
          background: adminColors.panel,
          border: `2px solid ${adminColors.borderDark}`,
          borderTopColor: adminColors.borderLight,
          borderLeftColor: adminColors.borderLight,
          borderRadius: 'var(--os-window-radius)',
          boxShadow: 'var(--os-window-shadow)',
        }}
      >
        <div
          className="px-2 py-1"
          style={{
            background: 'var(--os-titlebar)',
            borderRadius: 'calc(var(--os-window-radius) - 2px) calc(var(--os-window-radius) - 2px) 0 0',
          }}
        >
          <span
            className="text-[11px] font-bold uppercase tracking-wide flex items-center gap-1.5"
            style={{ color: 'var(--os-titlebar-text)' }}
          >
            <LockGlyph />
            Admin Login
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-4" autoComplete="off" data-lpignore="true" data-form-type="other">
          <p className="text-[11px] mb-3" style={{ color: adminColors.text }}>
            Enter your admin credentials to access the dashboard.
          </p>

          {error && (
            <div
              role="alert"
              className="mb-3 px-2 py-1.5 text-[10px] font-semibold"
              style={{
                background: 'var(--os-notice-error-bg)',
                border: '1px solid var(--os-notice-error-border)',
                borderRadius: 'var(--os-btn-radius)',
                color: 'var(--os-notice-error-text)',
              }}
            >
              {error}
            </div>
          )}

          <CredentialField
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            autoComplete="one-time-code"
            autoFocus
          />
          <CredentialField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
          />

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting} className="px-5 py-1 text-[11px]">
              {isSubmitting ? 'Signing in...' : 'Login'}
            </Button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default AdminLogin
