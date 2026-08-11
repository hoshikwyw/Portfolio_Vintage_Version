import { useEffect, useId, useRef, useState } from 'react'
import { adminColors } from '@/features/admin/theme'

const UploadGlyph = () => (
  /*
   * `stroke` is a presentation attribute, and `var()` does not resolve in one —
   * now that adminColors are CSS variables, passing one here would silently
   * fall back to black. `currentColor` picks the value up from the `color`
   * style instead, which does resolve the token.
   */
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className="mx-auto mb-1.5"
    style={{ color: adminColors.borderField }}
  >
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

/**
 * Thumbnail of a pending file.
 *
 * The object URL is revoked when the preview unmounts — the previous version
 * called `URL.createObjectURL` inline during render, minting a fresh blob URL
 * on every re-render and never releasing any of them.
 */
const FilePreview = ({ file, onRemove }) => {
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <div className="relative" style={{ width: 56, height: 56 }}>
      {url && (
        <img
          src={url}
          alt={file.name}
          className="w-full h-full object-cover"
          style={{ border: `1px solid ${adminColors.borderField}`, borderRadius: '3px' }}
        />
      )}
      <button
        type="button"
        aria-label={`Remove ${file.name}`}
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center cursor-pointer"
        style={{ background: adminColors.danger, border: '1px solid var(--os-danger)', lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  )
}

/** Click-or-drag file picker for images. */
const ImageDropzone = ({ files, onChange }) => {
  const inputId = useId()
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const openPicker = () => inputRef.current?.click()

  const setFiles = (next) => {
    onChange(next)
    // Clearing the input lets the same file be re-picked after removal.
    if (!next.length && inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    if (dropped.length) setFiles(dropped)
  }

  return (
    <div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />

      <div
        onClick={openPicker}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="cursor-pointer transition-all hover:brightness-[1.02]"
        style={{
          border: `2px dashed ${isDragging ? adminColors.accent : adminColors.borderField}`,
          borderRadius: '4px',
          background: adminColors.field,
          padding: '16px',
          textAlign: 'center',
        }}
      >
        {files.length ? (
          <div className="space-y-2">
            <div className="flex gap-2 justify-center flex-wrap">
              {files.map((file, index) => (
                <FilePreview
                  key={`${file.name}-${file.lastModified}`}
                  file={file}
                  onRemove={() => setFiles(files.filter((_, i) => i !== index))}
                />
              ))}
            </div>
            <p className="text-[9px]" style={{ color: adminColors.textMuted }}>
              {files.length} file{files.length > 1 ? 's' : ''} selected — click to change
            </p>
          </div>
        ) : (
          <div>
            <UploadGlyph />
            <p className="text-[11px] font-semibold" style={{ color: adminColors.textMuted }}>Click or drag images here</p>
            <p className="text-[9px] mt-0.5" style={{ color: adminColors.textFaint }}>PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageDropzone
