import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const inputStyle = { border: '2px inset #a0a090', background: '#f0ebe3', borderRadius: '1px' }
const btnStyle = {
    background: 'linear-gradient(180deg, #d0c8b8, #b0a898)',
    border: '2px solid #7a7060',
    borderTopColor: '#e0d8c8',
    borderLeftColor: '#e0d8c8',
    borderRadius: '3px',
}
const btnDanger = {
    background: 'linear-gradient(180deg, #c8a0a0, #a08080)',
    border: '2px solid #7a5050',
    borderTopColor: '#d0b8b8',
    borderLeftColor: '#d0b8b8',
    borderRadius: '3px',
}
const fieldsetStyle = { border: '2px groove #c0b8a8', borderRadius: '2px', padding: '10px 12px' }

// Tab button
const Tab = ({ active, children, onClick }) => (
    <button
        onClick={onClick}
        className="px-3 py-1 text-[11px] font-bold uppercase tracking-wide cursor-pointer"
        style={active ? {
            background: '#c0b8a8',
            border: '2px solid #8a8070',
            borderBottomColor: '#c0b8a8',
            borderTopColor: '#e0d8c8',
            borderLeftColor: '#e0d8c8',
            borderRadius: '3px 3px 0 0',
            marginBottom: '-2px',
            position: 'relative',
            zIndex: 1,
            color: '#2b2b3d',
        } : {
            background: '#b0a898',
            border: '2px solid #8a8070',
            borderTopColor: '#d0c8b8',
            borderLeftColor: '#d0c8b8',
            borderRadius: '3px 3px 0 0',
            color: '#5a5a5a',
        }}
    >
        {children}
    </button>
)

