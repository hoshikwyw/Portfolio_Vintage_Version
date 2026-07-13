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
| **Settings** | 2 chrome themes + 6 wallpapers, persisted to `localStorage` |
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
| UI | Lucide React, Ant Design Icons |
| Carousel | Swiper |
| Hosting | Vercel (+ Speed Insights, serverless keep-alive) |

---

## Project Structure

Code is organised by **responsibility**, not by file type. A `@/` path alias
(configured in `vite.config.js` + `jsconfig.json`) points at `src/`, so imports
read `@/config/profile` instead of `../../../config/profile`.

```
src/
├── main.jsx                 # App entry — mounts providers (React Query)
├── App.jsx                  # Boot gate → Desktop
│
├── config/                  # ← single source of truth for content
│   ├── profile.js           #   name, contact, skills, timeline, résumé path
│   └── apps.js              #   window registry (id, icon, label, flags)
│
├── constants/
│   └── ui.js                # font stacks, wallpapers, themes
│
├── context/
│   └── OSContext.jsx        # open/minimized windows + wallpaper/theme  → useOS()
│
├── lib/
│   ├── supabase.js          # Supabase browser client
│   ├── queryClient.js       # React Query client config
│   └── actions.js           # downloadResume / openHireEmail / openGoogleSearch
│
├── services/                # framework-agnostic data fetchers
│   ├── projects.js
│   ├── projectImages.js
│   └── weather.js
│
├── hooks/                   # reusable React hooks
│   ├── useProjects.js       # React Query wrappers over services/
│   ├── useProjectImages.js
│   ├── useClock.js          # live clock
│   └── useWeather.js        # geolocation + weather
│
└── components/
    ├── os/                  # the desktop shell (chrome)
    │   ├── Desktop.jsx      #   composes the whole shell
    │   ├── BootSplash.jsx
    │   ├── WindowFrame.jsx  #   drag/resize/focus engine
    │   ├── Taskbar.jsx
    │   ├── StartMenu.jsx
    │   ├── DesktopIcons.jsx
    │   ├── DesktopContextMenu.jsx
    │   ├── StickyNote.jsx
    │   ├── QuickActions.jsx
    │   └── WelcomeDialog.jsx
    ├── ui/
    │   └── LockIcon.jsx     # shared padlock glyph
    ├── system/              # error + not-found handling
    │   ├── ErrorBoundary.jsx#   catches render crashes (root + per-window)
    │   ├── ErrorScreen.jsx  #   OS-styled crash dialog (retry / reload)
    │   └── NotFound.jsx     #   retro 404 for unknown windows
    ├── seo/
    │   └── SeoContent.jsx   # visually-hidden crawlable copy
    └── windows/             # the "apps" that render inside windows
        ├── registry.jsx     #   app id → window component
        ├── About.jsx
        ├── Projects.jsx
        ├── Gallery.jsx (+ .css)
        ├── Terminal.jsx
        ├── Settings.jsx
        └── admin/
            ├── Admin.jsx    #   auth gate
            ├── AdminLogin.jsx
            └── AdminDashboard.jsx
```

### Design notes

- **Content vs. code.** All personal copy lives in `src/config/profile.js`;
  every component reads from it. Edit your details in one place.
- **App registry.** `src/config/apps.js` is the one list of windows. The
  desktop icons, taskbar, start menu, and window chrome all derive from it, and
  `windows/registry.jsx` maps each app `id` to its component. Adding a window =
  one entry in each file.
- **Layered data flow.** `services/` fetch raw data → `hooks/` wrap them in
  React Query → components consume hooks. Supabase/query details never leak into
  the view layer.
- **Theming.** Chrome is driven by CSS custom properties (`--os-*`) in
  `index.css`; `OSContext` toggles the `data-theme` attribute for the glass theme.
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

# Lint
npm run lint
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
