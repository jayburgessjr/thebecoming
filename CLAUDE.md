# CLAUDE.md — Agent Operating System
## The Way of Becoming · jayburgessjr/thebecoming

> This file is the agent's constitution. Read it in full before touching any code.
> Update it at the end of every session using the Self-Correction Contract (§5).
> Also read **GUARDRAILS.md** — operational safety limits, blast radius rules, and recovery protocol.

---

## §1 · Mission & Constraints

### Primary Objective
Maintain, debug, and evolve *The Way of Becoming* — a Next.js App Router book website for Jay Burgess — preserving the visual design system (shadcn/ui + Tailwind v4, DM Sans + Inter font stack, OKLCH warm neutral color palette, floating pill navbar) established in the 2026-04-25 redesign.

### Stack Snapshot
| Layer | Technology |
|---|---|
| Framework | Next.js 16.x · App Router · TypeScript |
| Styling | Tailwind CSS v4 (CSS-first, no tailwind.config.js) + shadcn/ui (new-york style) |
| UI Components | shadcn/ui via `components/ui/` — Button, Card, Input, Label, Badge |
| Backend | Supabase (project: `dabhfvdgcsmzlorbgdjq`) |
| Auth | sessionStorage-based (`the-way-of-becoming-session`) |
| Theme | next-themes (`attribute="class"`, defaultTheme="light") |
| Hosting target | Netlify |
| Repo | github.com/jayburgessjr/thebecoming |

### Autonomous — Act Without Asking
- Edit any file in `app/`, `components/`, `lib/`, `content/`, `public/`
- Fix bugs, type errors, CSS spacing/visual issues
- Add or update CSS in `app/globals.css` preserving the design system
- Run `npm run dev`, `npm run build`, `npm run lint`
- Run read-only Supabase MCP tools (`list_tables`, `get_advisors`, `execute_sql` SELECT only)
- Commit staged changes when the user explicitly requests a commit
- Clear `.next/` cache when stale-bundle errors appear

### Requires Human Approval Before Proceeding
- **Any Supabase DDL** (`apply_migration`, schema changes, policy changes) — state the exact SQL first
- **`git push`** — confirm branch and remote before pushing
- **Deleting files** that are not clearly temporary (`.next/`, build artifacts)
- **Installing new npm dependencies** — list package name, version, and reason
- **Changes to `.env.local`** — read it aloud (redacted) and confirm before editing
- **Any change to `supabase/migrations/`** — these are append-only; never edit a past migration
- **Modifying the visual design** — the OKLCH color palette, DM Sans + Inter fonts, shadcn component style, and floating pill navbar are frozen unless Jay explicitly requests a redesign

### Hard Prohibitions (Never Do)
- Never commit `.env.local` or any file containing real keys
- Never run `git push --force` on `main`
- Never use `--no-verify` to skip hooks
- Never add additional UI component libraries beyond the existing shadcn/ui setup (no chakra, MUI, etc.)
- Never redesign pages; only fix or extend what exists
- Never expose `NEXT_PUBLIC_SUPABASE_ANON_KEY` in client-side code outside of the intended `supabase-server.ts` pattern

---

## §2 · Tool Permissions

### Read / Edit / Write / Glob / Grep
| Tool | Approved Use | Limits |
|---|---|---|
| `Read` | Any source file before editing | Always read before editing — never edit blind |
| `Edit` | Targeted in-place edits with sufficient context to be unique | Prefer `Edit` over `Write` for existing files |
| `Write` | New files only, or full rewrites explicitly requested | Never overwrite `globals.css` without reading it first |
| `Glob` | File discovery by pattern | Use before searching to confirm files exist |
| `Grep` | Content search across codebase | Prefer over Bash `grep`; scope to relevant dirs |

### Bash
| Command Pattern | Approved | Notes |
|---|---|---|
| `npm run dev / build / lint` | ✅ | Standard; build to catch type errors |
| `rm -rf .next` | ✅ | Only for stale cache; confirm if other dirs |
| `git status / diff / log` | ✅ | Read-only git ops, always allowed |
| `git add / commit` | ✅ when asked | Stage specific files; never `git add -A` blindly |
| `git push` | ⚠️ Confirm first | State branch + remote before pushing |
| `git reset --hard` | ❌ Prohibited | Too destructive without explicit instruction |
| `find / ls` | Avoid | Use `Glob` instead |
| `grep / rg` | Avoid | Use `Grep` tool instead |
| Arbitrary shell scripts | ❌ | Ask first |

### Supabase MCP
| Tool | Approved | Constraint |
|---|---|---|
| `list_tables` | ✅ Always | Read-only |
| `execute_sql` (SELECT) | ✅ Always | Read-only queries only |
| `get_advisors` | ✅ Always | Run after any DDL |
| `get_publishable_keys` | ✅ Always | Keys go into `.env.local` only |
| `apply_migration` | ⚠️ Show SQL + confirm | Append-only; describe impact first |
| `create_project / pause_project` | ❌ Never autonomous | Explicit instruction required |

### Web Tools
| Tool | Approved Use |
|---|---|
| `WebFetch` | Next.js docs, Supabase docs, error lookup — not general browsing |
| `WebSearch` | Diagnosing unfamiliar errors; cite the source in your response |

### Agent (Subagents)
- Use `Explore` subagent for broad codebase audits across many files
- Use `Plan` subagent before starting multi-file refactors
- Never spawn subagents for tasks completable in 1–3 direct tool calls

---

## §3 · Memory Architecture

### What Lives in `memory/` (Persist Across Sessions)

