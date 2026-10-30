import { Briefcase, GraduationCap } from 'lucide-react'
import { education, experience } from '@/shared/config/profile'
import SectionHeading from '../components/SectionHeading'

/** A vertical timeline of `{ title, detail }` entries, newest first. */
const Timeline = ({ icon: Icon, title, items }) => (
  <div className="op-card op-timeline-card">
    <h3 className="op-card-title">
      <Icon size={16} aria-hidden="true" />
      {title}
    </h3>
    <ol className="op-timeline">
      {items.map((item) => (
        <li key={item.title} className="op-timeline-item">
          <p className="op-timeline-title">{item.title}</p>
          <p className="op-timeline-detail">{item.detail}</p>
        </li>
      ))}
    </ol>
  </div>
)

/** Work history and education, side by side on a wide screen. */
const ExperienceSection = ({ id }) => (
  <section id={id} className="op-section" aria-labelledby={`${id}-title`}>
    <div className="op-container">
      <SectionHeading
        id={`${id}-title`}
        index="01"
        label="Experience"
        title="Where I've worked and studied"
      />
      <div className="op-two-col">
        <Timeline icon={Briefcase} title="Experience" items={experience} />
        <Timeline icon={GraduationCap} title="Education" items={education} />
      </div>
    </div>
  </section>
)

export default ExperienceSection
