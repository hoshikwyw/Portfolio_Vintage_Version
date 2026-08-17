-- ============================================================
-- Case-study fields for projects
-- ============================================================
--
-- Adds the four things a reader actually wants to know about a project —
-- when, what your part was, what problem it solved, and what came of it.
-- Before this, a project was a title, a blurb and two links, which reads as a
-- link list rather than a portfolio.
--
-- Every column is nullable on purpose: existing rows stay valid, and the UI
-- only renders the case-study panel for projects that have something to show.
-- So this can be applied first and filled in gradually, project by project.
--
-- Safe to run more than once.
--
-- Run in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS year    INTEGER,
  ADD COLUMN IF NOT EXISTS role    TEXT,
  ADD COLUMN IF NOT EXISTS problem TEXT,
  ADD COLUMN IF NOT EXISTS outcome TEXT;

-- The app reads the view, never the table, so it has to be republished to
-- expose the new columns. CREATE OR REPLACE keeps existing grants intact.
CREATE OR REPLACE VIEW projects_with_details AS
SELECT
  p.id,
  p.title,
  p.description,
  p.demo_url,
  p.repo_url,
  p.status,
  p.sort_order,
  p.created_at,
  p.year,
  p.role,
  p.problem,
  p.outcome,
  -- Aggregate tags into an array
  COALESCE(
    ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
    '{}'
  ) AS tags,
  -- Get cover image URL (first is_cover=true, fallback to first image)
  (
    SELECT image_url FROM project_images pi
    WHERE pi.project_id = p.id
    ORDER BY pi.is_cover DESC, pi.sort_order ASC
    LIMIT 1
  ) AS cover_image
FROM projects p
LEFT JOIN project_tags pt ON pt.project_id = p.id
LEFT JOIN tags t ON t.id = pt.tag_id
GROUP BY p.id
ORDER BY p.sort_order ASC, p.id ASC;