export default function AdminDashboard({ onLogout, userEmail }) {
    const [tab, setTab] = useState('projects')
    const [projects, setProjects] = useState([])
    const [allTags, setAllTags] = useState([])
    const [images, setImages] = useState([])
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    // Project form
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState({ title: '', description: '', demo_url: '', repo_url: '', status: true, sort_order: 0 })
    const [selectedTags, setSelectedTags] = useState([])

    // Image form
    const [imgProjectId, setImgProjectId] = useState('')
    const [imgFiles, setImgFiles] = useState(null)
    const [imgIsCover, setImgIsCover] = useState(false)
    const [imgShowGallery, setImgShowGallery] = useState(true)
    const [uploading, setUploading] = useState(false)

    // Tag form
    const [newTag, setNewTag] = useState('')

    const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

    const fetchAll = async () => {
        setLoading(true)
        const [p, t, i] = await Promise.all([
            supabase.from('projects').select('*').order('sort_order'),
            supabase.from('tags').select('*').order('name'),
            supabase.from('project_images').select('*, projects(title)').order('sort_order'),
        ])
        if (p.data) setProjects(p.data)
        if (t.data) setAllTags(t.data)
        if (i.data) setImages(i.data)
        setLoading(false)
    }

    useEffect(() => { fetchAll() }, [])

    // ===== PROJECT CRUD =====
    const resetForm = () => { setEditId(null); setForm({ title: '', description: '', demo_url: '', repo_url: '', status: true, sort_order: 0 }); setSelectedTags([]) }

    const editProject = async (p) => {
        setEditId(p.id)
        setForm({ title: p.title, description: p.description || '', demo_url: p.demo_url || '', repo_url: p.repo_url || '', status: p.status, sort_order: p.sort_order })
        // Fetch tags for this project
        const { data } = await supabase.from('project_tags').select('tag_id').eq('project_id', p.id)
        setSelectedTags(data?.map(r => r.tag_id) || [])
    }

    const saveProject = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (editId) {
            const { error } = await supabase.from('projects').update(form).eq('id', editId)
            if (error) { flash(`Error: ${error.message}`); setLoading(false); return }
            // Update tags: delete old, insert new
            await supabase.from('project_tags').delete().eq('project_id', editId)
            if (selectedTags.length > 0) {
                await supabase.from('project_tags').insert(selectedTags.map(tid => ({ project_id: editId, tag_id: tid })))
            }
            flash('Project updated!')
        } else {
            const { data, error } = await supabase.from('projects').insert(form).select().single()
            if (error) { flash(`Error: ${error.message}`); setLoading(false); return }
            if (selectedTags.length > 0) {
                await supabase.from('project_tags').insert(selectedTags.map(tid => ({ project_id: data.id, tag_id: tid })))
            }
            flash('Project created!')
        }
        resetForm()
        await fetchAll()
    }

    const deleteProject = async (id) => {
        if (!confirm('Delete this project and all its images?')) return
        await supabase.from('projects').delete().eq('id', id)
        flash('Project deleted.')
        await fetchAll()
    }

    // ===== IMAGE CRUD =====
    const getProjectImageCount = (projectId) => {
        return images.filter(img => img.project_id === Number(projectId)).length
    }

    const uploadImages = async (e) => {
        e.preventDefault()
        if (!imgProjectId || !imgFiles?.length) { flash('Select a project and at least one file.'); return }

        const pid = Number(imgProjectId)
        const currentCount = getProjectImageCount(pid)
        const remaining = 3 - currentCount

        if (remaining <= 0) { flash('This project already has 3 images (max).'); return }
        if (imgFiles.length > remaining) { flash(`Can only add ${remaining} more image(s) to this project.`); return }

        setUploading(true)

        for (let i = 0; i < imgFiles.length; i++) {
            const file = imgFiles[i]
            const ext = file.name.split('.').pop()
            const path = `${pid}/${Date.now()}-${i}.${ext}`

            // Upload to storage
            const { error: uploadErr } = await supabase.storage
                .from('project-images')
                .upload(path, file, { cacheControl: '3600', upsert: false })

            if (uploadErr) { flash(`Upload error: ${uploadErr.message}`); setUploading(false); return }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from('project-images')
                .getPublicUrl(path)

            // Insert into project_images table
            const { error: dbErr } = await supabase.from('project_images').insert({
                project_id: pid,
                image_url: urlData.publicUrl,
                is_cover: imgIsCover && i === 0,
                show_in_gallery: imgShowGallery,
                sort_order: currentCount + i,
            })

            if (dbErr) { flash(`DB error: ${dbErr.message}`); setUploading(false); return }
        }

        setImgProjectId('')
        setImgFiles(null)
        setImgIsCover(false)
        setImgShowGallery(true)
        setUploading(false)
        flash(`${imgFiles.length} image(s) uploaded!`)
        // Reset file input
        const fileInput = document.getElementById('img-file-input')
        if (fileInput) fileInput.value = ''
        await fetchAll()
    }

    const deleteImage = async (img) => {
        // Extract storage path from URL
        const url = img.image_url
        const bucketPath = url.split('/project-images/').pop()
        if (bucketPath) {
            await supabase.storage.from('project-images').remove([bucketPath])
        }
        await supabase.from('project_images').delete().eq('id', img.id)
        flash('Image deleted.')
        await fetchAll()
    }

    // ===== TAG CRUD =====
    const addTag = async (e) => {
        e.preventDefault()
        if (!newTag.trim()) return
        const { error } = await supabase.from('tags').insert({ name: newTag.trim() })
        if (error) { flash(`Error: ${error.message}`); return }
        setNewTag('')
        flash('Tag added!')
        await fetchAll()
    }

    const deleteTag = async (id) => {
        await supabase.from('tags').delete().eq('id', id)
        flash('Tag deleted.')
        await fetchAll()
    }

    const toggleTag = (tid) => {
        setSelectedTags(prev => prev.includes(tid) ? prev.filter(t => t !== tid) : [...prev, tid])
    }

    return (
        <div className="w-full h-full overflow-y-auto p-3" style={{ background: '#c0b8a8', fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
            {/* Admin header */}
            <div className="flex items-center justify-between mb-2 px-2 py-1.5" style={{ background: '#e8e0d4', border: '1px solid #a0a090', borderRadius: '2px' }}>
                <span className="text-[10px] text-[#5a5a5a]">
                    Signed in as <span className="font-bold text-[#2b2b3d]">{userEmail}</span>
                </span>
                <button
                    onClick={onLogout}
                    className="px-3 py-0.5 text-[9px] font-bold uppercase tracking-wide cursor-pointer hover:brightness-105"
                    style={btnDanger}
                >
                    Logout
                </button>
            </div>

            {/* Status message */}
            {msg && (
                <div className="mb-2 px-3 py-1.5 text-[11px] font-semibold" style={{ background: '#d8e8d8', border: '1px solid #80a080', borderRadius: '2px', color: '#2a4a2a' }}>
                    {msg}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-0.5 mb-0">
                <Tab active={tab === 'projects'} onClick={() => setTab('projects')}>Projects</Tab>
                <Tab active={tab === 'images'} onClick={() => setTab('images')}>Images</Tab>
                <Tab active={tab === 'tags'} onClick={() => setTab('tags')}>Tags</Tab>
            </div>

            <div style={{ border: '2px solid #8a8070', borderTopColor: '#e0d8c8', borderLeftColor: '#e0d8c8', borderRadius: '0 4px 4px 4px', background: '#c0b8a8', padding: '12px' }}>

                {/* ===== PROJECTS TAB ===== */}
                {tab === 'projects' && (
                    <div className="space-y-3">
                        {/* Form */}
                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">
                                {editId ? 'Edit Project' : 'New Project'}
                            </legend>
                            <form onSubmit={saveProject} className="space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Title *</label>
                                        <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                                            className="w-full text-[11px] px-1.5 py-1 outline-none" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Sort Order</label>
                                        <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                                            className="w-full text-[11px] px-1.5 py-1 outline-none" style={inputStyle} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                                        className="w-full text-[11px] px-1.5 py-1 outline-none resize-none" style={inputStyle} />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Demo URL</label>
                                        <input value={form.demo_url} onChange={e => setForm(f => ({ ...f, demo_url: e.target.value }))}
                                            className="w-full text-[11px] px-1.5 py-1 outline-none" style={inputStyle} />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Repo URL</label>
                                        <input value={form.repo_url} onChange={e => setForm(f => ({ ...f, repo_url: e.target.value }))}
                                            className="w-full text-[11px] px-1.5 py-1 outline-none" style={inputStyle} />
                                    </div>
                                </div>

                                {/* Status */}
                                <label className="flex items-center gap-2 text-[11px] text-[#2b2b3d] cursor-pointer">
                                    <input type="checkbox" checked={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.checked }))} />
                                    <span className="font-semibold">Live (uncheck = Coming Soon)</span>
                                </label>

                                {/* Tags */}
                                <div>
                                    <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-1">Tags</label>
                                    <div className="flex flex-wrap gap-1">
                                        {allTags.map(tag => (
                                            <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                                                className="px-2 py-0.5 text-[9px] font-bold uppercase cursor-pointer"
                                                style={{
                                                    background: selectedTags.includes(tag.id) ? '#4a3aad' : '#e8e0d4',
                                                    color: selectedTags.includes(tag.id) ? '#fff' : '#2b2b3d',
                                                    border: `1px solid ${selectedTags.includes(tag.id) ? '#4a3aad' : '#a0a090'}`,
                                                    borderRadius: '2px',
                                                }}
                                            >
                                                {tag.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button type="submit" disabled={loading} className="px-4 py-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer hover:brightness-105" style={btnStyle}>
                                        {editId ? 'Update' : 'Create'}
                                    </button>
                                    {editId && (
                                        <button type="button" onClick={resetForm} className="px-4 py-1 text-[10px] font-bold uppercase tracking-wide cursor-pointer hover:brightness-105" style={btnStyle}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </fieldset>

                        {/* Project list */}
                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">
                                All Projects ({projects.length})
                            </legend>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto">
                                {projects.map(p => (
                                    <div key={p.id} className="flex items-center justify-between py-1 px-2 text-[11px]" style={{ background: '#e8e0d4', border: '1px solid #a0a090', borderRadius: '2px' }}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.status ? 'bg-[#4a8a4a]' : 'bg-[#8a8070]'}`} />
                                            <span className="font-semibold text-[#2b2b3d] truncate">{p.title}</span>
                                            <span className="text-[9px] text-[#6a6a6a]">#{p.sort_order}</span>
                                        </div>
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button onClick={() => editProject(p)} className="px-2 py-0.5 text-[9px] font-bold cursor-pointer hover:brightness-105" style={btnStyle}>Edit</button>
                                            <button onClick={() => deleteProject(p.id)} className="px-2 py-0.5 text-[9px] font-bold cursor-pointer hover:brightness-105" style={btnDanger}>Del</button>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="text-[11px] text-[#6a6a6a] text-center py-2">No projects yet.</p>}
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* ===== IMAGES TAB ===== */}
                {tab === 'images' && (
                    <div className="space-y-3">
                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Upload Images</legend>
                            <form onSubmit={uploadImages} className="space-y-3">
                                {/* Project selector */}
                                <div>
                                    <label className="block text-[9px] font-bold text-[#4a4a4a] uppercase mb-0.5">Project *</label>
                                    <select value={imgProjectId} onChange={e => setImgProjectId(e.target.value)}
                                        className="w-full text-[11px] px-1.5 py-1 outline-none" style={inputStyle} required>
                                        <option value="">Select project...</option>
                                        {projects.map(p => {
                                            const count = getProjectImageCount(p.id)
                                            return (
                                                <option key={p.id} value={p.id} disabled={count >= 3}>
                                                    {p.title} ({count}/3)
                                                </option>
                                            )
                                        })}
                                    </select>
                                </div>

                                {/* Capacity bar */}
                                {imgProjectId && (() => {
                                    const count = getProjectImageCount(Number(imgProjectId))
                                    const remaining = 3 - count
                                    return (
                                        <div className="px-2 py-2" style={{ background: '#e8e0d4', border: '1px solid #a0a090', borderRadius: '2px' }}>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-[9px] font-bold text-[#4a4a4a] uppercase">Capacity</span>
                                                <span className="text-[9px] font-bold text-[#2b2b3d]">{count}/3</span>
                                            </div>
                                            <div className="w-full h-2 overflow-hidden" style={{ background: '#d0c8b8', border: '1px inset #a0a090' }}>
                                                <div className="h-full transition-all duration-300" style={{
                                                    width: `${(count / 3) * 100}%`,
                                                    background: count >= 3 ? '#8a3030' : count >= 2 ? '#8a7030' : '#4a3aad',
                                                }} />
                                            </div>
                                            <p className="text-[9px] text-[#5a5a5a] mt-1">
                                                {remaining > 0 ? `${remaining} slot${remaining > 1 ? 's' : ''} available` : 'Full — delete an image to upload more'}
                                            </p>
                                        </div>
                                    )
                                })()}

                                {/* Drop zone */}
                                <div>
                                    <input
                                        id="img-file-input"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => setImgFiles(e.target.files?.length ? Array.from(e.target.files) : null)}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => document.getElementById('img-file-input')?.click()}
                                        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = '#4a3aad' }}
                                        onDragLeave={e => { e.currentTarget.style.borderColor = '#a0a090' }}
                                        onDrop={e => {
                                            e.preventDefault()
                                            e.currentTarget.style.borderColor = '#a0a090'
                                            const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
                                            if (files.length) setImgFiles(files)
                                        }}
                                        className="cursor-pointer transition-all hover:brightness-[1.02]"
                                        style={{
                                            border: '2px dashed #a0a090',
                                            borderRadius: '4px',
                                            background: '#f0ebe3',
                                            padding: '16px',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {imgFiles?.length ? (
                                            <div className="space-y-2">
                                                <div className="flex gap-2 justify-center flex-wrap">
                                                    {imgFiles.map((f, i) => (
                                                        <div key={i} className="relative" style={{ width: 56, height: 56 }}>
                                                            <img
                                                                src={URL.createObjectURL(f)}
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                                style={{ border: '1px solid #a0a090', borderRadius: '3px' }}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setImgFiles(prev => {
                                                                        const next = prev.filter((_, idx) => idx !== i)
                                                                        if (!next.length) {
                                                                            const el = document.getElementById('img-file-input')
                                                                            if (el) el.value = ''
                                                                            return null
                                                                        }
                                                                        return next
                                                                    })
                                                                }}
                                                                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center cursor-pointer"
                                                                style={{ background: '#8a3030', border: '1px solid #6a2020', lineHeight: 1 }}
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-[9px] text-[#5a5a5a]">{imgFiles.length} file{imgFiles.length > 1 ? 's' : ''} selected — click to change</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a0a090" strokeWidth="1.5" className="mx-auto mb-1.5">
                                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <p className="text-[11px] font-semibold text-[#5a5a5a]">Click or drag images here</p>
                                                <p className="text-[9px] text-[#8a8a8a] mt-0.5">PNG, JPG, WEBP — max 3 per project</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="flex items-center gap-4 px-1">
                                    <label className="flex items-center gap-1.5 text-[10px] text-[#2b2b3d] cursor-pointer">
                                        <input type="checkbox" checked={imgIsCover} onChange={e => setImgIsCover(e.target.checked)} className="accent-[#4a3aad]" />
                                        <span className="font-semibold">Set first as cover</span>
                                    </label>
                                    <label className="flex items-center gap-1.5 text-[10px] text-[#2b2b3d] cursor-pointer">
                                        <input type="checkbox" checked={imgShowGallery} onChange={e => setImgShowGallery(e.target.checked)} className="accent-[#4a8a4a]" />
                                        <span className="font-semibold">Show in gallery</span>
                                    </label>
                                </div>

                                {/* Upload button */}
                                <button
                                    type="submit"
                                    disabled={uploading || loading || !imgFiles?.length}
                                    className="w-full py-1.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    style={{
                                        background: uploading ? 'linear-gradient(180deg, #a0a090, #8a8070)' : 'linear-gradient(180deg, #5a4acd, #4a3aad)',
                                        color: '#fff',
                                        border: '2px solid #3a2a8d',
                                        borderTopColor: '#6a5add',
                                        borderLeftColor: '#6a5add',
                                        borderRadius: '3px',
                                    }}
                                >
                                    {uploading ? 'Uploading...' : `Upload${imgFiles?.length ? ` (${imgFiles.length})` : ''}`}
                                </button>
                            </form>
                        </fieldset>

                        {/* Images grouped by project */}
                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">All Images ({images.length})</legend>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {projects.filter(p => images.some(i => i.project_id === p.id)).map(p => {
                                    const projImgs = images.filter(i => i.project_id === p.id)
                                    return (
                                        <div key={p.id} className="px-2 py-2" style={{ background: '#e8e0d4', border: '1px solid #a0a090', borderRadius: '3px' }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-[#2b2b3d] uppercase tracking-wide">{p.title}</span>
                                                <span className="text-[9px] text-[#5a5a5a] font-semibold">{projImgs.length}/3</span>
                                            </div>
                                            <div className="flex gap-2">
                                                {projImgs.map(img => (
                                                    <div key={img.id} className="relative group flex-shrink-0" style={{ width: 90, height: 68 }}>
                                                        <img src={img.image_url} alt="" className="w-full h-full object-cover" style={{ border: '2px solid #a0a090', borderTopColor: '#d0c8b8', borderLeftColor: '#d0c8b8', borderRadius: '2px' }} />
                                                        {/* Badges */}
                                                        <div className="absolute bottom-0 left-0 right-0 flex gap-px">
                                                            {img.is_cover && <span className="text-[7px] bg-[#4a3aad] text-white px-1.5 py-px font-bold uppercase flex-1 text-center">Cover</span>}
                                                            {img.show_in_gallery && <span className="text-[7px] bg-[#4a8a4a] text-white px-1.5 py-px font-bold uppercase flex-1 text-center">Gallery</span>}
                                                        </div>
                                                        {/* Delete overlay */}
                                                        <div className="absolute inset-0 bg-[#8a3030]/0 group-hover:bg-[#8a3030]/60 transition-colors flex items-center justify-center rounded-sm">
                                                            <button
                                                                onClick={() => deleteImage(img)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer px-2 py-0.5 text-[9px] font-bold text-white uppercase"
                                                                style={{ background: '#6a2020', border: '1px solid #4a1010', borderRadius: '2px' }}
                                                            >Delete</button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Empty slots */}
                                                {Array.from({ length: 3 - projImgs.length }).map((_, i) => (
                                                    <div key={`empty-${i}`} className="flex-shrink-0 flex items-center justify-center" style={{ width: 90, height: 68, border: '2px dashed #b0a898', borderRadius: '2px', background: '#d8d0c0' }}>
                                                        <span className="text-[18px] text-[#a0a090]">+</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                                {images.length === 0 && <p className="text-[11px] text-[#6a6a6a] text-center py-4">No images yet. Select a project and upload above.</p>}
                            </div>
                        </fieldset>
                    </div>
                )}

                {/* ===== TAGS TAB ===== */}
                {tab === 'tags' && (
                    <div className="space-y-3">
                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">Add Tag</legend>
                            <form onSubmit={addTag} className="flex gap-2">
                                <input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Tag name..."
                                    className="flex-1 text-[11px] px-1.5 py-1 outline-none" style={inputStyle} />
                                <button type="submit" className="px-3 py-1 text-[10px] font-bold uppercase cursor-pointer hover:brightness-105" style={btnStyle}>Add</button>
                            </form>
                        </fieldset>

                        <fieldset style={fieldsetStyle}>
                            <legend className="text-[10px] font-bold text-[#2b2b3d] px-1 uppercase tracking-wide">All Tags ({allTags.length})</legend>
                            <div className="flex flex-wrap gap-1.5">
                                {allTags.map(tag => (
                                    <div key={tag.id} className="flex items-center gap-1 px-2 py-0.5" style={{ background: '#e8e0d4', border: '1px solid #a0a090', borderRadius: '2px' }}>
                                        <span className="text-[10px] font-semibold text-[#2b2b3d]">{tag.name}</span>
                                        <button onClick={() => deleteTag(tag.id)} className="text-[10px] text-[#8a4040] hover:text-[#c04040] cursor-pointer font-bold leading-none" style={{ background: 'none', border: 'none' }}>×</button>
                                    </div>
                                ))}
                                {allTags.length === 0 && <p className="text-[11px] text-[#6a6a6a]">No tags yet.</p>}
                            </div>
                        </fieldset>
                    </div>
                )}
            </div>
        </div>
    )
}
