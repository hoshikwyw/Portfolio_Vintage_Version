#!/usr/bin/env node
/**
 * Verify that every theme defines the full set of `--os-*` tokens.
 *
 * The themes in `src/styles/index.css` work by overriding, on a `[data-theme]`
 * selector, every custom property that bare `:root` declares. A token that a
 * theme forgets does not fail loudly — it silently inherits the classic
 * theme's value, so a light theme quietly renders one dark colour and nobody
 * notices until a screenshot.
 *
 * This catches that: it diffs each theme block against `:root` in both
 * directions, reporting tokens a theme is missing and tokens it defines that
 * `:root` never declares (usually a typo, or a leftover).
 *
 * Run with `npm run lint:theme`.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const CSS_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'styles', 'index.css')

/**
 * Tokens deliberately shared by every theme rather than overridden.
 *
 * The motion scale is one set of easings and durations for the whole shell —
 * themes change how the OS looks, not how fast it moves.
 */
const SHARED_TOKENS = new Set([
  '--os-ease',
  '--os-ease-back',
  '--os-dur-press',
  '--os-dur-fast',
  '--os-dur-base',
])

const css = readFileSync(CSS_PATH, 'utf8')

/** Extract the declaration body of a top-level selector, matching braces. */
const blockOf = (selector) => {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`Could not find the "${selector}" block in ${CSS_PATH}`)

  const open = css.indexOf('{', start)
  let depth = 0
  let i = open
  for (; i < css.length; i += 1) {
    if (css[i] === '{') depth += 1
    else if (css[i] === '}') {
      depth -= 1
      if (depth === 0) break
    }
  }
  return css.slice(open + 1, i)
}

const tokensIn = (body) => new Set([...body.matchAll(/(--os-[\w-]+)\s*:/g)].map((m) => m[1]))

/** Every `[data-theme="…"]` that opens a top-level block, in source order. */
const themeNames = [...new Set([...css.matchAll(/\[data-theme="([^"]+)"\]\s*\{/g)].map((m) => m[1]))]

const base = tokensIn(blockOf(':root'))
const required = [...base].filter((token) => !SHARED_TOKENS.has(token))

let failed = false

console.log(`:root declares ${base.size} tokens (${required.length} themeable, ${SHARED_TOKENS.size} shared)\n`)

for (const name of themeNames) {
  const declared = tokensIn(blockOf(`[data-theme="${name}"]`))
  const missing = required.filter((token) => !declared.has(token))
  const unknown = [...declared].filter((token) => !base.has(token))

  if (missing.length || unknown.length) {
    failed = true
    console.log(`✗ [data-theme="${name}"] — ${declared.size}/${required.length}`)
    if (missing.length) {
      console.log(`    missing (silently inherits :root):\n      ${missing.join('\n      ')}`)
    }
    if (unknown.length) {
      console.log(`    not declared by :root (typo?):\n      ${unknown.join('\n      ')}`)
    }
  } else {
    console.log(`✓ [data-theme="${name}"] — ${declared.size}/${required.length} tokens`)
  }
}

if (failed) {
  console.error('\nTheme token check failed.')
  process.exit(1)
}

console.log('\nAll themes define the full token set.')
