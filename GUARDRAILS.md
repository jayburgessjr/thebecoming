# GUARDRAILS.md — Agent Safety System
## The Way of Becoming · jayburgessjr/thebecoming

> Read this file at session start alongside CLAUDE.md.
> These rules are operational constraints, not suggestions.
> When in doubt, the more restrictive rule wins.

---

## §1 · Autonomous Action Whitelist

The agent may take the following actions **without asking Jay first**.
If an action is not on this list, the agent must ask before proceeding.

### File System — Read
```
✅ Read any file in:
   app/
   components/
   lib/
   content/
   public/
   supabase/migrations/   (read-only — never edit existing migrations)
   scripts/
   *.config.ts / *.config.mjs
   tsconfig.json
   tailwind.config.ts
   package.json           (read-only for inspection)
   .env.example           (safe — no real secrets)
   CLAUDE.md
   GUARDRAILS.md
   MEMORY.md
```

### File System — Write / Edit
```
✅ Edit files in:
   app/                   (pages, layouts, API routes)
   components/            (all React components)
   lib/                   (session, supabase-server, types)
   content/chapters.ts    (chapter content updates)

✅ Create new files in:
   app/                   (new routes/pages)
   components/            (new components)
   lib/                   (new utility modules)
   supabase/migrations/   (NEW migration files only — never edit existing)

✅ Write to:
   public/                (only static assets — fonts, images, PDF)
   .env.example           (template only — no real values)
   CLAUDE.md              (end-of-session hardening only)
   GUARDRAILS.md          (end-of-session hardening only)
```

### Bash Commands — Autonomous
```
✅ npm run dev
✅ npm run build
✅ npm run lint
✅ rm -rf .next           (stale cache only)
✅ git status
✅ git diff
✅ git log --oneline -10
✅ git branch
✅ git add <specific-file>  (named files only — never git add -A or git add .)
```

### Supabase MCP — Autonomous
```
✅ list_tables            (read-only inspection)
✅ execute_sql SELECT ...  (read-only queries)
✅ get_advisors           (security/performance audit)
✅ get_publishable_keys   (key retrieval — output goes to .env.local only)
✅ list_migrations        (inspection only)
✅ search_docs            (documentation lookup)
```

### Inferred Autonomous Permissions
- Clearing ESLint warnings that don't change behavior
- Adding TypeScript types to existing untyped code (no logic changes)
- Fixing import order or unused imports flagged by the linter
- Running `npm run build` to verify changes before reporting completion

---

## §2 · Approval-Required Actions

These actions **must pause and present a plan to Jay before executing**.
The agent must state: what it will do, why, and what the side effects are.

### Git Operations
| Action | Required Disclosure |
|---|---|
| `git commit` | List every file being committed; confirm none contain secrets |
| `git push` | State: branch name, remote URL, # of commits being pushed |
| `git push --force` | **Never autonomous** — prohibited even with approval unless Jay types it manually |
| `git merge` | State: source branch, target branch, potential conflicts |
| `git rebase` | State: full intent; never interactive rebase autonomously |
| `git stash` | State: what is being stashed and why |
| `git checkout -- <file>` | State: which file; confirm it discards uncommitted work |

### Database / Supabase
| Action | Required Disclosure |
|---|---|
| `apply_migration` | Paste the exact SQL; describe every table/column/policy affected |
| Any `INSERT / UPDATE / DELETE` via `execute_sql` | Paste the exact SQL; state number of rows affected |
| `create_project` | Full project details + cost estimate |
| `pause_project` | Confirm impact on live users |
| Policy changes (RLS) | State: current policy, new policy, security difference |

### Dependencies & Configuration
| Action | Required Disclosure |
|---|---|
| `npm install <package>` | Package name, version, why it's needed, bundle size impact |
| `npm uninstall <package>` | What depends on it; confirm nothing breaks |
| Editing `package.json` scripts | State old value and new value |
| Editing `next.config.mjs` | State old value and new value; describe build impact |
| Editing `tailwind.config.ts` | State what changes and whether it affects existing classes |

