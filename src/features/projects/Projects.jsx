import { useState } from 'react'
import StatusMessage from '@/shared/components/feedback/StatusMessage'
import { useProjects } from './hooks/useProjects'
import ProjectCard from './components/ProjectCard'
import ProjectsSkeleton from './components/ProjectsSkeleton'
import CaseStudyPanel from './components/CaseStudyPanel'
import './projects.css'

/**
 * The project showcase: a responsive grid of cards that fills the window.
 *
 * This was an autoplaying Swiper carousel of fixed 420px slides. Inside a
 * resizable window that meant one row pinned to the top of a fullscreen
 * window, the last card always cut off at the edge, nav arrows sitting on top
 * of the cards, and content that moved by itself. A grid uses whatever space
 * the window has, shows everything at a glance, and scrolls like the rest of
 * the OS.
 *
 * The case study opens over the grid. The grid scrolls in its own box so the
 * overlay can cover the window's visible area wherever the grid is scrolled
 * to, and it goes `inert` underneath so Tab cannot wander behind the panel.
 */
const Projects = () => {
  const { data: projects, isLoading, isError } = useProjects()
  const [caseStudy, setCaseStudy] = useState(null)

  if (isLoading) return <ProjectsSkeleton />
  if (isError) return <StatusMessage tone="error">Error loading projects</StatusMessage>
  if (!projects?.length) return <StatusMessage>No projects yet</StatusMessage>

  return (
    <div className="os-projects">
      <div className="os-projects-scroll" inert={caseStudy ? true : undefined}>
        {/* Already sorted by sort_order from the query. */}
        <ul className="os-projects-grid" aria-label="Projects">
          {projects.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} onOpenCaseStudy={setCaseStudy} />
            </li>
          ))}
        </ul>
      </div>

      {caseStudy && <CaseStudyPanel project={caseStudy} onClose={() => setCaseStudy(null)} />}
    </div>
  )
}

export default Projects