| File | Content | When to Update |
|---|---|---|
| `user_role.md` | Jay's background, preferences, collaboration style | When new preferences are revealed |
| `feedback_*.md` | Corrections and confirmed approaches from Jay | Every time Jay corrects or validates a non-obvious choice |
| `project_*.md` | Active goals, deadlines, architectural decisions | When goals shift or decisions are made |

### What to Summarize (Compress, Don't Delete)
- Long debugging sessions → keep the root cause and fix, discard the intermediate steps
- Error messages → keep the pattern and resolution, not the full stack trace

### What to Discard After Each Session
- Intermediate tool results (raw JSON, large file reads)
- Stale task states from the current session
- Browser console errors that were caused by extension interference (Grammarly, etc.)

### Session-Start Protocol
Before touching any code, in this order:
1. Read `CLAUDE.md` (this file) — full
2. Read `MEMORY.md` — check for recent feedback or project state changes
3. Run `git status` — confirm working tree state
4. Run `npm run build` if the user reports errors — catch type errors before guessing
5. Read only the files directly relevant to the reported issue — do not pre-load the entire codebase

### Known Session Patterns (Hardened from Experience)
- **Stale `.next` cache** causes webpack chunk 404s and `Cannot read properties of undefined (reading 'call')` errors. Fix: `rm -rf .next` then restart dev server. Do not debug the bundle — just clear it.
- **Browser extension errors** (`mce-autosize-textarea`, `No Listener: tabs:outgoing.message.ready`) are Grammarly/MCE. Never investigate these as app bugs.
- **White page on `/hub`** is `SessionGuard` returning `null` before `useEffect` fires. The fix (`<div className="min-h-screen bg-background" />`) is already in place.
- **Supabase key**: `.env.local` must use the legacy JWT anon key, not the `sb_publishable_*` key. The JWT key was retrieved in session and applied.
- **React 19 `useRef`**: requires an explicit initial argument — `useRef<T | undefined>(undefined)` not `useRef<T>()`. Hits at build time.
- **Tailwind v4**: no `tailwind.config.ts` — all config is CSS-first in `globals.css`. Uses `@import "tailwindcss"`, `@custom-variant dark`, and `@theme inline {}`. `@tailwindcss/postcss` is the PostCSS plugin (not `tailwindcss`). Autoprefixer is built in, do not add it to postcss config.
- **shadcn dark mode**: next-themes with `attribute="class"` adds `.dark` to `<html>`. The `@custom-variant dark (&:is(.dark *))` in globals.css wires this to Tailwind's `dark:` variant.
- **Design system tokens**: All colors are OKLCH. Primary is warm gold/cream `oklch(0.88 0.06 86.47)`. Edit in `:root` / `.dark` blocks in `globals.css` — never hardcode color values in components.

---

## §4 · Context Budget Rules

### Always in Context (System Prompt / CLAUDE.md)
- This file (`CLAUDE.md`) — the full text
- `MEMORY.md` index — loaded automatically
- Active task list (if using TaskCreate)

### Load on Demand (Only When Relevant)
- Individual component files — read only when editing that component
- `app/globals.css` — read before any CSS change
- `content/chapters.ts` — only when working on chapter content or reader
- `lib/session.ts`, `lib/types.ts` — only when touching auth or type definitions
- `supabase/migrations/` — only when discussing schema

### Never Pre-Load
- `node_modules/` contents
- `.next/` build artifacts
- `package-lock.json`
- Full `app/globals.css` when only checking one class

### Token Budget Rules
| Source | Limit | Action When Exceeded |
|---|---|---|
| Single file read | 200 lines default | Use `offset`+`limit` to read relevant section only |
| Bash command output | ~500 lines | Pipe through `tail`, `head`, or `grep` before returning |
| Subagent result | Summarize top findings | Never paste raw subagent output into reasoning |
| Grep results | 50 matches | Re-scope the pattern if too many hits |

### Compression Trigger
If a tool result exceeds ~2,000 tokens and is not directly actionable, summarize it into 3–5 bullet points and discard the raw output before continuing.

---

## §5 · Self-Correction Contract

After every major action (file edit, migration, git push, bug fix), run this review silently before responding to Jay:

### Checklist
```
[ ] OUTPUT MATCH  — Does what I produced match what Jay asked for?
                    If not, what drifted and why?

[ ] DESIGN INTACT — Did I preserve the ink/parchment/gold system,
                    font stack, and animation behavior?
                    Did I add any classes, libraries, or styles not
                    present in the original HTML?

[ ] SCOPE CREEP   — Did I change anything beyond what was asked?
                    (extra refactors, renamed variables, added comments,
                    new abstractions — all are scope creep unless asked)

[ ] SECRETS SAFE  — Did any edit risk exposing .env.local or Supabase keys?
                    Is the anon key only in supabase-server.ts?

[ ] GUARDRAILS    — Did I approach any Hard Prohibition?
                    (pushed without confirmation, edited a migration, etc.)

[ ] HARDEN THIS FILE — Is there a pattern from this session that should be
                    added to §3 Known Session Patterns or §1 Constraints?
                    If yes, update CLAUDE.md before the session ends.
```

### Hardening Protocol
If the checklist surfaces a gap:
1. Add a rule to the relevant section of this file
2. Commit the updated `CLAUDE.md` alongside the code change
3. Add a one-line entry to `MEMORY.md` pointing to the new rule

### Signals That Require a Pause
Stop and ask Jay before continuing if:
- The fix requires changing more than 3 files you haven't read yet
- A build error references a file that doesn't exist in the tree
- A Supabase query returns unexpected data that contradicts memory
- Jay's request contradicts a Hard Prohibition — name the conflict explicitly

---

*Last updated: 2026-04-06 · Session: initial CLAUDE.md creation*
*Next review trigger: first session after Vercel deploy*
