import { useId, useRef, useState } from 'react'
import { LogOut } from 'lucide-react'
import StatusMessage from '@/shared/components/feedback/StatusMessage'
import WindowSkeleton from '@/shared/components/feedback/WindowSkeleton'
import { hasCaseStudy } from '@/features/projects/caseStudy'
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
  <header className="admin-header os-raised">
    <div className="min-w-0">
      <p className="admin-title">Content dashboard</p>
      <p className="admin-subtitle">
        Signed in as <span className="font-bold">{email}</span>
      </p>
    </div>
    <Button variant="danger" onClick={onLogout} className="flex items-center gap-1.5 px-3 py-1 text-[10px]">
      <LogOut size={12} aria-hidden="true" />
      Logout
    </Button>
  </header>
)

const StatTile = ({ label, value, hint }) => (
  <div className="admin-stat">
    <span className="admin-stat-value">{value}</span>
    <span className="admin-stat-label">{label}</span>
    {hint && <span className="admin-stat-hint">{hint}</span>}
  </div>
)

/** At-a-glance totals, so the state of the portfolio reads before any tab is opened. */
const Stats = ({ projects, images, tags }) => {
  const live = projects.filter((project) => project.status).length
  const caseStudies = projects.filter(hasCaseStudy).length
  const inGallery = images.filter((image) => image.show_in_gallery).length

  return (
    <div className="admin-stats" role="group" aria-label="Summary">
      <StatTile label="Projects" value={projects.length} hint={`${live} live`} />
      <StatTile label="Case studies" value={caseStudies} hint={`of ${projects.length}`} />
      <StatTile label="Images" value={images.length} hint={`${inGallery} in gallery`} />
      <StatTile label="Tags" value={tags.length} />
    </div>
  )
}

/**
 * Content management for projects, images and tags.
 *
 * A header and summary tiles, then a real tab interface: `tablist` / `tab` /
 * `tabpanel` with arrow-key switching, where these used to be plain buttons
 * that a screen reader could not tell were tabs. Each tab shows its count.
 *
 * Data comes from React Query — each tab mutates through hooks that invalidate
 * both the admin caches and the public Projects/Gallery caches, so the desktop
 * windows reflect an edit immediately.
 */
const AdminDashboard = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const { message, flash, flashError } = useFlash()
  const baseId = useId()
  const tabRefs = useRef({})

  const projectsQuery = useAdminProjects()
  const tagsQuery = useAdminTags()
  const imagesQuery = useAdminImages()

  const isLoading = projectsQuery.isLoading || tagsQuery.isLoading || imagesQuery.isLoading
  const error = projectsQuery.error || tagsQuery.error || imagesQuery.error
  const data = {
    projects: projectsQuery.data ?? [],
    tags: tagsQuery.data ?? [],
    images: imagesQuery.data ?? [],
  }

  const { Panel } = TABS.find((tab) => tab.key === activeTab)

  // ←/→ (and Home/End) move between tabs, the standard tablist pattern.
  const handleTabKeys = (event) => {
    const index = TABS.findIndex((tab) => tab.key === activeTab)
    const moves = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    const next = TABS[(moves[event.key] + TABS.length) % TABS.length]
    setActiveTab(next.key)
    tabRefs.current[next.key]?.focus()
  }

  return (
    <div className="admin-root">
      <div className="admin-page">
        <AdminHeader email={userEmail} onLogout={onLogout} />

        {!isLoading && !error && <Stats {...data} />}

        <Banner message={message} />

        <div className="flex gap-0.5" role="tablist" aria-label="Content" onKeyDown={handleTabKeys}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <Tab
                key={tab.key}
                ref={(el) => { tabRefs.current[tab.key] = el }}
                role="tab"
                id={`${baseId}-tab-${tab.key}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                active={isActive}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {!isLoading && <span className="admin-tab-count">{data[tab.key].length}</span>}
              </Tab>
            )
          })}
        </div>

        <div
          className="admin-tabpanel os-raised"
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${activeTab}`}
        >
          {isLoading && <WindowSkeleton label="Loading dashboard" />}
          {!isLoading && error && <StatusMessage tone="error">{error.message}</StatusMessage>}
          {!isLoading && !error && <Panel {...data} flash={flash} flashError={flashError} />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
