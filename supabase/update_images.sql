-- ============================================================
-- Update: Image upload support + gallery toggle
-- Run this in Supabase SQL Editor
-- ============================================================

-- STEP 1: Add show_in_gallery column
ALTER TABLE project_images ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT true;

-- STEP 2: Storage policies for project-images bucket
-- IMPORTANT: First create the bucket manually in Dashboard > Storage > New Bucket
--   Name: project-images
--   Public: YES
-- Then run these policies:

CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Auth upload storage" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Auth delete storage" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'project-images');

-- STEP 3: Update the view to include show_in_gallery
DROP VIEW IF EXISTS projects_with_details;

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
  COALESCE(
    ARRAY_AGG(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL),
    '{}'
  ) AS tags,
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
