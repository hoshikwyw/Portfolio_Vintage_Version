import { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { OSProvider } from '@/os/context/OSProvider'
import { getApp } from '@/os/config/apps'
import BootSplash from '@/os/components/BootSplash'
import Desktop from '@/os/components/desktop/Desktop'
import SeoContent from '@/features/seo'
import NotFoundPage from '@/shared/components/feedback/NotFoundPage'
import { readStorage, writeStorage } from '@/shared/lib/storage'

/** localStorage flag: this browser has sat through the boot sequence once. */
const BOOT_SEEN_KEY = 'kayv-boot-seen'

/**
 * The OS experience for a route. Renders the boot splash, then the desktop.
 *
 * When reached via `/window/:appId`, that window is opened + focused on load
 * (a shareable deep link). An unknown `appId` renders the full-page 404 rather
 * than booting into an empty desktop.
 *
 * The boot sequence plays once per browser. It used to run on every load —
 * three to four seconds that were charming the first time and a wait every
 * time after — and it is skipped outright for deep links, where the visitor
 * (often someone following a shared link) asked for a specific window.
 */
const OSRoot = () => {
  const { appId } = useParams()
  const deepLinkedApp = appId ? getApp(appId) : null
  const isUnknownWindow = Boolean(appId) && !deepLinkedApp

  const [booted, setBooted] = useState(() => Boolean(deepLinkedApp || readStorage(BOOT_SEEN_KEY)))

  const finishBoot = useCallback(() => {
    writeStorage(BOOT_SEEN_KEY, '1')
    setBooted(true)
  }, [])

  if (isUnknownWindow) return <NotFoundPage />
  if (!booted) return <BootSplash onFinish={finishBoot} />

  return (
    <OSProvider initialWindowId={deepLinkedApp?.id}>
      <SeoContent />
      <Desktop />
      <SpeedInsights />
    </OSProvider>
  )
}

export default OSRoot
