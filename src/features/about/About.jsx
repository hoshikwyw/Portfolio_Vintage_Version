import Panel from '@/shared/components/ui/Panel'
import { currently, education, experience, interests, languages, platforms, tools } from '@/shared/config/profile'
import ProfileHero from './components/ProfileHero'
import Timeline from './components/Timeline'
import SkillBars from './components/SkillBars'
import DetailList from './components/DetailList'
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
 * what gets built, education) sits on the left and what is current plus the
 * skill set on the right, and on a narrow window they stack in that order —
 * the most useful facts first.
 *
 * The page stops growing at ~1040px and centres. Fullscreen on a wide monitor
 * otherwise stretched every meter half a metre long and opened a dead gap
 * between the bio and the contact card.
 */
const About = () => (
  <div className="@container w-full p-4">
    <div className="flex flex-col gap-4 max-w-[1040px] mx-auto">
      <ProfileHero />

      {/*
        Left: the work — jobs, what gets built, education, languages.
        Right: the toolkit — what is current, skills, tools, interests.
        Grouped so related panels sit together *and* the columns end level.
      */}
      <div className="grid grid-cols-1 @2xl:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Timeline title="Experience" items={experience} />
          <Panel title="Builds">
            <DetailList items={platforms} />
          </Panel>
          <Timeline title="Education" items={education} />
          <Panel title="Languages">
            <DetailList items={languages.map(({ name, level }) => ({ name, tag: level }))} />
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel title="Currently">
            <DetailList items={currently} />
          </Panel>
          <SkillBars />
          <Panel title="Tools">
            <DetailList items={tools} />
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
