-- ============================================================
-- Add six projects (October 2026)
-- ============================================================
--
-- Kayv, Place Map, Promptbook, Eain, FlexiManage and the Universal AI
-- Project Starter, written up from each repository's README and docs.
--
-- They go to the top of the list, above the existing projects, in the order
-- below. Reorder or edit any of them afterwards in the Dashboard.
--
-- Safe to run more than once: a project whose repo_url is already in the
-- table is skipped, and tags are only added if missing.
--
-- Run in the Supabase SQL editor (Dashboard -> SQL Editor -> New query).

BEGIN;

-- 1. Tags the new projects use that the table may not have yet.
INSERT INTO tags (name) VALUES
  ('Next.js'), ('React'), ('TypeScript'), ('Tailwind CSS'), ('Supabase'),
  ('PostgreSQL'), ('Vite'), ('React Native'), ('Expo'), ('Capacitor'),
  ('Gemini API'), ('Telegram Bot API'), ('Hono'), ('MapLibre'), ('MCP'),
  ('OpenAPI'), ('next-intl'), ('shadcn/ui'), ('Claude Code'), ('AI Workflow')
ON CONFLICT (name) DO NOTHING;

-- 2. The projects, placed before the current first one.
WITH base AS (
  SELECT COALESCE(MIN(sort_order), 0) AS first_slot FROM projects
),
incoming (n, title, description, demo_url, repo_url, status, year, role, problem, outcome) AS (
  VALUES
  (1, 'Kayv — Personal AI Assistant',
   'A personal AI assistant you talk to by voice or text, and reach from Telegram too. It remembers the people who matter and reminds you of birthdays before you forget.',
   NULL,
   'https://github.com/hoshikwyw/myLittleKayvv',
   true, 2026,
   'Personal project — designed and built end to end',
   'Most assistants forget everything between chats. In Kayv the memory and the reminder engine are the product: every fact about a person links back to the message it came from, and you can review, correct or forget any of it.',
   'A working web app and Android app with Google Calendar, Maps and Search tools, a daily brief, and reminders sent by Telegram or email from a cron job. Falls back between AI providers when one runs out, and runs entirely on free tiers.'),

  (2, 'Place Map',
   'A places directory with one API and four clients: a Telegram bot, a public website, an Expo mobile app and an admin dashboard. In English and Burmese.',
   'https://place-map-lilac.vercel.app/docs',
   'https://github.com/hoshikwyw/Place-Map',
   true, 2026,
   'Personal project — designed and built end to end',
   'Keep a bot, a website and a native app showing the same places without three copies of the data, on zero budget and with no credit card.',
   'Nothing talks to the database except one REST API; every client is a plain HTTP client sharing the same Zod schemas, so a schema change breaks the build instead of production. Maps use MapLibre with free OpenStreetMap tiles, and the mobile app works offline from a cached copy.'),

  (3, 'Promptbook',
   'Ready-to-copy AI image prompts for ChatGPT, Gemini, Midjourney and more. Pick who it is for and which AI you use, then copy and paste.',
   'https://ai-prompt-image-generator-five.vercel.app',
   'https://github.com/hoshikwyw/AI_prompt_image_generator',
   true, 2026,
   'Personal project — designed and built end to end',
   'Good image prompts are scattered across posts and rarely say which AI they work in, or whether you need to attach your own photo.',
   'A searchable library across 13 categories with sample images, filters you can share as a link, and an Android app. It also offers a free public API — REST, an OpenAPI 3.1 spec and an MCP server for AI assistants — cached at the CDN so it stays free to run.'),

  (4, 'Eain',
   'Digital gifts that feel like home: build a personal gift page from a template — messages, photos and questions — and share it with a link. The person receiving it needs no account. In English and Burmese.',
   NULL,
   'https://github.com/hoshikwyw/eain-project',
   true, 2026,
   'Personal project — designed and built end to end',
   'Gift pages carry private messages and photos, and messaging apps open every link to build a preview, which would mark a gift as opened before anyone saw it.',
   'A gift only counts as opened when the receiver taps "Open your gift". Gift pages are private, unindexed and get a generic link preview. Publishing, replies and a points system each run as one atomic Postgres function, covered by row-level security tests, with an admin area for templates and reports.'),

  (5, 'FlexiManage',
   'A configurable management app for small businesses: each business gets its own workspace and shapes its records with reusable modules, custom fields, forms and tables.',
   NULL,
   'https://github.com/hoshikwyw/FlexiManage',
   false, 2026,
   NULL, NULL, NULL),

  (6, 'Universal AI Project Starter',
   'A reusable template for building software with AI coding assistants such as Claude Code, Codex and Cursor: shared rules, role checklists and a step-by-step prompt workflow with approval gates.',
   NULL,
   'https://github.com/hoshikwyw/universal-ai-project-template',
   true, 2026,
   'Personal project — designed and written end to end',
   'AI assistants write code fast, but without shared rules every project ends up with a different quality bar, and changes land without a plan or proof that they work.',
   'One AGENTS.md that every assistant reads, nine role checklists from architect to security engineer, and eight ordered prompts from discovery to release check, each needing approval before code changes. Works with any language or framework.')
),
inserted AS (
  INSERT INTO projects (title, description, demo_url, repo_url, status, sort_order, year, role, problem, outcome)
  SELECT i.title, i.description, i.demo_url, i.repo_url, i.status,
         base.first_slot - 7 + i.n, i.year, i.role, i.problem, i.outcome
  FROM incoming i CROSS JOIN base
  WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.repo_url = i.repo_url)
  RETURNING id, repo_url
)
-- 3. Their tags.
INSERT INTO project_tags (project_id, tag_id)
SELECT ins.id, t.id
FROM inserted ins
JOIN (VALUES
  ('https://github.com/hoshikwyw/myLittleKayvv', 'Next.js'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'TypeScript'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'Tailwind CSS'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'PostgreSQL'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'Gemini API'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'Telegram Bot API'),
  ('https://github.com/hoshikwyw/myLittleKayvv', 'Capacitor'),

  ('https://github.com/hoshikwyw/Place-Map', 'TypeScript'),
  ('https://github.com/hoshikwyw/Place-Map', 'Next.js'),
  ('https://github.com/hoshikwyw/Place-Map', 'React Native'),
  ('https://github.com/hoshikwyw/Place-Map', 'Expo'),
  ('https://github.com/hoshikwyw/Place-Map', 'Hono'),
  ('https://github.com/hoshikwyw/Place-Map', 'Supabase'),
  ('https://github.com/hoshikwyw/Place-Map', 'MapLibre'),
  ('https://github.com/hoshikwyw/Place-Map', 'Telegram Bot API'),

  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'Next.js'),
  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'TypeScript'),
  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'Supabase'),
  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'Capacitor'),
  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'MCP'),
  ('https://github.com/hoshikwyw/AI_prompt_image_generator', 'OpenAPI'),

  ('https://github.com/hoshikwyw/eain-project', 'Next.js'),
  ('https://github.com/hoshikwyw/eain-project', 'TypeScript'),
  ('https://github.com/hoshikwyw/eain-project', 'Tailwind CSS'),
  ('https://github.com/hoshikwyw/eain-project', 'Supabase'),
  ('https://github.com/hoshikwyw/eain-project', 'PostgreSQL'),
  ('https://github.com/hoshikwyw/eain-project', 'next-intl'),

  ('https://github.com/hoshikwyw/FlexiManage', 'React'),
  ('https://github.com/hoshikwyw/FlexiManage', 'TypeScript'),
  ('https://github.com/hoshikwyw/FlexiManage', 'Vite'),
  ('https://github.com/hoshikwyw/FlexiManage', 'Tailwind CSS'),
  ('https://github.com/hoshikwyw/FlexiManage', 'shadcn/ui'),
  ('https://github.com/hoshikwyw/FlexiManage', 'Supabase'),

  ('https://github.com/hoshikwyw/universal-ai-project-template', 'Claude Code'),
  ('https://github.com/hoshikwyw/universal-ai-project-template', 'AI Workflow')
) AS pt (repo_url, tag) ON pt.repo_url = ins.repo_url
JOIN tags t ON t.name = pt.tag
ON CONFLICT DO NOTHING;

-- 4. Promptbook's cover: the social preview image its own site serves.
INSERT INTO project_images (project_id, image_url, is_cover, sort_order)
SELECT p.id, 'https://ai-prompt-image-generator-five.vercel.app/og', true, 0
FROM projects p
WHERE p.repo_url = 'https://github.com/hoshikwyw/AI_prompt_image_generator'
  AND NOT EXISTS (SELECT 1 FROM project_images pi WHERE pi.project_id = p.id);

COMMIT;

-- Check: the six new projects with their tags and cover.
SELECT title, status, sort_order, tags, cover_image
FROM projects_with_details
WHERE repo_url IN (
  'https://github.com/hoshikwyw/myLittleKayvv',
  'https://github.com/hoshikwyw/Place-Map',
  'https://github.com/hoshikwyw/AI_prompt_image_generator',
  'https://github.com/hoshikwyw/eain-project',
  'https://github.com/hoshikwyw/FlexiManage',
  'https://github.com/hoshikwyw/universal-ai-project-template'
)
ORDER BY sort_order;