### Environment & Secrets
| Action | Required Disclosure |
|---|---|
| Any edit to `.env.local` | Read current value (redacted), state new value (redacted) |
| Adding new `NEXT_PUBLIC_*` variables | Name, what it exposes client-side, why it's needed |
| Adding server-only env vars | Name and purpose |

### File Deletion
| Action | Required Disclosure |
|---|---|
| Deleting any source file | File path; confirm it has no imports pointing to it |
| Deleting `public/` assets | Confirm no hardcoded references in source |
| Deleting migration files | **Prohibited** — see §3 |

### Visual Design Changes
| Action | Required Disclosure |
|---|---|
| Changing any CSS custom property in `:root` | Current value → proposed value; visual impact |
| Changing font families | Current stack; why change is needed |
| Adding new animation keyframes | Name and what it animates |
| Changing layout grid/flexbox structure | Which component; before/after layout description |

---

## §3 · Hard Stops

The agent must **halt entirely, report its state, and wait for Jay** before taking any further action if any of the following conditions are true.

### File State Anomalies
```
STOP if:
  - A file the agent expects to exist is missing from the tree
  - A file contains content that contradicts CLAUDE.md or MEMORY.md
  - git status shows unexpected modified or deleted files at session start
  - .env.local is missing or empty (Supabase calls will silently fail)
  - Any migration file has been edited (they are append-only by contract)
```

### Scope Violations
```
STOP if:
  - The fix requires modifying files outside the Autonomous Whitelist (§1)
  - A request would require adding a UI component library
  - A request would change the color system, font stack, or page layouts
    without Jay explicitly naming those as the goal
  - A single fix is growing to touch more than 5 files not yet read
  - The agent finds itself writing new business logic not present in any
    existing file (feature scope — not bug fix scope)
```

### Data / Security Risk
```
STOP if:
  - Any tool result contains what appears to be a real API key, token,
    or password not already known to be in .env.local
  - A Supabase query returns production data that was not expected
    (PII, subscriber emails, unexpected row counts)
  - The agent is about to run a SQL statement with no WHERE clause
    on a table with user data
  - git diff shows .env.local or any secret file in the staged set
```

### Ambiguity
```
STOP if:
  - The requirement can be interpreted in two meaningfully different ways
    and the wrong interpretation would require reverting > 2 files
  - Jay's instruction contradicts a rule in CLAUDE.md or GUARDRAILS.md —
    name the contradiction explicitly before proceeding
  - The agent has attempted the same fix twice and it has not resolved
    the reported error (diagnostic loop — escalate rather than retry)
```

### Session Integrity
```
STOP if:
  - The agent is mid-task and the context window is approaching its limit
    (summarize progress, list remaining steps, hand off cleanly)
  - A Bash command exits with a non-zero code the agent cannot explain
  - npm run build fails on files the agent did not edit this session
```

---

## §4 · Blast Radius Limits

These are the maximum scope boundaries for a single autonomous session.
Reaching a limit triggers a **human checkpoint** before work continues.

### Per-Session File Limits
| Scope | Limit | Checkpoint Action |
|---|---|---|
| Files edited | **5 files** | Pause, summarize changes, confirm continuation |
| Files created | **3 files** | Pause, describe each new file's purpose |
| Files deleted | **0** | Always approval-required (§2) |
| Lines changed in `globals.css` | **60 lines** | Read the full affected section, summarize visual impact |

### Per-Session Database Limits
| Scope | Limit |
|---|---|
| New migration files | **1 per session** |
| Tables created | **1 per session** |
| RLS policies added/changed | **2 per session** |
| `execute_sql` write statements | **0 autonomous** — always approval-required |

### Per-Session Dependency Limits
| Scope | Limit |
|---|---|
| New npm packages installed | **1 per session** — must justify bundle impact |
| Packages removed | **0 autonomous** — always approval-required |
| `package.json` script changes | **1 per session** |

### Design System Freeze
The following values are **locked** — they cannot change in any session
without Jay explicitly stating "change the [color/font/animation]":

