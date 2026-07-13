import { useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { OSProvider } from '@/context/OSContext'
import BootSplash from '@/components/os/BootSplash'
import Desktop from '@/components/os/Desktop'
import SeoContent from '@/components/seo/SeoContent'

const App = () => {
  const [focusedWindow, setFocusedWindow] = useState('Home')
  const [booted, setBooted] = useState(false)

  if (!booted) {
    return <BootSplash onFinish={() => setBooted(true)} />
  }

  return (
    <OSProvider>
      <SeoContent />
      <Desktop focusedWindow={focusedWindow} onFocus={setFocusedWindow} />
      <SpeedInsights />
    </OSProvider>
  )
}

export default App
