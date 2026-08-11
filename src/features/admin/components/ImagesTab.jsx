import { useState } from 'react'
import { adminColors } from '@/features/admin/theme'
import { MAX_IMAGES_PER_PROJECT } from '@/features/admin/constants'
import { useDeleteImage, useUploadImages } from '@/features/admin/hooks/useAdminData'
import { Button, Checkbox, Field, Fieldset } from './ui'
import ImageDropzone from './ImageDropzone'
import ImageLibrary from './ImageLibrary'

/** Visual "N of 3 slots used" meter for the selected project. */
const CapacityBar = ({ used }) => {
  const remaining = MAX_IMAGES_PER_PROJECT - used
  const fillColor =
    used >= MAX_IMAGES_PER_PROJECT ? adminColors.danger
      : used >= MAX_IMAGES_PER_PROJECT - 1 ? adminColors.warning
        : adminColors.accent

  return (
    <div className="px-2 py-2" style={{ background: adminColors.window, border: `1px solid ${adminColors.borderField}`, borderRadius: '2px' }}>
      <div className="flex justify-between mb-1">
        <span className="text-[9px] font-bold uppercase" style={{ color: adminColors.label }}>Capacity</span>
        <span className="text-[9px] font-bold" style={{ color: adminColors.text }}>{used}/{MAX_IMAGES_PER_PROJECT}</span>
      </div>
      <div className="w-full h-2 overflow-hidden" style={{ background: 'var(--os-skeleton-bg)', border: `1px solid ${adminColors.borderField}` }}>
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${(used / MAX_IMAGES_PER_PROJECT) * 100}%`, background: fillColor }}
        />
      </div>
      <p className="text-[9px] mt-1" style={{ color: adminColors.textMuted }}>
        {remaining > 0
          ? `${remaining} slot${remaining > 1 ? 's' : ''} available`
          : 'Full — delete an image to upload more'}
      </p>
    </div>
  )
}

/** Upload form plus the grouped library of everything already uploaded. */
const ImagesTab = ({ projects, images, flash, flashError }) => {
  const [projectId, setProjectId] = useState('')
  const [files, setFiles] = useState([])
  const [isCover, setIsCover] = useState(false)
  const [showInGallery, setShowInGallery] = useState(true)

  const uploadImages = useUploadImages()
  const deleteImage = useDeleteImage()

  const countFor = (id) => images.filter((image) => image.project_id === Number(id)).length
  const selectedCount = projectId ? countFor(projectId) : 0
  const remaining = MAX_IMAGES_PER_PROJECT - selectedCount

  const resetForm = () => {
    setProjectId('')
    setFiles([])
    setIsCover(false)
    setShowInGallery(true)
  }

  const handleUpload = async (e) => {
    e.preventDefault()

    if (!projectId || !files.length) {
      flash('Select a project and at least one file.', 'error')
      return
    }
    if (remaining <= 0) {
      flash(`This project already has ${MAX_IMAGES_PER_PROJECT} images (max).`, 'error')
      return
    }
    if (files.length > remaining) {
      flash(`Can only add ${remaining} more image(s) to this project.`, 'error')
      return
    }

    try {
      const uploaded = await uploadImages.mutateAsync({
        projectId: Number(projectId),
        files,
        existingCount: selectedCount,
        isCover,
        showInGallery,
      })
      flash(`${uploaded} image(s) uploaded!`)
      resetForm()
    } catch (error) {
      flashError(error)
    }
  }

  const handleDelete = async (image) => {
    if (!confirm('Delete this image?')) return
    try {
      await deleteImage.mutateAsync(image)
      flash('Image deleted.')
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <div className="space-y-3">
      <Fieldset title="Upload Images">
        <form onSubmit={handleUpload} className="space-y-3">
          <Field
            label="Project *"
            as="select"
            required
            value={projectId}
            onChange={(e) => { setProjectId(e.target.value); setFiles([]) }}
          >
            <option value="">Select project...</option>
            {projects.map((project) => {
              const count = countFor(project.id)
              return (
                <option key={project.id} value={project.id} disabled={count >= MAX_IMAGES_PER_PROJECT}>
                  {project.title} ({count}/{MAX_IMAGES_PER_PROJECT})
                </option>
              )
            })}
          </Field>

          {projectId && <CapacityBar used={selectedCount} />}

          <ImageDropzone files={files} onChange={setFiles} />

          <div className="flex items-center gap-4 px-1">
            <Checkbox
              label="Set first as cover"
              checked={isCover}
              onChange={(e) => setIsCover(e.target.checked)}
            />
            <Checkbox
              label="Show in gallery"
              accent={adminColors.success}
              checked={showInGallery}
              onChange={(e) => setShowInGallery(e.target.checked)}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={uploadImages.isPending || !files.length}
            className="w-full py-1.5 text-[10px] tracking-wider"
          >
            {uploadImages.isPending ? 'Uploading...' : `Upload${files.length ? ` (${files.length})` : ''}`}
          </Button>
        </form>
      </Fieldset>

      <ImageLibrary projects={projects} images={images} onDelete={handleDelete} />
    </div>
  )
}

export default ImagesTab
