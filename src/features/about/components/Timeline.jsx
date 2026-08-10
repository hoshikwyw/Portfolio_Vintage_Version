import Panel from '@/shared/components/ui/Panel'

/** Bulleted `{ title, detail }` list used for education and experience. */
const Timeline = ({ title, items }) => (
  <Panel title={title}>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.title} className="flex items-center gap-3">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--os-accent)', flexShrink: 0 }} />
          <div>
            <h4 className="font-bold text-[12px]" style={{ color: 'var(--os-text)' }}>{item.title}</h4>
            <p className="text-[11px] font-semibold" style={{ color: 'var(--os-accent)' }}>{item.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  </Panel>
)

export default Timeline
