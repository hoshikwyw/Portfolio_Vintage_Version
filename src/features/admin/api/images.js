import { supabase } from '@/shared/lib/supabase'
import { IMAGE_BUCKET } from '@/features/admin/constants'

/** Every uploaded image, with its parent project's title for grouping. */
export const listImages = async () => {
  const { data, error } = await supabase
    .from('project_images')
    .select('*, projects(title)')
    .order('sort_order')
  if (error) throw new Error(error.message)
  return data ?? []
}

/** Storage key for a new upload, namespaced per project and unique per file. */
const storagePath = (projectId, file, index, now) => {
  const extension = file.name.split('.').pop()
  return `${projectId}/${now}-${index}.${extension}`
}

/**
 * Recover the storage key from a public URL.
 *
 * The URL is `.../object/public/<bucket>/<key>`, so everything after the
 * bucket segment is the key. Returns null if the URL is not from this bucket.
 */
const storagePathFromUrl = (url) => {
  const [, key] = url.split(`/${IMAGE_BUCKET}/`)
  return key || null
}

/**
 * Upload one file and record it in `project_images`.
 *
 * If the row insert fails after the file landed in storage, the file is removed
 * again — otherwise every failed upload would leave an orphan that no longer
 * appears in the UI but still occupies the bucket.
 */
export const uploadProjectImage = async ({ projectId, file, index, sortOrder, isCover, showInGallery }) => {
  const path = storagePath(projectId, file, index, Date.now())

  const { error: uploadError } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

  const { data: urlData } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path)

  const { error: insertError } = await supabase.from('project_images').insert({
    project_id: projectId,
    image_url: urlData.publicUrl,
    is_cover: isCover,
    show_in_gallery: showInGallery,
    sort_order: sortOrder,
  })

  if (insertError) {
    await supabase.storage.from(IMAGE_BUCKET).remove([path])
    throw new Error(`Saving the image record failed: ${insertError.message}`)
  }
}

/** Remove the stored file and its row. */
export const deleteProjectImage = async (image) => {
  const path = storagePathFromUrl(image.image_url)
  if (path) await supabase.storage.from(IMAGE_BUCKET).remove([path])

  const { error } = await supabase.from('project_images').delete().eq('id', image.id)
  if (error) throw new Error(error.message)
}
