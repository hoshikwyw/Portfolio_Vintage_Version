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

/**
 * Open the résumé in a new tab. It is a page generated from `profile`
 * (`/resume`), not a static PDF, so it can never fall out of step with the
 * site — the page offers its own "Save as PDF".
 */
export const openResume = () => window.open(profile.resume, '_blank', 'noopener')

/**
 * Start an email to Kayv in the visitor's own mail app.
 *
 * A `mailto:` link rather than Gmail's web composer: that sent anyone not
 * signed in to Gmail — Outlook users, recruiters on a work account, phones
 * with another mail app — to a Google login page instead of an email.
 */
export const openHireEmail = ({
  subject = `Hire Request - ${profile.role}`,
  body = `Hello ${profile.name},\n\nI am interested in discussing a potential opportunity.\n\nBest regards,`,
} = {}) => {
  window.location.href =
    `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
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
