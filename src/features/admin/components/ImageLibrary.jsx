import { adminColors } from '@/features/admin/theme'
import { MAX_IMAGES_PER_PROJECT } from '@/features/admin/constants'
import { EmptyState, Fieldset } from './ui'

const Badge = ({ background, children }) => (
  <span className="text-[7px] text-white px-1.5 py-px font-bold uppercase flex-1 text-center" style={{ background }}>
    {children}
  </span>
)

/**
 * One uploaded image, with its actions revealed on hover — and on keyboard
 * focus, which the hover-only reveal used to miss, leaving tabbed-to buttons
 * invisible.
 */
const ImageThumb = ({ image, projectTitle, onDelete, onSetCover }) => (
  <div className="relative group flex-shrink-0" style={{ width: 90, height: 68 }}>
    <img
      src={image.image_url}
      alt=""
      className="w-full h-full object-cover"
      style={{
        border: `2px solid ${adminColors.borderField}`,
        borderTopColor: adminColors.borderLight,
        borderLeftColor: adminColors.borderLight,
        borderRadius: 'var(--os-btn-radius)',
      }}
    />
    <div className="absolute bottom-0 left-0 right-0 flex gap-px">
      {image.is_cover && <Badge background={adminColors.accent}>Cover</Badge>}
      {image.show_in_gallery && <Badge background={adminColors.success}>Gallery</Badge>}
    </div>
    <div className="admin-thumb-overlay absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-sm">
      {!image.is_cover && (
        <button
          type="button"
          onClick={onSetCover}
          className="admin-thumb-action"
          style={{ background: 'var(--os-accent)', borderColor: 'var(--os-accent)' }}
          aria-label={`Make this the cover for ${projectTitle}`}
        >
          Set cover
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        className="admin-thumb-action"
        style={{ background: 'var(--os-danger)', borderColor: 'var(--os-danger)' }}
        aria-label={`Delete this image from ${projectTitle}`}
      >
        Delete
      </button>
    </div>
  </div>
)

const EmptySlot = () => (
  <div
    className="flex-shrink-0 flex items-center justify-center"
    style={{ width: 90, height: 68, border: `2px dashed ${adminColors.borderField}`, borderRadius: 'var(--os-btn-radius)', background: 'var(--os-skeleton-bg)' }}
  >
    <span className="text-[18px]" style={{ color: adminColors.borderField }}>+</span>
  </div>
)

const ProjectImages = ({ project, images, onDelete, onSetCover }) => (
  <div className="px-2 py-2" style={{ background: adminColors.window, border: `1px solid ${adminColors.borderField}`, borderRadius: 'var(--os-btn-radius)' }}>
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: adminColors.text }}>
        {project.title}
      </span>
      <span className="text-[9px] font-semibold" style={{ color: adminColors.textMuted }}>
        {images.length}/{MAX_IMAGES_PER_PROJECT}
      </span>
    </div>
    <div className="flex gap-2">
      {images.map((image) => (
        <ImageThumb
          key={image.id}
          image={image}
          projectTitle={project.title}
          onDelete={() => onDelete(image)}
          onSetCover={() => onSetCover(image)}
        />
      ))}
      {Array.from({ length: Math.max(0, MAX_IMAGES_PER_PROJECT - images.length) }).map((_, i) => (
        <EmptySlot key={`empty-${i}`} />
      ))}
    </div>
  </div>
)

/** All uploaded images, grouped under the project they belong to. */
const ImageLibrary = ({ projects, images, onDelete, onSetCover }) => {
  const withImages = projects.filter((project) => images.some((image) => image.project_id === project.id))

  return (
    <Fieldset title={`All Images (${images.length})`}>
      <div className="space-y-3">
        {withImages.map((project) => (
          <ProjectImages
            key={project.id}
            project={project}
            images={images.filter((image) => image.project_id === project.id)}
            onDelete={onDelete}
            onSetCover={onSetCover}
          />
        ))}
        {!images.length && <EmptyState>No images yet. Select a project and upload above.</EmptyState>}
      </div>
    </Fieldset>
  )
}

export default ImageLibrary
