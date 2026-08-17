/** Storage bucket holding uploaded project screenshots. */
export const IMAGE_BUCKET = 'project-images'

/** Hard cap on screenshots per project, enforced in the upload form. */
export const MAX_IMAGES_PER_PROJECT = 3

/** Usernames without an `@` are completed with this domain before sign-in. */
export const ADMIN_EMAIL_DOMAIN = 'kayv.os'

/** A blank project, used to reset the editor form. */
export const EMPTY_PROJECT = {
  title: '',
  description: '',
  demo_url: '',
  repo_url: '',
  status: true,
  sort_order: 0,
  // Case study. All optional — a project with none of them simply shows no
  // "Read case study" button, so these can be filled in one project at a time.
  year: '',
  role: '',
  problem: '',
  outcome: '',
}
