/**
 * Small imperative browser side effects (download, mailto, external search)
 * shared by the desktop shortcuts, start menu and context menu.
 *
 * Centralised so the résumé path and contact email are not duplicated — and
 * cannot drift — across components.
 */

import { profile } from '@/shared/config/profile'

/** Trigger a download of the résumé PDF from /public. */
export const downloadResume = () => {
  const link = document.createElement('a')
  link.href = profile.resume
  link.download = profile.resume.replace(/^\//, '')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Open a pre-filled Gmail compose window addressed to Kayv. */
export const openHireEmail = ({
  subject = 'Hire Request - Frontend Developer',
  body = `Hello ${profile.name},\n\nI am interested in discussing a potential opportunity.\n\nBest regards,`,
} = {}) => {
  const url =
    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}` +
    `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(url, '_blank', 'noopener')
}

/** Open a Google search for the given query in a new tab. */
export const openGoogleSearch = (query) => {
  if (!query?.trim()) return
  window.open(
    `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    '_blank',
    'noopener',
  )
}
