import { useRef, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { EMPTY_PROJECT } from '@/features/admin/constants'
import { getProjectTagIds } from '@/features/admin/api/projects'
import { useDeleteProject, useSaveProject } from '@/features/admin/hooks/useAdminData'
import { Button, EmptyState } from './ui'
import ProjectForm from './ProjectForm'

/**
 * One project in the list. The whole row selects it for editing; delete is a
 * separate small button so it cannot be hit by accident while selecting.
 */
const ProjectRow = ({ project, isSelected, onEdit, onDelete }) => (
  <li className={`admin-row${isSelected ? ' is-selected' : ''}`}>
    <button
      type="button"
      className="admin-row-main"
      onClick={onEdit}
      aria-current={isSelected || undefined}
    >
      <span
        className={`admin-status-dot${project.status ? ' is-live' : ''}`}
        aria-hidden="true"
      />
      <span className="min-w-0">
        <span className="admin-row-title">{project.title}</span>
        <span className="admin-row-meta">
          #{project.sort_order}
          {project.year ? ` · ${project.year}` : ''}
          {' · '}
          {project.status ? 'Live' : 'Coming soon'}
        </span>
      </span>
    </button>
    <button
      type="button"
      className="admin-row-delete"
      onClick={onDelete}
      aria-label={`Delete ${project.title}`}
      title="Delete"
    >
      <Trash2 size={13} aria-hidden="true" />
    </button>
  </li>
)

/**
 * Project CRUD as a list and an editor side by side.
 *
 * The editor used to sit above the list, so the projects themselves were
 * below the fold, and choosing one to edit meant scrolling back up to a form
 * that had changed out of sight. Now the list is always in view on a wide
 * window, the row being edited is highlighted, and on a narrow one (where the
 * two stack) picking a project scrolls the editor into view.
 */
const ProjectsTab = ({ projects, tags, flash, flashError }) => {
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(EMPTY_PROJECT)
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const editorRef = useRef(null)

  const saveProject = useSaveProject()
  const deleteProject = useDeleteProject()

  const showEditor = () => editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

  const resetForm = () => {
    setEditId(null)
    setValues(EMPTY_PROJECT)
    setSelectedTagIds([])
  }

  const startNew = () => {
    resetForm()
    showEditor()
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
      year: project.year ?? '',
      role: project.role || '',
      problem: project.problem || '',
      outcome: project.outcome || '',
    })
    showEditor()

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
    <div className="admin-split">
      <section className="admin-pane" aria-labelledby="admin-projects-heading">
        <div className="admin-pane-head">
          <h2 id="admin-projects-heading" className="admin-pane-title">All projects</h2>
          <Button variant="primary" onClick={startNew} className="flex items-center gap-1 px-2.5 py-1 text-[10px]">
            <Plus size={12} aria-hidden="true" />
            New
          </Button>
        </div>

        {projects.length ? (
          <ul className="admin-list">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isSelected={editId === project.id}
                onEdit={() => startEditing(project)}
                onDelete={() => handleDelete(project)}
              />
            ))}
          </ul>
        ) : (
          <EmptyState>No projects yet — start with New.</EmptyState>
        )}
      </section>

      <div ref={editorRef} className="admin-editor">
        <ProjectForm
          editId={editId}
          editingTitle={projects.find((project) => project.id === editId)?.title}
          values={values}
          onChange={setValues}
          tags={tags}
          selectedTagIds={selectedTagIds}
          onToggleTag={toggleTag}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isSaving={saveProject.isPending}
        />
      </div>
    </div>
  )
}

export default ProjectsTab
