import Panel from '@/shared/components/ui/Panel'
import { FONT_STACK } from '@/shared/constants/fonts'
import { education, experience, interests, languages } from '@/shared/config/profile'
import ProfileHero from './components/ProfileHero'
import ProfileSummary from './components/ProfileSummary'
import Timeline from './components/Timeline'
import SkillBars from './components/SkillBars'

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
 * The "About Me" window: identity, contact, timeline, skills and interests.
 *
 * Laid out with *container* queries (`@container` + `@2xl:`) rather than the
 * viewport breakpoints it used before. A window is a few hundred pixels wide
 * inside a screen that may be 1920 — `lg:flex-row` looked at the screen, so
 * the columns split while the window was still narrow and the content came out
 * cramped. Container queries measure the window instead, which is what
 * actually constrains this content.
 */
const About = () => (
  <div className="@container w-full p-4" style={{ fontFamily: FONT_STACK }}>
    <div className="flex flex-col gap-4">
      <ProfileHero />

      <div className="grid grid-cols-1 @2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <ProfileSummary />
          <SkillBars />
        </div>

        <div className="flex flex-col gap-4">
          <Timeline title="Experience" items={experience} />
          <Timeline title="Education" items={education} />
        </div>
      </div>

      <div className="grid grid-cols-1 @xl:grid-cols-2 gap-4 items-start">
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
)

export default About
