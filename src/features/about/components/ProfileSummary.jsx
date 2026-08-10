import { Mail, Phone } from 'lucide-react'
import Panel from '@/shared/components/ui/Panel'
import { profile } from '@/shared/config/profile'

const ContactRow = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--os-text)' }}>
    <Icon className="w-3.5 h-3.5" style={{ color: 'var(--os-accent)' }} />
    {children}
  </p>
)

/** Avatar, name, bio and contact details — the left column of the About window. */
const ProfileSummary = () => (
  <>
    <Panel title="Profile">
      <div className="flex items-center flex-col">
        <div
          className="w-[120px] h-[120px] mb-3 overflow-hidden"
          style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)' }}
        >
          <img
            src={profile.avatar}
            alt={profile.alias}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
        </div>
        <h1 className="text-xl font-bold tracking-wider uppercase text-center" style={{ color: 'var(--os-text)' }}>
          {profile.name}
        </h1>
        <p className="font-bold uppercase text-xs mt-1 tracking-wider" style={{ color: 'var(--os-accent)' }}>
          {profile.role}
        </p>
        <p className="text-[10px] mt-1 tracking-widest font-semibold" style={{ color: 'var(--os-text-secondary)' }}>
          {profile.location.toUpperCase()}
        </p>
      </div>
    </Panel>

    <Panel title="About">
      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--os-text)' }}>"{profile.about}"</p>
    </Panel>

    <Panel title="Contact">
      <div className="space-y-2">
        <ContactRow icon={Mail}>{profile.email}</ContactRow>
        <ContactRow icon={Phone}>{profile.phone}</ContactRow>
      </div>
    </Panel>
  </>
)

export default ProfileSummary
