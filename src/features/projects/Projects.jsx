import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import StatusMessage from '@/shared/components/feedback/StatusMessage'
import { useProjects } from './hooks/useProjects'
import ProjectCard from './components/ProjectCard'
import ProjectsSkeleton from './components/ProjectsSkeleton'
import { AUTOPLAY_DELAY, SLIDE_HEIGHT, SLIDE_WIDTH } from './constants'

const slideStyle = { width: `${SLIDE_WIDTH}px`, height: `${SLIDE_HEIGHT}px`, padding: '8px' }

// Position and centring come from the stylesheet so the hover/press rules can
// build on the transform instead of losing to an inline one.
const NavButton = ({ side, innerRef, children }) => (
  <button
    ref={innerRef}
    className={`custom-nav-button custom-nav-${side}`}
    aria-label={side === 'prev' ? 'Previous project' : 'Next project'}
  >
    {children}
  </button>
)

/** Horizontally scrolling carousel of portfolio projects. */
const Projects = () => {
  const { data: projects, isLoading, isError } = useProjects()
  const prevRef = useRef(null)
  const nextRef = useRef(null)

  if (isLoading) return <ProjectsSkeleton />
  if (isError) return <StatusMessage tone="error">Error loading projects</StatusMessage>
  if (!projects?.length) return <StatusMessage>No projects yet</StatusMessage>

  return (
    <div className="w-full h-full flex flex-col items-center project-container relative" style={{ maxWidth: '100vw' }}>
      <Swiper
        modules={[Navigation, Autoplay]}
        slidesPerView="auto"
        spaceBetween={12}
        centeredSlides={false}
        speed={800}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: true }}
        // The nav elements only exist after first paint, so bind them here.
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current
          swiper.params.navigation.nextEl = nextRef.current
        }}
        style={{ width: '100%', height: '100%', margin: '12px' }}
      >
        {/* Already sorted by sort_order from the query. */}
        {projects.map((project) => (
          <SwiperSlide key={project.id} style={{ ...slideStyle, transition: 'transform 0.8s ease' }}>
            <div className="w-full h-full">
              <ProjectCard project={project} />
            </div>
          </SwiperSlide>
        ))}
        {/* Trailing spacer so the last card can scroll clear of the edge. */}
        <SwiperSlide style={slideStyle} />
      </Swiper>

      <NavButton side="prev" innerRef={prevRef}><ChevronLeft size={16} /></NavButton>
      <NavButton side="next" innerRef={nextRef}><ChevronRight size={16} /></NavButton>
    </div>
  )
}

export default Projects
