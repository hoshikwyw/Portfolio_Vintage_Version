# Vintage Kayv — OS-Themed Portfolio

A retro, desktop-OS styled portfolio that presents Khaing Wut Yi Win's (Kayv)
professional profile as an interactive operating system — a boot sequence,
draggable/resizable windows, a taskbar with a live clock and weather, a fake
terminal, and a Supabase-backed admin dashboard for managing projects.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, **Framer Motion**, and
**Supabase**.

> Live: https://kayv-portfolio-vintage-version.vercel.app/

---

## Features

| Window / Surface | What it does |
|---|---|
| **Boot Splash** | Animated OS startup sequence before the desktop mounts |
| **Desktop** | Wallpaper, animated gradient orbs, desktop shortcuts, sticky note, quick actions |
| **Windows** | Draggable + 8-direction resizable, minimize / fullscreen / close, cascading spawn, z-index focus |
| **About** | Profile, contact, education & experience timeline, skill bars |
| **Projects** | Swiper carousel of projects fetched from Supabase, with demo + source links |
| **Gallery** | Masonry image grid with a lightbox (Esc to close, download, view project) |
| **Terminal** | Fake CLI — `help`, `about`, `projects`, `skills`, `neofetch`, `whoami`, `cowsay`, and more |
| **Settings** | 3 chrome themes (+ follow-the-OS) and 6 wallpapers, persisted to `localStorage` |
| **Taskbar** | Start menu, running-app buttons, live weather widget, real-time clock |
| **Dashboard** | Supabase-auth-gated admin panel to manage projects and gallery images |

---

## Tech Stack

| Category | Tools |
|---|---|
| Framework | React 19, Vite 6 |
| Styling | Tailwind CSS v4, CSS custom properties (theming) |
| Animation | Framer Motion |
| Data | Supabase (Postgres + Auth), TanStack React Query v5 |
| UI | Lucide React |
| Carousel | Swiper |
| Hosting | Vercel (+ Speed Insights, serverless keep-alive) |

---

## Project Structure

Code is organised into four layers, each of which may only import from the ones
below it: **app** → **os** → **features** → **shared**. A `@/` path alias
(configured in `vite.config.js` + `jsconfig.json`) points at `src/`, so imports
read `@/shared/config/profile` instead of `../../../shared/config/profile`.

```
src/
├── main.jsx                 # Entry — mounts <AppProviders><App/>
│
├── app/                     # composition root
│   ├── App.jsx              #   route table
│   ├── AppProviders.jsx     #   ErrorBoundary → React Query → Router
│   └── routes.js            #   route paths
│
├── os/                      # the desktop shell ("kernel" + chrome)
│   ├── constants.js         #   sizes, cascade, Z_LAYERS stacking scale
│   ├── config/apps.js       #   window registry (id, icon, label, flags)
│   ├── context/             #   OSProvider — composes the hooks below
│   ├── hooks/               #   useOSActions/Windows/Appearance, useWindowManager,
│   │                        #   useAppearance, useWindowLayout, useResizable,
│   │                        #   useViewportSize
│   ├── registry/            #   app id → lazily-loaded window component
│   ├── services/weather.js
│   └── components/
│       ├── OSRoot, BootSplash
│       ├── desktop/         #   Desktop, icons, context menu, sticky note…
│       ├── taskbar/         #   Taskbar, StartMenu, SystemTray
│       └── window/          #   WindowLayer, Draggable/Fullscreen, chrome
│
├── features/                # vertical slices — one per window
│   ├── about/  projects/  gallery/  terminal/  settings/  admin/  seo/
│   └── …each with: api/ · hooks/ · components/ · index.js (window entry)
│
├── shared/                  # feature-agnostic building blocks
│   ├── config/              #   profile.js (all personal copy), theme.js
│   ├── constants/           #   fonts.js, palette.js
│   ├── lib/                 #   supabase, queryClient, browser side effects,
│   │                        #   motionFeatures (lazy Framer Motion bundle)
│   ├── hooks/               #   useClock, useOutsideClick
│   └── components/          #   ui/ (Panel, LockIcon) · feedback/ (errors, 404)
│
└── styles/index.css         # global CSS + --os-* theme variables
```

Repo tooling lives in [`scripts/`](scripts/) — currently
`check-theme-tokens.mjs`, run by `npm run lint:theme`.

### Design notes

- **Layering.** `shared/` knows nothing about anything; `features/` are
  independent of each other; `os/` reaches features only through its window
  registry; `app/` just wires it together. If an import points "up" a layer,
  something is in the wrong place.
- **Content vs. code.** All personal copy lives in `src/shared/config/profile.js`;
  every component reads from it. Edit your details in one place.
- **App registry.** `src/os/config/apps.js` is the one list of windows. The
  desktop icons, taskbar, start menu, and window chrome all derive from it, and
  `os/registry/windowRegistry.jsx` maps each app `id` to its component. Adding a
  window = one entry in each file.
- **Code splitting.** Each window is `lazy()`-imported by the registry, so a
  feature's dependencies (Swiper, Supabase, the admin surface) stay out of the
  initial bundle and load when that window is first opened. Feature barrels
  therefore export *only* the window, as the default. On top of that,
  `vite.config.js` splits React and React Query into long-lived vendor chunks
  so an app change does not invalidate them, and Framer Motion's feature bundle
  is loaded through `LazyMotion` *after* first paint — components use the
  lightweight `m` rather than `motion`, which `strict` mode enforces.
