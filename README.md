# Vintage Kayv — OS-Themed Portfolio

A retro OS-styled portfolio website that presents my professional profile as an interactive desktop environment, complete with draggable windows, a taskbar, boot splash screen, and a terminal.

Built with **React 19**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

## Features

- **Boot Splash Screen** — Animated OS startup sequence
- **Draggable & Resizable Windows** — 8-directional resize handles, minimize/fullscreen/close controls, z-index focus management
- **Home Window** — About me, education, experience timeline, skills with progress bars, and contact info
- **Projects Window** — Swiper carousel showcasing projects fetched from Supabase, with live demo and source code links
- **Gallery Window** — Visual showcase of project work
- **Terminal Window** — CLI-style interface with commands (`help`, `about`, `projects`, `skills`, `clear`)
- **Settings Window** — 6 wallpaper themes (persisted to localStorage) and system info
- **Taskbar** — Start menu, open window indicators, live weather widget, and real-time clock
- **3D Character** — Three.js model with waving animation via React Three Fiber

## Tech Stack

| Category | Tools |
|---|---|
| Framework | React 19, Vite |
| Styling | Tailwind CSS, custom CSS variables |
| Animation | Framer Motion, Lottie |
| 3D | Three.js, React Three Fiber, Drei |
| Data | Supabase, TanStack React Query |
| Routing | React Router DOM |
| UI | Lucide React, Ant Design Icons, Heroicons |
| Other | Lenis (smooth scroll), Swiper, Vercel Speed Insights |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENWEATHER_API_KEY=your_openweather_api_key
```

## Author

**Khaing Wut Yi Win (Kayv)** — Creative Frontend Developer based in Yangon, Myanmar
