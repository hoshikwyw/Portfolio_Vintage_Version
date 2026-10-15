import Skeleton, { SkeletonText } from '@/shared/components/ui/Skeleton'

const CARD_COUNT = 6

/** One placeholder shaped like a <ProjectCard>: cover, title, body, tags, actions. */
const CardSkeleton = () => (
  <li>
    <div className="os-project-card os-raised">
      <div className="os-project-cover">
        <Skeleton h="100%" radius="0" />
      </div>
      <div className="os-project-body">
        <Skeleton h={13} w="60%" />
        <SkeletonText lines={3} />
        <div className="flex gap-1">
          <Skeleton h={16} w={52} />
          <Skeleton h={16} w={44} />
          <Skeleton h={16} w={60} />
        </div>
        <div className="flex gap-2 mt-auto">
          <Skeleton h={28} />
          <Skeleton h={28} />
        </div>
      </div>
    </div>
  </li>
)

/** Grid-shaped loading state for the Projects window, using the real layout classes. */
const ProjectsSkeleton = () => (
  <div className="os-projects-scroll" role="status" aria-busy="true" aria-label="Loading projects">
    <ul className="os-projects-grid" aria-hidden="true">
      {Array.from({ length: CARD_COUNT }, (_, i) => <CardSkeleton key={i} />)}
    </ul>
  </div>
)

export default ProjectsSkeleton
