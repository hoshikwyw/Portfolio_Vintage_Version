import Panel from '@/shared/components/ui/Panel'
import { skills } from '@/shared/config/profile'

/** Labelled proficiency bars. */
const SkillBars = () => (
  <Panel title="Skills">
    <div className="flex flex-col gap-2.5">
      {skills.map((skill) => (
        <div key={skill.name}>
          <div className="flex justify-between mb-1">
            <span className="font-bold uppercase text-[11px] tracking-wide" style={{ color: 'var(--os-text)' }}>
              {skill.name}
            </span>
            <span className="font-bold text-[11px]" style={{ color: 'var(--os-accent)' }}>{skill.level}%</span>
          </div>
          <div
            className="w-full h-3 overflow-hidden"
            style={{ border: 'var(--os-input-border)', background: 'var(--os-input-bg)' }}
            role="progressbar"
            aria-label={skill.name}
            aria-valuenow={skill.level}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full" style={{ width: `${skill.level}%`, background: 'var(--os-accent)' }} />
          </div>
        </div>
      ))}
    </div>
  </Panel>
)

export default SkillBars
