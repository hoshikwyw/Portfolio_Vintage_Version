import { useContext } from 'react'
import { OSContext } from '@/os/context/osContext'

/**
 * Access OS window and appearance state.
 *
 * @throws if used outside an `<OSProvider>`.
 */
export const useOS = () => {
  const ctx = useContext(OSContext)
  if (!ctx) throw new Error('useOS must be used within an OSProvider')
  return ctx
}
