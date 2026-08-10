import Skeleton, { SkeletonText } from '@/shared/components/ui/Skeleton'
import { SLIDE_HEIGHT, SLIDE_WIDTH } from '../constants'

const CARD_COUNT = 3

/** One placeholder shaped like a <ProjectCard>: cover, title, body, tags, buttons. */
const CardSkeleton = () => (
  <div
    className="flex flex-col gap-2 flex-shrink-0"
    style={{
      width: SLIDE_WIDTH - 16,
      height: SLIDE_HEIGHT - 16,
      background: 'var(--os-panel-bg)',
      border: '2px solid var(--os-border-dark)',
      borderTopColor: 'var(--os-border-light)',
      borderLeftColor: 'var(--os-border-light)',
      borderRadius: 'var(--os-window-radius)',
      padding: 8,
    }}
  >
    <Skeleton h={192} radius="0" />
    <Skeleton h={14} w="70%" />
    <div className="flex-grow">
      <SkeletonText lines={3} />
    </div>
    <div className="flex gap-1">
      <Skeleton h={16} w={52} />
      <Skeleton h={16} w={44} />
      <Skeleton h={16} w={60} />
    </div>
    <div className="flex gap-2">
      <Skeleton h={30} />
      <Skeleton h={30} />
    </div>
  </div>
)

/** Carousel-shaped loading state for the Projects window. */
const ProjectsSkeleton = () => (
  <div
    className="w-full h-full flex items-center gap-3 px-3 overflow-hidden"
    role="status"
    aria-busy="true"
    aria-label="Loading projects"
  >
    {Array.from({ length: CARD_COUNT }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export default ProjectsSkeleton
