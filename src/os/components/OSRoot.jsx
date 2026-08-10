import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { OSProvider } from '@/os/context/OSProvider'
import { getApp } from '@/os/config/apps'
import BootSplash from '@/os/components/BootSplash'
import Desktop from '@/os/components/desktop/Desktop'
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
  const deepLinkedApp = appId ? getApp(appId) : null
  const isUnknownWindow = Boolean(appId) && !deepLinkedApp

  const [booted, setBooted] = useState(false)

  if (isUnknownWindow) return <NotFoundPage />
  if (!booted) return <BootSplash onFinish={() => setBooted(true)} />

  return (
    <OSProvider initialWindowId={deepLinkedApp?.id}>
      <SeoContent />
      <Desktop />
      <SpeedInsights />
    </OSProvider>
  )
}

export default OSRoot
