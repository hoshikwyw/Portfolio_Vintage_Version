import Panel from '@/shared/components/ui/Panel'

/**
 * `{ title, detail }` list for education and experience.
 *
 * Rendered as an actual timeline — a connecting rail with a node per entry —
 * rather than the flat bulleted list it was before, so the sequence reads as
 * progression instead of as an unordered set of facts.
 */
const Timeline = ({ title, items }) => (
  <Panel title={title}>
    <ol className="os-timeline">
      {items.map((item) => (
        <li key={item.title} className="os-timeline-item">
          <p className="font-bold text-[12px] leading-snug" style={{ color: 'var(--os-text)' }}>
            {item.title}
          </p>
          <p className="text-[11px] leading-snug mt-0.5" style={{ color: 'var(--os-text-secondary)' }}>
            {item.detail}
          </p>
        </li>
      ))}
    </ol>
  </Panel>
)

export default Timeline
