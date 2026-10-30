import { useState } from 'react'
import { ArrowRight, Code2, ExternalLink, FolderOpen, Github } from 'lucide-react'
import { useProjects } from '@/features/projects/hooks/useProjects'
import { hasCaseStudy } from '@/features/projects/caseStudy'
import { profile } from '@/shared/config/profile'
import SectionHeading from '../components/SectionHeading'
import CaseStudyDialog from '../components/CaseStudyDialog'

/** One project. Links name their project, so a screen reader can tell them apart. */
const ProjectCard = ({ project, onOpenCaseStudy }) => {
  const { title, description, cover_image: cover, demo_url: demo, repo_url: repo, tags, status, year } = project
  const isComingSoon = status === false
  const showCaseStudy = !isComingSoon && hasCaseStudy(project)

  return (
    <li className={`op-card op-project${isComingSoon ? ' is-soon' : ''}`}>
      <div className="op-project-cover">
        {cover ? (
          <img src={cover} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="op-project-cover-empty" aria-hidden="true"><FolderOpen size={32} /></span>
        )}
        {year && <span className="op-project-badge op-project-year">{year}</span>}
        {isComingSoon && <span className="op-project-badge op-project-soon">Coming soon</span>}
      </div>

      <div className="op-project-body">
        <h3 className="op-project-title">{title}</h3>
        {description && <p className="op-project-desc">{description}</p>}

        {showCaseStudy && (
          <button
            type="button"
            className="op-link-btn"
            onClick={() => onOpenCaseStudy(project)}
            aria-label={`Read the ${title} case study`}
          >
            Read the case study
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        )}

        {tags?.length > 0 && (
          <ul className="op-chips op-project-tags" aria-label="Built with">
            {tags.map((tag) => <li key={tag} className="op-chip">{tag}</li>)}
          </ul>
        )}

        {!isComingSoon && (demo || repo) && (
          <div className="op-project-links">
            {demo && (
              <a href={demo} target="_blank" rel="noopener noreferrer" className="op-btn op-btn-primary" aria-label={`${title} live demo`}>
                <ExternalLink size={15} aria-hidden="true" />
                Live demo
              </a>
            )}
            {repo && (
              <a href={repo} target="_blank" rel="noopener noreferrer" className="op-btn" aria-label={`${title} source code`}>
                <Code2 size={15} aria-hidden="true" />
                Code
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  )
}

/** Placeholders shaped like cards while the projects load. */
const ProjectSkeletons = () => (
  <ul className="op-projects" aria-hidden="true">
    {Array.from({ length: 3 }, (_, i) => (
      <li key={i} className="op-card op-project op-project-skeleton">
        <div className="op-project-cover op-shimmer" />
        <div className="op-project-body">
          <span className="op-shimmer op-skel-line op-skel-title" />
          <span className="op-shimmer op-skel-line" />
          <span className="op-shimmer op-skel-line op-skel-short" />
        </div>
      </li>
    ))}
  </ul>
)

/**
 * The projects, from the same Supabase query (and cache) as the desktop's
 * Projects window. Case studies open in a modal dialog over the page.
 */
const ProjectsSection = ({ id }) => {
  const { data: projects, isLoading, isError } = useProjects()
  const [caseStudy, setCaseStudy] = useState(null)

  return (
    <section id={id} className="op-section" aria-labelledby={`${id}-title`}>
      <div className="op-container">
        <SectionHeading
          id={`${id}-title`}
          index="03"
          label="Projects"
          title="Things I've built"
          intro="A selection of recent work — open a case study for the story behind it."
        />

        {isLoading && (
          <div role="status" aria-label="Loading projects">
            <ProjectSkeletons />
          </div>
        )}

        {(isError || (!isLoading && !projects?.length)) && (
          <div className="op-card op-notice">
            <p>
              {isError ? 'The projects could not be loaded right now.' : 'Projects are on their way.'}
              {' '}In the meantime, my code is on GitHub.
            </p>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="op-btn">
              <Github size={15} aria-hidden="true" />
              View GitHub
            </a>
          </div>
        )}

        {projects?.length > 0 && (
          <ul className="op-projects">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpenCaseStudy={setCaseStudy} />
            ))}
          </ul>
        )}
      </div>

      {caseStudy && <CaseStudyDialog project={caseStudy} onClose={() => setCaseStudy(null)} />}
    </section>
  )
}

export default ProjectsSection
