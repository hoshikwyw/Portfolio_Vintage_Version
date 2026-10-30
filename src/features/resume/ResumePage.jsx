import { Link } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import {
  currently, education, experience, languages, platforms, profile, skills, summary, tools,
} from '@/shared/config/profile'
import { PATHS } from '@/shared/config/paths'
import { usePageMeta } from '@/shared/hooks/usePageMeta'
import './resume.css'

const Section = ({ title, children }) => (
  <section className="resume-section">
    <h2 className="resume-heading">{title}</h2>
    {children}
  </section>
)

/** `{ title, detail }` entries — the same data the About window's timelines use. */
const Entries = ({ items }) => (
  <ul className="resume-entries">
    {items.map((item) => (
      <li key={item.title}>
        <span className="resume-entry-title">{item.title}</span>
        <span className="resume-entry-detail">{item.detail}</span>
      </li>
    ))}
  </ul>
)

/** `{ name, tag }` rows as "Name — tag". */
const Pairs = ({ items }) => (
  <ul className="resume-pairs">
    {items.map(({ name, tag }) => (
      <li key={name}><strong>{name}</strong> — {tag}</li>
    ))}
  </ul>
)

/**
 * A one-page résumé generated from `shared/config/profile` — the same source
 * as the About window, the terminal and the SEO copy.
 *
 * It replaces a static PDF that had fallen out of date (it still described a
 * frontend developer) while every Resume button kept handing it out. Built
 * from the data, it updates with the site. "Save as PDF" is the browser's
 * print dialog; the print stylesheet lays it out as an A4 page.
 *
 * Deliberately plain and theme-independent: it is for printing and for
 * recruiters' applicant systems, not for the retro desktop.
 */
const ResumePage = () => {
  usePageMeta({
    title: `${profile.name} — Résumé`,
    description: `Résumé of ${profile.name}, ${profile.role.toLowerCase()} in ${profile.location}: experience, skills, tools and education.`,
    path: PATHS.resume,
  })

  const githubLabel = profile.github.replace(/^https?:\/\//, '')

  return (
    <div className="resume-root">
      <nav className="resume-toolbar" aria-label="Résumé actions">
        <Link to="/" className="resume-btn">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to Kayv OS
        </Link>
        <button type="button" className="resume-btn resume-btn-primary" onClick={() => window.print()}>
          <Printer size={14} aria-hidden="true" />
          Save as PDF
        </button>
      </nav>

      <main className="resume-sheet">
        <header className="resume-header">
          <h1 className="resume-name">{profile.name}</h1>
          <p className="resume-role">{profile.role} · {profile.location}</p>
          <p className="resume-contact">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`}>{profile.phone}</a>
            <span aria-hidden="true"> · </span>
            <a href={profile.github}>{githubLabel}</a>
          </p>
          {profile.availability && <p className="resume-availability">{profile.availability}</p>}
        </header>

        <Section title="Profile">
          <p className="resume-summary">{summary}</p>
        </Section>

        <Section title="Experience">
          <Entries items={experience} />
        </Section>

        <div className="resume-columns">
          <Section title="What I build">
            <Pairs items={platforms} />
          </Section>

          <Section title="Tools">
            <Pairs items={tools} />
          </Section>
        </div>

        <Section title="Core skills">
          <p>{skills.map((skill) => skill.name).join(' · ')}</p>
        </Section>

        <div className="resume-columns">
          <Section title="Education">
            <Entries items={education} />
          </Section>

          <div>
            <Section title="Currently">
              <Pairs items={currently} />
            </Section>
            <Section title="Languages">
              <Pairs items={languages.map(({ name, level }) => ({ name, tag: level }))} />
            </Section>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ResumePage
