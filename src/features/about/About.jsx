import Panel from '@/shared/components/ui/Panel'
import { education, experience, interests, languages } from '@/shared/config/profile'
import ProfileHero from './components/ProfileHero'
import Timeline from './components/Timeline'
import SkillBars from './components/SkillBars'
import './about.css'

const Chip = ({ children }) => (
  <span
    className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5"
    style={{
      border: '1px solid var(--os-border-dark)',
      background: 'var(--os-window-content)',
      borderRadius: 'var(--os-btn-radius)',
      color: 'var(--os-text)',
    }}
  >
    {children}
  </span>
)

/**
 * The "About Me" window: identity, contact, timeline/**
 * The "About Me" window: identity and contact up top, then the detail.
 *
 * Laid out with *container* queries (`@container` + `@2xl:`) rather than
 * viewport breakpoints: a window is a few hundred pixels wide inside a screen
 * that may be 1920, so it is the window's width that should decide the layout.
 *
 * Below the profile card is a single two-column grid. It used to be two grids
 * stacked, with different column ratios, so their gutters never lined up and
 * the left column ran far longer than the right. Now the history (experience,
 * education) sits on the left and the skill set on the right, and on a narrow
 * window they stack in that order — the most useful facts first.
 */
const About = () => (
  <div className="@container w-full p-4">
    <div className="flex flex-col gap-4">
      <ProfileHero />

      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Timeline title="Experience" items={experience} />
          <Timeline title="Education" items={education} />
        </div>

        <div className="flex flex-col gap-4">
          <SkillBars />

          <Panel title="Languages">
            <div className="space-y-1.5">
              {languages.map((language) => (
                <div key={language} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--os-accent)' }}
                  />
                  <span className="text-[11px]" style={{ color: 'var(--os-text)' }}>{language}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Interests">
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest) => (
                <Chip key={interest}>{interest}</Chip>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  </div>
)

export default About
