-- ============================================================
-- STEP 1: Create your admin user in Supabase Dashboard
-- Go to: Authentication > Users > Add User
-- Email: khaingwutyiwin1712@gmail.com (or any email)
-- Password: your chosen password
-- ============================================================

-- STEP 2: Add write policies (only authenticated users can modify)
-- Run this in Supabase SQL Editor
-- ============================================================

-- Projects: authenticated users can insert/update/delete
CREATE POLICY "Auth insert projects" ON projects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update projects" ON projects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete projects" ON projects
  FOR DELETE TO authenticated USING (true);

-- Tags: authenticated users can insert/delete
CREATE POLICY "Auth insert tags" ON tags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth delete tags" ON tags
  FOR DELETE TO authenticated USING (true);

-- Project Tags: authenticated users can insert/delete
CREATE POLICY "Auth insert project_tags" ON project_tags
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth delete project_tags" ON project_tags
  FOR DELETE TO authenticated USING (true);

-- Project Images: authenticated users can insert/update/delete
CREATE POLICY "Auth insert project_images" ON project_images
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update project_images" ON project_images
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth delete project_images" ON project_images
  FOR DELETE TO authenticated USING (true);
