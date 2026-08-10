import { Component } from 'react'
import ErrorScreen from './ErrorScreen'

/**
 * Catches render/lifecycle errors in its subtree and shows <ErrorScreen>
 * instead of unmounting the whole app to a blank page.
 *
 * Used twice: once at the root (variant="fullscreen") so a crash during boot
 * still shows something, and once per window (variant="inline") so a single
 * broken window is contained and the rest of the OS keeps running.
 *
 * @param {'fullscreen'|'inline'} [variant]  Passed through to <ErrorScreen>.
 * @param {Function} [fallback]  Optional custom renderer: ({ error, reset }) => node.
 */
class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface the crash for debugging; swap for a real logger if one is added.
    console.error('ErrorBoundary caught an error:', error, info)
  }

  reset = () => this.setState({ error: null })

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const { fallback, variant } = this.props
    if (fallback) return fallback({ error, reset: this.reset })
    return <ErrorScreen error={error} onReset={this.reset} variant={variant} />
  }
}

export default ErrorBoundary
