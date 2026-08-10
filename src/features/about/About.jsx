import Panel from '@/shared/components/ui/Panel'
import { FONT_STACK } from '@/shared/constants/fonts'
import { education, experience, interests, languages } from '@/shared/config/profile'
import ProfileSummary from './components/ProfileSummary'
import Timeline from './components/Timeline'
import SkillBars from './components/SkillBars'

const timelines = [
  { title: 'Education', items: education },
  { title: 'Experience', items: experience },
]

/** The "About Me" window: identity, contact, timeline, skills and interests. */
const About = () => (
  <div className="contentContainer">
    <div className="min-h-screen p-4" style={{ fontFamily: FONT_STACK }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="lg:w-1/3 flex flex-col gap-4">
            <ProfileSummary />
          </div>

          <div className="lg:w-2/3 flex flex-col gap-4">
            {timelines.map(({ title, items }) => (
              <Timeline key={title} title={title} items={items} />
            ))}

            <SkillBars />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Panel title="Languages">
                <div className="space-y-1.5">
                  {languages.map((language) => (
                    <div key={language} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--os-accent)' }} />
                      <span className="text-[11px]" style={{ color: 'var(--os-text)' }}>{language}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Interests">
                <div className="flex flex-wrap gap-1.5">
                  {interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5"
                      style={{
                        border: '1px solid var(--os-border-dark)',
                        background: 'var(--os-panel-bg)',
                        borderRadius: 'var(--os-btn-radius)',
                        color: 'var(--os-text)',
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default About
