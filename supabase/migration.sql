-- ============================================================
-- KAYV OS Portfolio — Database Schema Migration
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- STEP 1: Drop old tables
-- ============================================================
DROP TABLE IF EXISTS "PrjImages" CASCADE;
DROP TABLE IF EXISTS "Projects" CASCADE;

-- STEP 2: Create new normalized schema
-- ============================================================

-- Projects table
CREATE TABLE projects (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  demo_url    TEXT,
  repo_url    TEXT,
  status      BOOLEAN DEFAULT true,      -- true = live, false = coming soon
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Tags table (unique tech/skill tags)
CREATE TABLE tags (
  id    SERIAL PRIMARY KEY,
  name  TEXT UNIQUE NOT NULL
);

-- Junction table: project <-> tags (many-to-many)
CREATE TABLE project_tags (
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  tag_id      INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Project images (one-to-many: each image belongs to one project)
CREATE TABLE project_images (
  id          SERIAL PRIMARY KEY,
  project_id  INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  is_cover    BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- STEP 3: Indexes for performance
-- ============================================================
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON project_tags(tag_id);
CREATE INDEX idx_projects_sort_order ON projects(sort_order);
CREATE INDEX idx_projects_status ON projects(status);

-- STEP 4: Row Level Security (RLS)
-- ============================================================
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public read access (portfolio is public)
CREATE POLICY "Public read projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Public read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public read project_tags" ON project_tags
  FOR SELECT USING (true);

CREATE POLICY "Public read project_images" ON project_images
  FOR SELECT USING (true);

-- STEP 5: Seed data — Tags
-- ============================================================
INSERT INTO tags (name) VALUES
  ('React'),
  ('Next.js'),
  ('TypeScript'),
  ('JavaScript'),
  ('Tailwind CSS'),
  ('Node.js'),
  ('Supabase'),
  ('Firebase'),
  ('GSAP'),
  ('Three.js'),
  ('React Native'),
  ('MongoDB'),
  ('PostgreSQL'),
  ('Vite'),
  ('Framer Motion');

-- STEP 6: Helper view — projects with tags and cover image
-- ============================================================
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

-- ============================================================
-- DONE! Now insert your projects data via Supabase Dashboard
-- or use the INSERT statements below as a template:
-- ============================================================

-- Example: Insert a project
-- INSERT INTO projects (title, description, demo_url, repo_url, status, sort_order)
-- VALUES ('My Project', 'A cool project', 'https://demo.com', 'https://github.com/...', true, 1);

-- Example: Link tags to a project (assuming project id=1, tag ids from step 5)
-- INSERT INTO project_tags (project_id, tag_id) VALUES (1, 1), (1, 5);  -- React + Tailwind

-- Example: Add images to a project
-- INSERT INTO project_images (project_id, image_url, is_cover, sort_order)
-- VALUES (1, 'https://your-storage-url/img1.jpg', true, 0);
