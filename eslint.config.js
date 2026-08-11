import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },

  // Browser React source.
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    // Without this eslint-plugin-react warns on every run that it cannot tell
    // which React it is linting against.
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Mark identifiers referenced in JSX (incl. `m.div`) as used.
      'react/jsx-uses-vars': 'error',
      'react/jsx-uses-react': 'off', // not needed with the automatic JSX runtime
      // `ignoreRestSiblings` allows the `const { [id]: _drop, ...rest }` idiom
      // used to remove a key from state without mutating.
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // A missing key silently breaks reconciliation rather than erroring.
      'react/jsx-key': 'error',
      /*
       * A component declared inside another component's body is a new type on
       * every render, so React unmounts and remounts its whole subtree —
       * losing DOM state and any in-flight animation. Easy to write by
       * accident in a shell built from small nested pieces.
       */
      'react/no-unstable-nested-components': 'error',
      /*
       * Production builds strip these (see `esbuild.drop` in vite.config.js),
       * so a stray `console.log` never ships — but it should still be noticed.
       * Deliberate error reporting is allowed.
       */
      'no-console': ['warn', { allow: ['error', 'warn'] }],
    },
  },

  // Repo tooling (`scripts/`), which previously matched no config at all.
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      // These scripts report to the terminal; that is their whole job.
      'no-console': 'off',
    },
  },

  // Node serverless functions (Vercel `api/`).
  {
    files: ['api/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
]
