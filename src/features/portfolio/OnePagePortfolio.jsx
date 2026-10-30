import { useEffect } from 'react'
import { profile } from '@/shared/config/profile'
import SiteHeader from './components/SiteHeader'
import { SECTIONS } from './sections'
import './portfolio.css'

/**
 * The whole portfolio as one scrolling page — the conventional site, for
 * visitors who would rather read than explore the desktop OS.
 *
 * Built from the same `shared/config/profile` data as the About window, the
 * résumé and the terminal, so it can never say something the rest of the site
 * does not. It follows the visitor's chosen theme (light retro reads as a
 * light page, classic and glass as dark) but drops the OS chrome for a
 * plain, fast, scrollable layout.
 */
const OnePagePortfolio = () => {
  useEffect(() => {
    const previous = document.title
    document.title = `${profile.name} — ${profile.role}`
    return () => { document.title = previous }
  }, [])

  // The page is a lazy route, so it mounts after the browser has already
  // tried (and failed) to jump to a #section in the URL. Jump once it exists.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  return (
    <div className="op-root" id="op-scroll">
      <a href="#main" className="op-skip">Skip to content</a>
      <SiteHeader sections={SECTIONS} />
      <main id="main">
        {SECTIONS.map(({ id, Component }) => <Component key={id} id={id} />)}
      </main>
    </div>
  )
}

export default OnePagePortfolio
