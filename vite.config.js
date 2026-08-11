import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /*
         * Split the long-lived dependencies out of the app chunk.
         *
         * Everything used to land in one ~440 kB entry, so editing a single
         * component invalidated React and the router along with it. These
         * groups change only on a dependency bump, so returning visitors keep
         * them cached across deploys.
         *
         * Matched on the resolved path rather than by package name: the entry
         * imports `react-dom/client`, which a bare `['react-dom']` entry does
         * not match — React DOM silently stayed in the app chunk. The inner
         * `node_modules/<pkg>/` anchor is what makes this work under pnpm,
         * whose real paths look like `node_modules/.pnpm/react-dom@19/…`.
         *
         * Deliberately *not* split: lucide-react and swiper. Both are already
         * tree-shaken and reached only from lazily-imported windows, so naming
         * them here would pull them into the initial download instead.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined

          const inPackage = (...names) =>
            names.some((name) => id.includes(`node_modules/${name}/`) || id.includes(`node_modules\\${name}\\`))

          if (inPackage('react', 'react-dom', 'react-router', 'react-router-dom', 'scheduler')) {
            return 'react-vendor'
          }
          if (id.includes('@tanstack')) return 'query'

          /*
           * framer-motion is deliberately absent here. `AppProviders` loads its
           * feature bundle through a dynamic import, and naming it in a manual
           * chunk would pin the whole package into one statically-imported
           * chunk — undoing the split. Left alone, Rollup separates the `m`
           * component from the `domMax` features on its own.
           */

          return undefined
        },
      },
    },
  },
  esbuild: {
    // Strip debug output from production builds only — `vite dev` keeps it.
    drop: command === 'build' ? ['console', 'debugger'] : [],
  },
}))
