import { useRef, useState } from 'react'
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react'
import { EMPTY_PROJECT } from '@/features/admin/constants'
import { hasCaseStudy } from '@/features/projects/caseStudy'
import { getProjectTagIds } from '@/features/admin/api/projects'
import { useDeleteProject, useReorderProjects, useSaveProject } from '@/features/admin/hooks/useAdminData'
import { Button, EmptyState } from './ui'
import ProjectForm from './ProjectForm'

/**
 * One project in the list. The whole row selects it for editing; delete is a
 * separate small button so it cannot be hit by accident while selecting.
 *
 * Rows drag to reorder (by the grip, or anywhere on the row), and the ▲/▼
 * buttons do the same from the keyboard — drag alone would leave keyboard and
 * screen-reader users no way to change the order.
 */
const ProjectRow = ({
  project, isSelected, isFirst, isLast, dragState,
  onEdit, onDelete, onMove, dragHandlers,
}) => (
  <li
    className={`admin-row${isSelected ? ' is-selected' : ''}${dragState ? ` is-${dragState}` : ''}`}
    draggable
    {...dragHandlers}
  >
    <span className="admin-row-grip" aria-hidden="true"><GripVertical size={13} /></span>
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
    <span className="admin-row-move">
      <button
        type="button"
        onClick={() => onMove(-1)}
        disabled={isFirst}
        aria-label={`Move ${project.title} up`}
      >
        <ChevronUp size={12} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => onMove(1)}
        disabled={isLast}
        aria-label={`Move ${project.title} down`}
      >
        <ChevronDown size={12} aria-hidden="true" />
      </button>
    </span>
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
const ProjectsTab = ({ projects, tags, images, flash, flashError, onPreview }) => {
  const [editId, setEditId] = useState(null)
  const [values, setValues] = useState(EMPTY_PROJECT)
  const [selectedTagIds, setSelectedTagIds] = useState([])
  const editorRef = useRef(null)

  const saveProject = useSaveProject()
  const deleteProject = useDeleteProject()
  const reorderProjects = useReorderProjects()

  // The order being saved, shown at once so the list does not jump back while
  // the request is in flight; null once the refetched data has caught up.
  const [pendingOrder, setPendingOrder] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const listed = pendingOrder ?? projects

  /** Persist `list` as the display order: position n becomes sort_order n. */
  const saveOrder = async (list) => {
    const changes = list
      .map((project, index) => ({ id: project.id, sort_order: index + 1 }))
      .filter((change, index) => list[index].sort_order !== change.sort_order)
    if (!changes.length) return

    setPendingOrder(list)
    try {
      await reorderProjects.mutateAsync(changes)
      // Keep the open form in step if its project moved.
      const moved = changes.find((change) => change.id === editId)
      if (moved) setValues((current) => ({ ...current, sort_order: moved.sort_order }))
      flash('Order saved.')
    } catch (error) {
      flashError(error)
    } finally {
      setPendingOrder(null)
    }
  }

  const move = (from, to) => {
    if (to < 0 || to >= listed.length || from === to) return
    const list = [...listed]
    const [item] = list.splice(from, 1)
    list.splice(to, 0, item)
    saveOrder(list)
  }

  const dragHandlersFor = (index) => ({
    onDragStart: (event) => {
      event.dataTransfer.effectAllowed = 'move'
      setDragging(index)
    },
    onDragOver: (event) => {
      event.preventDefault()
      if (dropTarget !== index) setDropTarget(index)
    },
    onDrop: (event) => {
      event.preventDefault()
      if (dragging !== null) move(dragging, index)
      setDragging(null)
      setDropTarget(null)
    },
    onDragEnd: () => {
      setDragging(null)
      setDropTarget(null)
    },
  })

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

  /** The form as the public case study will read it — unsaved edits included. */
  const previewProject = () => ({
    ...values,
    id: editId ?? 'preview',
    year: values.year === '' ? null : values.year,
    tags: tags.filter((tag) => selectedTagIds.includes(tag.id)).map((tag) => tag.name),
    cover_image: images.find((image) => image.project_id === editId && image.is_cover)?.image_url ?? null,
  })

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
          <span className="admin-pane-hint">Drag to reorder</span>
          <Button variant="primary" onClick={startNew} className="flex items-center gap-1 px-2.5 py-1 text-[10px]">
            <Plus size={12} aria-hidden="true" />
            New
          </Button>
        </div>

        {projects.length ? (
          <ul className="admin-list" aria-busy={reorderProjects.isPending || undefined}>
            {listed.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                isSelected={editId === project.id}
                isFirst={index === 0}
                isLast={index === listed.length - 1}
                dragState={dragging === index ? 'dragging' : dropTarget === index && dragging !== null ? 'drop-target' : null}
                onEdit={() => startEditing(project)}
                onDelete={() => handleDelete(project)}
                onMove={(step) => move(index, index + step)}
                dragHandlers={dragHandlersFor(index)}
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
          canPreview={hasCaseStudy(values)}
          onPreview={() => onPreview(previewProject())}
        />
      </div>
    </div>
  )
}

export default ProjectsTab
