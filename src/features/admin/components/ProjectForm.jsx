import { adminColors } from '@/features/admin/theme'
import { Button, Checkbox, Field, Fieldset, Label } from './ui'

const TagToggle = ({ tag, isSelected, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isSelected}
    className="px-2 py-0.5 text-[9px] font-bold uppercase cursor-pointer"
    style={{
      background: isSelected ? adminColors.accent : adminColors.window,
      color: isSelected ? '#fff' : adminColors.text,
      border: `1px solid ${isSelected ? adminColors.accent : adminColors.borderField}`,
      borderRadius: '2px',
    }}
  >
    {tag.name}
  </button>
)

/**
 * Create / edit form for a project.
 *
 * Fully controlled by the parent so "edit this row" can populate it — `editId`
 * being set is what flips it from create to update mode.
 */
const ProjectForm = ({
  editId, values, onChange, tags, selectedTagIds, onToggleTag,
  onSubmit, onCancel, isSaving,
}) => {
  const setField = (name) => (e) => onChange({ ...values, [name]: e.target.value })

  return (
    <Fieldset title={editId ? 'Edit Project' : 'New Project'}>
      <form onSubmit={onSubmit} className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Title *" value={values.title} onChange={setField('title')} required />
          <Field
            label="Sort Order"
            type="number"
            value={values.sort_order}
            onChange={(e) => onChange({ ...values, sort_order: Number(e.target.value) })}
          />
        </div>

        <Field
          label="Description"
          as="textarea"
          rows={2}
          className="resize-none"
          value={values.description}
          onChange={setField('description')}
        />

        <div className="grid grid-cols-2 gap-2">
          <Field label="Demo URL" value={values.demo_url} onChange={setField('demo_url')} />
          <Field label="Repo URL" value={values.repo_url} onChange={setField('repo_url')} />
        </div>

        <Checkbox
          label="Live (uncheck = Coming Soon)"
          checked={values.status}
          onChange={(e) => onChange({ ...values, status: e.target.checked })}
        />

        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <TagToggle
                key={tag.id}
                tag={tag}
                isSelected={selectedTagIds.includes(tag.id)}
                onToggle={() => onToggleTag(tag.id)}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" disabled={isSaving} className="px-4 py-1 text-[10px]">
            {editId ? 'Update' : 'Create'}
          </Button>
          {editId && (
            <Button type="button" onClick={onCancel} className="px-4 py-1 text-[10px]">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Fieldset>
  )
}

export default ProjectForm