- **Layered data flow.** `api/` fetch raw data → `hooks/` wrap them in
  React Query → components consume hooks. Supabase/query details never leak into
  the view layer.
- **Theming.** Chrome is driven by CSS custom properties (`--os-*`) in
  `styles/index.css`. Each theme is one `[data-theme="…"]` block that overrides
  every token bare `:root` declares; `useAppearance` reflects the active theme
  onto `<html>`. `classic` is what `:root` renders, so it carries no attribute.
  The stored preference may be `system`, which resolves against
  `prefers-color-scheme` and follows it live. A small inline script in
  `index.html` stamps `data-theme` **before first paint** so the page never
  flashes the wrong theme — it duplicates the storage key and theme names from
  `shared/config/theme.js` on purpose, so change the two together.

  A theme that forgets a token silently inherits the classic value rather than
  failing, so `npm run lint:theme` diffs every theme block against `:root` and
  exits non-zero on a gap or a typo. Run it after touching the token set.

- **Re-render boundaries.** OS state is published as three contexts — actions,
  windows, appearance (`os/context/osContext.js`) — read via
  `useOSActions()` / `useOSWindows()` / `useOSAppearance()`. Take the narrowest
  one a component actually needs: a single merged context meant every window
  open, close and focus re-rendered the entire shell, including components that
  only ever call `openWindow`. The actions value never changes identity.
  `WindowContent` is memoized on `id` for the same reason, so focusing one
  window does not re-render the body of every other open window.
- **Resilience.** An `ErrorBoundary` wraps the app root (full-screen crash
  screen) and each window individually — a single broken window shows an inline
  error while the rest of the desktop keeps running. Unknown window ids render a
  retro `NotFound` (404) instead of a blank frame.
- **Routing.** React Router drives three routes: `/` (desktop), `/window/:appId`
  (a shareable deep link that opens one window on load), and `*` (a full-page
  404). `vercel.json` rewrites all non-`/api` paths to `index.html` so these
  resolve on direct load / refresh.

---

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (see below)
cp .env.example .env   # then fill in values

# 3. Start the dev server
npm run dev

# 4. Production build / preview
npm run build
npm run preview

# Lint (ESLint, plus the theme-token parity check)
npm run lint
npm run lint:theme
npm run check      # both
```

## Environment Variables

Create a `.env` file in the project root:

```dotenv
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

The site renders without these, but Projects/Gallery (Supabase) and the taskbar
weather widget need them to show live data.

---

## Backend (Supabase)

SQL for schema, the `projects_with_details` view, and auth policies lives in
[`supabase/`](supabase/):

- `migration.sql` — tables + the `projects_with_details` view
- `auth_policies.sql` — row-level security policies
- `update_images.sql` — gallery image helpers

Projects are read through the `projects_with_details` view (projects joined with
tags + cover image); gallery images come from `project_images` filtered by
`show_in_gallery`.

### Keep-alive

Free-tier Supabase projects pause after inactivity. [`api/keep-alive.js`](api/keep-alive.js)
is a Vercel serverless function that runs a minimal real query; point a daily
external cron (e.g. cron-job.org) at `/api/keep-alive` to keep the database warm.

---

## Security

- **No SQL injection surface.** All database access goes through the Supabase
  client (`.from().select().eq()…`), which sends **parameterized** requests —
  SQL strings are never concatenated from input. No user input flows into a
  query anywhere in the app.
- **RLS is the boundary.** The browser uses the public **anon** key by design;
  read/write permissions are enforced by Supabase **Row Level Security**
  (`supabase/auth_policies.sql`), not by client code. The admin dashboard is
  gated by Supabase Auth.
- **XSS-safe rendering.** React escapes all interpolated values (including
  terminal input); there is no `dangerouslySetInnerHTML` or `eval`.
- **Hardened keep-alive endpoint** (`api/keep-alive.js`): accepts `GET`/`HEAD`
  only, runs a fully static query, never leaks error details to the caller, and
  — when `CRON_SECRET` is set — requires a shared secret (via
  `Authorization: Bearer …` or `?secret=`) so the public URL can't be abused.
- **Security headers** for every response via `vercel.json`:
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
  `Referrer-Policy`, and a `Permissions-Policy` that keeps geolocation (needed
  by the weather widget) but disables camera/microphone.

Optional: set `CRON_SECRET` in your Vercel + cron provider to lock down the
keep-alive endpoint.

## Accessibility & Motion

- **Reduced motion.** The looping background animations — the drifting gradient
  orbs, the skeleton shimmer, the terminal's thinking dots — stop under
  `prefers-reduced-motion: reduce`. Short hover and press transitions are
  responses to direct input and are left alone.
- **Contrast.** The light theme's text tokens were checked against WCAG AA for
  the pairs that carry meaning: body text ≈15:1 on window content, secondary
  ≈7.3:1, muted ≈4.6:1, and white window titles ≈4.8:1 at the lightest stop of
  the title-bar gradient (they are 12px, so they need the full 4.5:1).
- **Colour scheme.** Each theme declares `color-scheme`, so native scrollbars
  and form controls follow the chosen theme rather than the OS default.

---

## Deployment

Deployed on **Vercel**. `npm run build` outputs a static SPA to `dist/`; the
`api/` directory is deployed as serverless functions automatically.
`vercel.json` provides the SPA rewrite (so client routes resolve) and the
security headers above.

---

## Author

**Khaing Wut Yi Win (Kayv)** — Creative Frontend Developer based in Yangon, Myanmar

- Portfolio: https://kayv-portfolio-vintage-version.vercel.app/
- GitHub: https://github.com/hoshikwyw
