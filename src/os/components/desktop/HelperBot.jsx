import { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useOSActions } from '@/os/hooks/useOS'
import { useGuide } from '@/os/hooks/useGuide'
import { preloadWindow } from '@/os/registry/windowImports'
import { Z_LAYERS } from '@/os/constants'
import { FONT_STACK } from '@/shared/constants/fonts'
import { guideIntro } from '@/shared/config/guide'
import RobotHead from './RobotHead'

/** Delay before the panel greets a first-time visitor, so the desktop lands first. */
const GREET_DELAY = 1400

/**
 * Desktop helper bot.
 *
 * Replaces the first-visit WelcomeDialog and the sticky note. The dialog was
 * modal and blocked the desktop before anyone had seen it; the note showed one
 * of six hints at random, so most were never read. This says one relevant
 * thing at a time, chosen from what the visitor has actually opened, and never
 * blocks anything.
 */
const HelperBot = () => {
  const { openWindow } = useOSActions()
  const { nudge, exploredCount, totalCount, nextHint, hasSeenGuide, markGuideSeen } = useGuide()

  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef(null)
  const ballRef = useRef(null)

  // Greet a first-time visitor once, then never automatically again.
  useEffect(() => {
    if (hasSeenGuide()) return

    const timer = setTimeout(() => {
      setIsOpen(true)
      markGuideSeen()
    }, GREET_DELAY)

    return () => clearTimeout(timer)
  }, [hasSeenGuide, markGuideSeen])

  // Move focus into the panel when it opens, and back to the ball on close.
  useEffect(() => {
    if (!isOpen) return
    panelRef.current?.focus({ preventScroll: true })
  }, [isOpen])

  const close = () => {
    setIsOpen(false)
    ballRef.current?.focus({ preventScroll: true })
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    // Stop the desktop's other Escape handlers from also reacting.
    event.stopPropagation()
    close()
  }

  const runAction = () => {
    if (nudge.id) openWindow(nudge.id)
    close()
  }

  const isTouring = exploredCount < totalCount

  return (
    <div
      className="os-bot-dock"
      style={{ zIndex: Z_LAYERS.dialog, fontFamily: FONT_STACK }}
    >
      <AnimatePresence>
        {isOpen && (
          <m.div
            ref={panelRef}
            role="dialog"
            aria-label="Kayv OS helper"
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="os-bot-panel"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, y: 8, scale: 0.97, transition: { duration: 0.14, ease: [0.4, 0, 0.9, 1] } }}
          >
            <div className="os-bot-panel-bar">
              <span className="os-bot-panel-title">{guideIntro.title}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close helper"
                className="os-bot-panel-close"
              >
                <X size={11} aria-hidden="true" />
              </button>
            </div>

            <div className="os-bot-panel-body">
              <p className="os-bot-intro">{guideIntro.text}</p>

              {/* Announced politely so the suggestion is not missed by a screen reader. */}
              <p className="os-bot-nudge" aria-live="polite">{nudge.text}</p>

              <div className="os-bot-panel-actions">
                {nudge.action && nudge.id ? (
                  <button
                    type="button"
                    className="quick-action-btn quick-action-primary"
                    onClick={runAction}
                    onPointerEnter={() => preloadWindow(nudge.id)}
                  >
                    {nudge.action}
                  </button>
                ) : (
                  <span />
                )}

                {!isTouring && (
                  <button type="button" className="quick-action-btn" onClick={nextHint}>
                    Another tip
                  </button>
                )}
              </div>

              <p className="os-bot-progress">
                {isTouring
                  ? `${exploredCount} of ${totalCount} windows explored`
                  : 'All windows explored — nice.'}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <button
        ref={ballRef}
        type="button"
        className="os-bot-ball"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close helper' : 'Open helper — tips for using Kayv OS'}
      >
        <RobotHead isAwake={isOpen} />
      </button>
    </div>
  )
}

export default HelperBot
