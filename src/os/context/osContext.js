import { createContext } from 'react'

/**
 * Raw OS context. Import the `OSProvider` to supply it and the `useOS` hook to
 * read it — this module exists only so the two can share the same object
 * without a circular import.
 */
export const OSContext = createContext(null)
