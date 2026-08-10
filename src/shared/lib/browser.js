/**
 * Small imperative browser side effects (download, mailto, external search)
 * shared by the desktop shortcuts, start menu and context menu.
 *
 * Centralised so the résumé path and contact email are not duplicated — and
 * cannot drift — across components.
 */

import { profile } from '@/shared/config/profile'

/**
 * Trigger a browser download via a temporary anchor.
 *
 * The anchor is attached to the document before clicking — a detached one is
 * ignored by Firefox — and removed again immediately after.
 *
 * @param {string} url
 * @param {string} [filename] Suggested name for the saved file.
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  if (filename) link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/** Trigger a download of the résumé PDF from /public. */
export const downloadResume = () =>
  downloadFile(profile.resume, profile.resume.replace(/^\//, ''))

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
