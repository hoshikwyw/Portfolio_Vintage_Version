import { useState } from 'react'
import { ArrowRight, BookOpen, Code2, ExternalLink } from 'lucide-react'
import AppIcon from '@/shared/components/icons/AppIcon'
import { hasCaseStudy } from '../caseStudy'

/**
 * Cover image, fading in once decoded, with the year and any "coming soon"
 * flag laid over it.
 *
 * Covers are in full colour now. They used to stay greyscale until the card
 * was hovered — which on a phone, with no hover, meant never.
 */
const CardCover = ({ src, year, isComingSoon }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="os-project-cover">
      {src ? (
        <>
          {!loaded && <div className="os-skeleton absolute inset-0" style={{ borderRadius: 0 }} />}
          <img
            src={src}
            // Decorative: the title right below names the project.
            alt=""
            className={`os-project-cover-img${loaded ? ' is-loaded' : ''}`}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
          />
        </>
      ) : (
        // No screenshot yet: a patterned tile with the Projects glyph, rather
        // than the empty beige box this used to be.
        <div className="os-project-cover-empty" aria-hidden="true">
          <AppIcon id="Projects" size={36} />
        </div>
      )}

      {year && <span className="os-project-badge os-project-year">{year}</span>}
      {isComingSoon && <span className="os-project-badge os-project-soon">Coming soon</span>}
    </div>
  )
}

/**
 * One project in the showcase grid.
 *
 * `status === false` means the project is not live yet: it keeps its title,
 * description and tags, flags itself "coming soon", and offers no links.
 *
 * The links share one compact row at the foot of the card. A case study, when
 * there is one, is a "read more" link under the description instead — as a
 * third button it wrapped onto a row of its own in every card narrower than
 * ~300px, rebuilding the stacked-button look this card was meant to lose.
 * Each link names its project, so a screen reader hears "Booking App live
 * demo" rather than a column of identical "Live demo"s.
 */
const ProjectCard = ({ project, onOpenCaseStudy }) => {
  const { title, description, cover_image: coverImage, demo_url: demoUrl, repo_url: repoUrl, tags, status, year } = project
  const isComingSoon = status === false
  const showCaseStudy = !isComingSoon && hasCaseStudy(project)
  const hasLinks = !isComingSoon && (demoUrl || repoUrl)

  return (
    <article className="os-project-card os-raised" data-coming-soon={isComingSoon || undefined}>
      <CardCover src={coverImage} year={year} isComingSoon={isComingSoon} />

      <div className="os-project-body">
        <h2 className="os-project-title">{title}</h2>
        {description && <p className="os-project-desc">{description}</p>}

        {showCaseStudy && (
          <button
            type="button"
            className="os-project-case"
            onClick={() => onOpenCaseStudy(project)}
            aria-label={`Read the ${title} case study`}
          >
            <BookOpen size={12} aria-hidden="true" />
            Read the case study
            <ArrowRight size={12} className="os-project-case-arrow" aria-hidden="true" />
          </button>
        )}

        {tags?.length > 0 && (
          <ul className="os-project-tags" aria-label="Built with">
            {tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
        )}

        {hasLinks && (
          <div className="os-project-actions">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn quick-action-primary custom-link"
                aria-label={`${title} live demo`}
              >
                <ExternalLink size={12} aria-hidden="true" />
                Live demo
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-action-btn custom-link"
                aria-label={`${title} source code`}
              >
                <Code2 size={12} aria-hidden="true" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
