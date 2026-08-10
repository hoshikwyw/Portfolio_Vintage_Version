import { useState } from 'react'
import { FONT_STACK } from '@/shared/constants/fonts'

const linkStyle = {
  background: 'var(--os-btn-bg)',
  color: 'var(--os-text)',
  border: '2px solid var(--os-border-dark)',
  borderTopColor: 'var(--os-border-light)',
  borderLeftColor: 'var(--os-border-light)',
  borderRadius: 'var(--os-btn-radius)',
}

const CardLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="no-underline text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 text-center flex-1 cursor-pointer hover:brightness-110"
    style={linkStyle}
  >
    {children}
  </a>
)

/** Cover image with a skeleton that fades out once the image decodes. */
const CardCover = ({ src, alt, isComingSoon }) => {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="h-48 overflow-hidden relative" style={{ border: 'var(--os-input-border)', background: 'var(--os-window)' }}>
      {!loaded && <div className="os-skeleton absolute inset-0" style={{ borderRadius: 0 }} />}
      {src && (
        <img
          src={src}
          alt={alt}
          className="os-card-media w-full h-full object-cover relative z-10"
          onLoad={() => setLoaded(true)}
        />
      )}
      {isComingSoon && (
        <div className="absolute inset-0 bg-[#2b2b3d]/80 flex items-center justify-center z-20">
          <span className="text-[#e0d8c8] text-sm font-bold uppercase tracking-wider">Coming Soon</span>
        </div>
      )}
    </div>
  )
}

/**
 * A single project in the carousel.
 *
 * `status === false` means the project is not live yet: the card dims, drops
 * its links and shows a "Coming Soon" overlay instead.
 */
const ProjectCard = ({ project }) => {
  const { title, description, cover_image: coverImage, demo_url: demoUrl, repo_url: repoUrl, tags, status } = project
  const isComingSoon = status === false

  return (
    <div
      className={`os-card-lift h-full w-full flex flex-col overflow-hidden ${isComingSoon ? 'opacity-60 pointer-events-none' : ''}`}
      style={{
        background: 'var(--os-panel-bg)',
        border: '2px solid var(--os-border-dark)',
        borderTopColor: 'var(--os-border-light)',
        borderLeftColor: 'var(--os-border-light)',
        borderRadius: 'var(--os-window-radius)',
        fontFamily: FONT_STACK,
        padding: '8px',
        backdropFilter: 'var(--os-glass-blur)',
        WebkitBackdropFilter: 'var(--os-glass-blur)',
      }}
    >
      <CardCover src={coverImage} alt={title} isComingSoon={isComingSoon} />

      <div className="flex-grow flex flex-col gap-2 pt-2">
        {isComingSoon ? (
          <div className="flex justify-center items-center w-full h-full mt-auto gap-2">
            <span className="text-[#5a5a7a] font-bold text-xs uppercase">Coming Soon</span>
            <span className="text-[#2b2b3d] font-bold text-xs uppercase">{title}</span>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: 'var(--os-text)' }}>{title}</h3>
            <p className="text-[11px] flex-grow leading-relaxed" style={{ color: 'var(--os-text-secondary)' }}>{description}</p>

            <div className="flex flex-wrap gap-1 mb-2">
              {tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-bold uppercase tracking-wide px-2 py-0.5"
                  style={{ border: '1px solid var(--os-border-dark)', background: 'var(--os-window)', color: 'var(--os-text)', borderRadius: 'var(--os-btn-radius)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between mt-auto gap-2">
              <CardLink href={demoUrl}>Live Demo</CardLink>
              <CardLink href={repoUrl}>View Code</CardLink>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectCard
