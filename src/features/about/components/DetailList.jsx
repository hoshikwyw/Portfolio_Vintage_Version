/**
 * Short list of `{ name, tag }` rows: the name in bold on the left, a quiet
 * uppercase tag on the right, a dashed rule between rows. Used for Languages
 * ("English · Intermediate") and Currently ("Python · Learning").
 */
const DetailList = ({ items }) => (
  <ul className="os-detail-list">
    {items.map(({ name, tag }) => (
      <li key={name} className="os-detail-row">
        <span className="os-detail-name">{name}</span>
        <span className="os-detail-tag">{tag}</span>
      </li>
    ))}
  </ul>
)

export default DetailList
