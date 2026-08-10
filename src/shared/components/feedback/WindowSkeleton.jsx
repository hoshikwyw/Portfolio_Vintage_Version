import Skeleton, { SkeletonText } from '@/shared/components/ui/Skeleton'

/**
 * Generic "this window is still loading" placeholder.
 *
 * Used as the Suspense fallback while a lazily-imported window downloads, and
 * by windows whose own shape is not worth mimicking. The wrapper carries the
 * live region so screen readers hear one "Loading" rather than nothing.
 */
const WindowSkeleton = ({ label = 'Loading' }) => (
  <div className="w-full h-full p-4 flex flex-col gap-4" role="status" aria-busy="true" aria-label={label}>
    <div className="flex items-center gap-3">
      <Skeleton w={40} h={40} radius="var(--os-window-radius)" />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton h={12} w="45%" />
        <Skeleton h={9} w="25%" />
      </div>
    </div>

    <Skeleton h={120} radius="var(--os-btn-radius)" />

    <SkeletonText lines={4} />

    <div className="flex gap-2">
      <Skeleton h={26} w={96} />
      <Skeleton h={26} w={96} />
    </div>
  </div>
)

export default WindowSkeleton
