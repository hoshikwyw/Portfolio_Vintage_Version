import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PROJECTS_QUERY_KEY } from '@/features/projects/hooks/useProjects'
import { PROJECT_IMAGES_QUERY_KEY } from '@/features/gallery/hooks/useProjectImages'
import * as projectsApi from '@/features/admin/api/projects'
import * as tagsApi from '@/features/admin/api/tags'
import * as imagesApi from '@/features/admin/api/images'

/**
 * Admin reads the raw tables, while the public windows read curated views, so
 * the two use separate cache entries.
 */
export const ADMIN_KEYS = {
  projects: ['admin', 'projects'],
  tags: ['admin', 'tags'],
  images: ['admin', 'images'],
  projectTags: (projectId) => ['admin', 'project-tags', projectId],
}

export const useAdminProjects = () =>
  useQuery({ queryKey: ADMIN_KEYS.projects, queryFn: projectsApi.listProjects })

export const useAdminTags = () =>
  useQuery({ queryKey: ADMIN_KEYS.tags, queryFn: tagsApi.listTags })

export const useAdminImages = () =>
  useQuery({ queryKey: ADMIN_KEYS.images, queryFn: imagesApi.listImages })

/**
 * Invalidate the admin caches an edit touched *and* the public ones, so the
 * Projects and Gallery windows reflect the change immediately instead of
 * serving their five-minute-stale copy.
 */
const useInvalidateAfterEdit = () => {
  const queryClient = useQueryClient()

  return (keys) => {
    const affected = [...keys, PROJECTS_QUERY_KEY, PROJECT_IMAGES_QUERY_KEY]
    return Promise.all(affected.map((queryKey) => queryClient.invalidateQueries({ queryKey })))
  }
}

/** Create or update a project together with its tag assignments. */
export const useSaveProject = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: async ({ id, fields, tagIds }) => {
      const project = id
        ? await projectsApi.updateProject(id, fields)
        : await projectsApi.createProject(fields)

      await projectsApi.setProjectTags(project.id, tagIds)
      return project
    },
    onSuccess: () => invalidate([ADMIN_KEYS.projects, ADMIN_KEYS.tags]),
  })
}

export const useDeleteProject = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: projectsApi.deleteProject,
    // Deleting a project cascades to its images, so refresh those too.
    onSuccess: () => invalidate([ADMIN_KEYS.projects, ADMIN_KEYS.images]),
  })
}

export const useCreateTag = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: tagsApi.createTag,
    onSuccess: () => invalidate([ADMIN_KEYS.tags]),
  })
}

export const useDeleteTag = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: tagsApi.deleteTag,
    onSuccess: () => invalidate([ADMIN_KEYS.tags, ADMIN_KEYS.projects]),
  })
}

/** Upload a batch of files to one project, one after another. */
export const useUploadImages = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: async ({ projectId, files, existingCount, isCover, showInGallery }) => {
      for (const [index, file] of files.entries()) {
        await imagesApi.uploadProjectImage({
          projectId,
          file,
          index,
          sortOrder: existingCount + index,
          // Only the first file of a batch can become the cover.
          isCover: isCover && index === 0,
          showInGallery,
        })
      }
      return files.length
    },
    onSuccess: () => invalidate([ADMIN_KEYS.images]),
  })
}

export const useDeleteImage = () => {
  const invalidate = useInvalidateAfterEdit()

  return useMutation({
    mutationFn: imagesApi.deleteProjectImage,
    onSuccess: () => invalidate([ADMIN_KEYS.images]),
  })
}
