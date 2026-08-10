import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { OSProvider } from '@/context/OSContext'
import { getApp } from '@/config/apps'
import BootSplash from '@/components/os/BootSplash'
import Desktop from '@/components/os/Desktop'
import SeoContent from '@/components/seo/SeoContent'
import NotFoundPage from '@/shared/components/feedback/NotFoundPage'

/**
 * The OS experience for a route. Renders the boot splash, then the desktop.
 *
 * When reached via `/window/:appId`, that window is opened + focused on load
 * (a shareable deep link). An unknown `appId` renders the full-page 404 rather
 * than booting into an empty desktop.
 */
const OSRoot = () => {
  const { appId } = useParams()
  const deepLink = appId ? getApp(appId) : null
  const isUnknownWindow = Boolean(appId) && !deepLink

  const [booted, setBooted] = useState(false)
  const [focusedWindow, setFocusedWindow] = useState(deepLink?.id ?? 'Home')

  if (isUnknownWindow) return <NotFoundPage />
  if (!booted) return <BootSplash onFinish={() => setBooted(true)} />

  return (
    <OSProvider>
      <SeoContent />
      <Desktop
        focusedWindow={focusedWindow}
        onFocus={setFocusedWindow}
        initialWindow={deepLink?.id}
      />
      <SpeedInsights />
    </OSProvider>
  )
}

export default OSRoot
