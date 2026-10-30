import { useEffect } from 'react'

/** Point `selector`'s `attr` at `value`; returns a function that puts it back. */
const setAttr = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (!el || value == null) return () => {}
  const previous = el.getAttribute(attr)
  el.setAttribute(attr, value)
  return () => el.setAttribute(attr, previous)
}

/**
 * Give a standalone page (the one-page site, the résumé) its own title,
 * description and canonical URL while it is mounted.
 *
 * Every route is served the same index.html, whose canonical points at the
 * desktop. Left alone, that tells search engines each page is a copy of the
 * home page and keeps it out of results. Google indexes the rendered page, so
 * correcting the tags here is enough. The site's origin is read from the
 * static canonical, so it is configured in one place: index.html.
 */
export const usePageMeta = ({ title, description, path }) => {
  useEffect(() => {
    const canonical = document.head.querySelector('link[rel="canonical"]')
    const url = path && canonical ? new URL(path, canonical.href).href : null

    const previousTitle = document.title
    if (title) document.title = title

    const restore = [
      setAttr('link[rel="canonical"]', 'href', url),
      setAttr('meta[property="og:url"]', 'content', url),
      setAttr('meta[property="og:title"]', 'content', title),
      setAttr('meta[name="description"]', 'content', description),
      setAttr('meta[property="og:description"]', 'content', description),
    ]

    return () => {
      document.title = previousTitle
      restore.forEach((undo) => undo())
    }
  }, [title, description, path])
}
