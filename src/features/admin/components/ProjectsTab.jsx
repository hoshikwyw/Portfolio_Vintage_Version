import { useState } from 'react'
import { adminColors, adminStyles } from '@/features/admin/theme'
import { EMPTY_PROJECT } from '@/features/admin/constants'
import { getProjectTagIds } from '@/features/admin/api/projects'
import { useDeleteProject, useSaveProject } from '@/features/admin/hooks/useAdminData'
import { Button, EmptyState, Fieldset } from './ui'
import ProjectForm from './ProjectForm'

const ProjectRow = ({ project, onEdit, onDelete }) => (
  <div className="flex items-center justify-between py-1 px-2 text-[11px]" style={adminStyles.row}>
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: project.status ? adminColors.success : adminColors.borderDark }}
        title={project.status ? 'Live' : 'Coming soon'}
      />
      <span className="font-semibold truncate" style={{ color: adminColors.text }}>{project.title}</span>
      <span className="text-[9px]" style={{ color: adminColors.textFaint }}>#{project.sort_order}</span>
    </div>
    <div className="flex gap-1 flex-shrink-0">
      <Button onClick={onEdit} className="px-2 py-0.5 text-[9px]">Edit</Button>
      <Button variant="danger" onClick={onDelete} className="px-2 py-0.5 text-[9px]">Del</Button>
    </div>
  </div>
)

/** Project CRUD: the editor form above, the full list below. */
const ProjectsTab = ({ projects, tags, flash, flashError }) => {
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(EMPTY_PROJECT)
  const [selectedTagIds, setSelectedTagIds] = useState([])

  const saveProject = useSaveProject()
  const deleteProject = useDeleteProject()

  const resetForm = () => {
    setEditId(null)
    setValues(EMPTY_PROJECT)
    setSelectedTagIds([])
  }

  const startEditing = async (project) => {
    setEditId(project.id)
    setValues({
      title: project.title,
      description: project.description || '',
      demo_url: project.demo_url || '',
      repo_url: project.repo_url || '',
      status: project.status,
      sort_order: project.sort_order,
    })

    try {
      setSelectedTagIds(await getProjectTagIds(project.id))
    } catch (error) {
      flashError(error)
    }
  }

  const toggleTag = (tagId) => {
    setSelectedTagIds((current) =>
      current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId],
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await saveProject.mutateAsync({ id: editId, fields: values, tagIds: selectedTagIds })
      flash(editId ? 'Project updated!' : 'Project created!')
      resetForm()
    } catch (error) {
      flashError(error)
    }
  }

  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.title}" and all its images?`)) return
    try {
      await deleteProject.mutateAsync(project.id)
      flash('Project deleted.')
      if (editId === project.id) resetForm()
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <div className="space-y-3">
      <ProjectForm
        editId={editId}
        values={values}
        onChange={setValues}
        tags={tags}
        selectedTagIds={selectedTagIds}
        onToggleTag={toggleTag}
        onSubmit={handleSubmit}
        onCancel={resetForm}
        isSaving={saveProject.isPending}
      />

      <Fieldset title={`All Projects (${projects.length})`}>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {projects.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              onEdit={() => startEditing(project)}
              onDelete={() => handleDelete(project)}
            />
          ))}
          {!projects.length && <EmptyState>No projects yet.</EmptyState>}
        </div>
      </Fieldset>
    </div>
  )
}

export default ProjectsTab
