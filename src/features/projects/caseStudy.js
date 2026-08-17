/**
 * Case-study helpers.
 *
 * The four fields are nullable and get filled in gradually, so nothing may
 * assume they exist. A project without any of them simply has no case study
 * and shows no "Read case study" button — the card behaves exactly as it did
 * before.
 */

/** The rows rendered in the detail panel, in order. */
export const CASE_STUDY_FIELDS = [
  { key: 'role', label: 'Role' },
  { key: 'problem', label: 'Problem' },
  { key: 'outcome', label: 'Outcome' },
]

const hasText = (value) => typeof value === 'string' && value.trim().length > 0

/**
 * Does this project have enough written up to be worth opening?
 *
 * `year` alone does not count — a date with no prose is a fact, not a story,
 * and opening a panel to show one line would be a worse experience than not
 * offering it at all.
 */
export const hasCaseStudy = (project) =>
  CASE_STUDY_FIELDS.some(({ key }) => hasText(project?.[key]))

/** Only the rows that actually have content, ready to render. */
export const caseStudyRows = (project) =>
  CASE_STUDY_FIELDS.filter(({ key }) => hasText(project?.[key])).map(({ key, label }) => ({
    key,
    label,
    value: project[key].trim(),
  }))
