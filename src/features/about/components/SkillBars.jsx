import Panel from '@/shared/components/ui/Panel'
import { skills } from '@/shared/config/profile'

/** Cells in one meter. 20 keeps each worth a readable 5%. */
const SEGMENTS = 20

/**
 * Labelled proficiency meters.
 *
 * Segmented rather than a single filled rectangle — a notched bar is what a
 * Win95-era progress control actually looked like, and discrete cells read as
 * a rough rating rather than implying a precision that a self-assessed
 * percentage does not have.
 */
const SkillBars = () => (
  <Panel title="Skills">
    <div className="flex flex-col gap-2.5">
      {skills.map((skill) => {
        const filled = Math.round((skill.level / 100) * SEGMENTS)

        return (
          <div key={skill.name}>
            <div className="flex justify-between items-baseline mb-1">
              <span
                className="font-bold uppercase text-[11px] tracking-wide"
                style={{ color: 'var(--os-text)' }}
              >
                {skill.name}
              </span>
              <span className="font-bold text-[10px]" style={{ color: 'var(--os-accent)' }}>
                {skill.level}%
              </span>
            </div>

            <div
              className="os-meter"
              role="progressbar"
              aria-label={skill.name}
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* Presentational: the accessible value is on the wrapper above. */}
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <span key={i} className={`os-meter-cell${i < filled ? ' is-on' : ''}`} aria-hidden="true" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  </Panel>
)

export default SkillBars
