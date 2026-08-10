import { useState } from 'react'
import { FONT_STACK } from '@/shared/constants/fonts'
import StatusMessage from '@/shared/components/feedback/StatusMessage'
import { adminColors } from '@/features/admin/theme'
import { useAdminImages, useAdminProjects, useAdminTags } from '@/features/admin/hooks/useAdminData'
import { useFlash } from '@/features/admin/hooks/useFlash'
import { Banner, Button, Tab } from './ui'
import ProjectsTab from './ProjectsTab'
import ImagesTab from './ImagesTab'
import TagsTab from './TagsTab'

const TABS = [
  { key: 'projects', label: 'Projects', Panel: ProjectsTab },
  { key: 'images', label: 'Images', Panel: ImagesTab },
  { key: 'tags', label: 'Tags', Panel: TagsTab },
]

const AdminHeader = ({ email, onLogout }) => (
  <div
    className="flex items-center justify-between mb-2 px-2 py-1.5"
    style={{ background: adminColors.window, border: `1px solid ${adminColors.borderField}`, borderRadius: '2px' }}
  >
    <span className="text-[10px]" style={{ color: adminColors.textMuted }}>
      Signed in as <span className="font-bold" style={{ color: adminColors.text }}>{email}</span>
    </span>
    <Button variant="danger" onClick={onLogout} className="px-3 py-0.5 text-[9px]">Logout</Button>
  </div>
)

/**
 * Tabbed content management for projects, images and tags.
 *
 * Data comes from React Query — each tab mutates through hooks that invalidate
 * both the admin caches and the public Projects/Gallery caches, so the desktop
 * windows reflect an edit immediately.
 */
const AdminDashboard = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const { message, flash, flashError } = useFlash()

  const projectsQuery = useAdminProjects()
  const tagsQuery = useAdminTags()
  const imagesQuery = useAdminImages()

  const isLoading = projectsQuery.isLoading || tagsQuery.isLoading || imagesQuery.isLoading
  const error = projectsQuery.error || tagsQuery.error || imagesQuery.error

  const { Panel } = TABS.find((tab) => tab.key === activeTab)

  return (
    <div className="w-full h-full overflow-y-auto p-3" style={{ background: adminColors.panel, fontFamily: FONT_STACK }}>
      <AdminHeader email={userEmail} onLogout={onLogout} />

      <Banner message={message} />

      <div className="flex gap-0.5">
        {TABS.map((tab) => (
          <Tab key={tab.key} active={activeTab === tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </Tab>
        ))}
      </div>

      <div
        style={{
          border: `2px solid ${adminColors.borderDark}`,
          borderTopColor: adminColors.borderLight,
          borderLeftColor: adminColors.borderLight,
          borderRadius: '0 4px 4px 4px',
          background: adminColors.panel,
          padding: '12px',
        }}
      >
        {isLoading && <StatusMessage>Loading...</StatusMessage>}
        {!isLoading && error && <StatusMessage tone="error">{error.message}</StatusMessage>}
        {!isLoading && !error && (
          <Panel
            projects={projectsQuery.data ?? []}
            tags={tagsQuery.data ?? []}
            images={imagesQuery.data ?? []}
            flash={flash}
            flashError={flashError}
          />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