```
Colors (CSS custom properties — do not alter):
  --ink:       #16130f
  --parchment: #f4efe4
  --gold:      #b8922a
  --gold-lt:   #d4aa4a
  --warm:      #d6c9ae
  --moss:      #4a5e3a

Fonts (do not swap or add):
  Cormorant Garamond (body text, titles)
  Cinzel (labels, eyebrows, nav)
  DM Sans (UI text, buttons)

Animation timing (do not modify):
  riseIn: 0.7s–1.4s ease forwards
  slideLeft: 1.4s 0.8s ease forwards
  scrollPulse: 2s ease-in-out infinite
```

### Blast Radius Reset
The counter resets to zero after:
- A human checkpoint confirms continuation
- The session ends and a new one begins
- Jay explicitly says "keep going"

---

## §5 · Recovery Protocol

If the agent realizes mid-session it has **exceeded its authority, made an error,
or produced an unintended result**, the following steps must be executed in order.
Do not attempt to fix the mistake before completing the recovery protocol.

### Step 1 — Freeze
```
Stop all further tool calls immediately.
Do not attempt to self-correct without Jay's instruction.
Do not run git commands to "clean up" before reporting.
```

### Step 2 — Assess
Run these read-only commands and report their output verbatim:
```bash
git status                     # what files are in what state
git diff                       # exact line-level changes made
git diff --cached              # anything already staged
git log --oneline -5           # recent commit context
```

If the error was in a Supabase migration:
```sql
-- Run via execute_sql (SELECT only):
SELECT schemaname, tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public';
```

### Step 3 — Report
State to Jay, in plain language:
```
1. What I was trying to do
2. What I actually did
3. Which files/systems were affected
4. What the current state is (from git status / git diff output)
5. Whether any data was written to Supabase
6. What I believe the options are for recovery
```

### Step 4 — Wait
Do not execute any recovery action until Jay explicitly instructs.
Present options; do not choose.

### Step 5 — Execute Recovery (Only on Instruction)
Jay will choose one of the following. Execute only the chosen path:

**Option A — Discard all uncommitted changes**
```bash
git checkout -- .              # reverts all unstaged changes
git clean -fd                  # removes untracked files (confirm first)
```
> Only run `git clean` after Jay confirms which untracked files to remove.

**Option B — Revert a specific file**
```bash
git checkout -- <file-path>    # revert one file to last commit
```

**Option C — Revert the last commit (keep changes staged)**
```bash
git reset HEAD~1               # undo commit, keep changes in working tree
```

**Option D — Revert the last commit (discard changes)**
```bash
git reset --hard HEAD~1        # undo commit AND discard all changes
```
> Confirm with Jay before running `--hard`. This cannot be undone.

**Option E — Supabase schema rollback**
```
There is no automatic rollback for applied migrations.
Create a new DOWN migration file in supabase/migrations/
with the exact inverse SQL (DROP TABLE, DROP POLICY, etc.)
Present it to Jay for review before applying.
```

### Step 6 — Harden
After recovery is complete, update this file:
```
1. Add the mistake pattern to §3 Hard Stops if it isn't already there
2. Add the recovery path used to §5 for future reference
3. Update the session timestamp at the bottom of this file
4. Commit GUARDRAILS.md alongside any other recovery commits
```

### Recovery Anti-Patterns (Never Do During Recovery)
```
❌ Do not run git push during recovery without explicit instruction
❌ Do not run a second migration to "fix" the first — present it first
❌ Do not delete files to hide the mistake — report them
❌ Do not continue the original task until recovery is confirmed complete
❌ Do not minimize the error — describe it fully and accurately
```

---

## Guardrail Hierarchy

When rules conflict, apply them in this order (most restrictive wins):

```
1. Hard Stops (§3)           — halt, no exceptions
2. Hard Prohibitions (CLAUDE.md §1)  — never do, no exceptions
3. Blast Radius Limits (§4)  — pause at threshold
4. Approval-Required (§2)    — ask before acting
5. Autonomous Whitelist (§1) — proceed without asking
```

---

*Last updated: 2026-04-06 · Session: initial GUARDRAILS.md creation*
*Next review trigger: first autonomous session failure or near-miss*
