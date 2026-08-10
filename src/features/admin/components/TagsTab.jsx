import { useState } from 'react'
import { adminColors } from '@/features/admin/theme'
import { useCreateTag, useDeleteTag } from '@/features/admin/hooks/useAdminData'
import { Button, Fieldset } from './ui'

const TagChip = ({ tag, onDelete }) => (
  <div
    className="flex items-center gap-1 px-2 py-0.5"
    style={{ background: adminColors.window, border: `1px solid ${adminColors.borderField}`, borderRadius: '2px' }}
  >
    <span className="text-[10px] font-semibold" style={{ color: adminColors.text }}>{tag.name}</span>
    <button
      onClick={onDelete}
      aria-label={`Delete tag ${tag.name}`}
      className="text-[10px] text-[#8a4040] hover:text-[#c04040] cursor-pointer font-bold leading-none"
      style={{ background: 'none', border: 'none' }}
    >
      ×
    </button>
  </div>
)

/** Create and remove the tags that projects can be labelled with. */
const TagsTab = ({ tags, flash, flashError }) => {
  const [name, setName] = useState('')
  const createTag = useCreateTag()
  const deleteTag = useDeleteTag()

  const handleAdd = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    try {
      await createTag.mutateAsync(trimmed)
      setName('')
      flash('Tag added!')
    } catch (error) {
      flashError(error)
    }
  }

  const handleDelete = async (tag) => {
    if (!confirm(`Delete the tag "${tag.name}"?`)) return
    try {
      await deleteTag.mutateAsync(tag.id)
      flash('Tag deleted.')
    } catch (error) {
      flashError(error)
    }
  }

  return (
    <div className="space-y-3">
      <Fieldset title="Add Tag">
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tag name..."
            className="flex-1 text-[11px] px-1.5 py-1 outline-none"
            style={{
              border: `2px inset ${adminColors.borderField}`,
              background: adminColors.field,
              borderRadius: '1px',
              color: adminColors.text,
            }}
          />
          <Button type="submit" disabled={createTag.isPending} className="px-3 py-1 text-[10px]">Add</Button>
        </form>
      </Fieldset>

      <Fieldset title={`All Tags (${tags.length})`}>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <TagChip key={tag.id} tag={tag} onDelete={() => handleDelete(tag)} />
          ))}
          {!tags.length && <p className="text-[11px]" style={{ color: adminColors.textFaint }}>No tags yet.</p>}
        </div>
      </Fieldset>
    </div>
  )
}

export default TagsTab
