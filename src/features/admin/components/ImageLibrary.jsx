import { adminColors } from '@/features/admin/theme'
import { MAX_IMAGES_PER_PROJECT } from '@/features/admin/constants'
import { EmptyState, Fieldset } from './ui'

const Badge = ({ background, children }) => (
  <span className="text-[7px] text-white px-1.5 py-px font-bold uppercase flex-1 text-center" style={{ background }}>
    {children}
  </span>
)

const ImageThumb = ({ image, onDelete }) => (
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
    <div className="admin-delete-overlay absolute inset-0 flex items-center justify-center rounded-sm">
      <button
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer px-2 py-0.5 text-[9px] font-bold text-white uppercase"
        style={{ background: 'var(--os-danger)', border: '1px solid var(--os-danger)', borderRadius: 'var(--os-btn-radius)' }}
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

const ProjectImages = ({ project, images, onDelete }) => (
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
        <ImageThumb key={image.id} image={image} onDelete={() => onDelete(image)} />
      ))}
      {Array.from({ length: Math.max(0, MAX_IMAGES_PER_PROJECT - images.length) }).map((_, i) => (
        <EmptySlot key={`empty-${i}`} />
      ))}
    </div>
  </div>
)

/** All uploaded images, grouped under the project they belong to. */
const ImageLibrary = ({ projects, images, onDelete }) => {
  const withImages = projects.filter((project) => images.some((image) => image.project_id === project.id))

  return (
    <Fieldset title={`All Images (${images.length})`}>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {withImages.map((project) => (
          <ProjectImages
            key={project.id}
            project={project}
            images={images.filter((image) => image.project_id === project.id)}
            onDelete={onDelete}
          />
        ))}
        {!images.length && <EmptyState>No images yet. Select a project and upload above.</EmptyState>}
      </div>
    </Fieldset>
  )
}

export default ImageLibrary
