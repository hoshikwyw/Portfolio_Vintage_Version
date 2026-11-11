-- ============================================================
-- Lock the portfolio's writes to its own admin
-- ============================================================
--
-- Until now every write policy said `TO authenticated USING (true)`: any
-- signed-in user could edit the portfolio. That was safe only while the
-- project had exactly one user. This project now also hosts Yumli, which signs
-- in with its own service account, so access is granted per app instead:
--
--   public.app_access     which user may write to which app
--   has_app_access(app)   used by every write policy
--
-- The portfolio's public reads do not change.
--
-- RUN THIS FIRST, before creating Yumli's service account: it grants the
-- 'portfolio' app to the one user the project has now (your admin login), and
-- stops with an error if it finds more or fewer than one.
--
-- Safe to run more than once. Run in Dashboard -> SQL Editor -> New query.

BEGIN;

-- 1. Who may write to which app. No policies, and no grants to the API roles:
--    nobody can read or change this table through the API.
CREATE TABLE IF NOT EXISTS public.app_access (
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  app     text NOT NULL,
  PRIMARY KEY (user_id, app)
);
ALTER TABLE public.app_access ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_access FROM anon, authenticated;

-- 2. The check every write policy uses. SECURITY DEFINER so it can read
--    app_access, which the caller cannot; it only ever answers yes or no.
CREATE OR REPLACE FUNCTION public.has_app_access(target_app text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.app_access
    WHERE user_id = auth.uid() AND app = target_app
  );
$$;
REVOKE ALL ON FUNCTION public.has_app_access(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_app_access(text) TO authenticated;

-- 3. Grant the portfolio to the existing admin login.
DO $$
DECLARE
  user_count int;
BEGIN
  IF EXISTS (SELECT 1 FROM public.app_access WHERE app = 'portfolio') THEN
    RETURN; -- already granted on an earlier run
  END IF;

  SELECT count(*) INTO user_count FROM auth.users;
  IF user_count <> 1 THEN
    RAISE EXCEPTION
      'Expected exactly one user (the portfolio admin), found %. Grant it by hand instead: INSERT INTO public.app_access SELECT id, ''portfolio'' FROM auth.users WHERE email = ''<admin email>'';',
      user_count;
  END IF;

  INSERT INTO public.app_access (user_id, app)
  SELECT id, 'portfolio' FROM auth.users;
END $$;

-- 4. Replace every portfolio write policy (whatever it is named) with one
--    that checks app access. Read policies are left alone.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('projects', 'tags', 'project_tags', 'project_images')
      AND cmd <> 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;

  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND cmd <> 'SELECT'
      AND (coalesce(qual, '') || coalesce(with_check, '')) LIKE '%project-images%'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY "Portfolio admin insert projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin update projects" ON public.projects
  FOR UPDATE TO authenticated USING (public.has_app_access('portfolio')) WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin delete projects" ON public.projects
  FOR DELETE TO authenticated USING (public.has_app_access('portfolio'));

CREATE POLICY "Portfolio admin insert tags" ON public.tags
  FOR INSERT TO authenticated WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin update tags" ON public.tags
  FOR UPDATE TO authenticated USING (public.has_app_access('portfolio')) WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin delete tags" ON public.tags
  FOR DELETE TO authenticated USING (public.has_app_access('portfolio'));

CREATE POLICY "Portfolio admin insert project_tags" ON public.project_tags
  FOR INSERT TO authenticated WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin delete project_tags" ON public.project_tags
  FOR DELETE TO authenticated USING (public.has_app_access('portfolio'));

CREATE POLICY "Portfolio admin insert project_images" ON public.project_images
  FOR INSERT TO authenticated WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin update project_images" ON public.project_images
  FOR UPDATE TO authenticated USING (public.has_app_access('portfolio')) WITH CHECK (public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin delete project_images" ON public.project_images
  FOR DELETE TO authenticated USING (public.has_app_access('portfolio'));

-- Storage: the bucket stays public for viewing; only the admin may change it.
CREATE POLICY "Portfolio admin upload images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin update images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_app_access('portfolio'))
  WITH CHECK (bucket_id = 'project-images' AND public.has_app_access('portfolio'));
CREATE POLICY "Portfolio admin delete images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND public.has_app_access('portfolio'));

COMMIT;

-- Check: should list your admin email with app = 'portfolio'.
SELECT u.email, a.app FROM public.app_access a JOIN auth.users u ON u.id = a.user_id;
