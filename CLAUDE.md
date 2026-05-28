# [Project Name] — Claude Instructions

[2–3 sentences: what it is, who it's for, what makes it distinct.]

---

## Onboarding — First-time setup

> **Remove this entire section once setup is complete.**
>
> This section is for Claude only. It is triggered automatically by the SessionStart hook when `[Project Name]` placeholders are still present.

When you see the onboarding trigger at session start, do the following:

1. Greet the user and explain you'll ask a few quick questions to configure their project.

2. Ask the questions **in three rounds** — wait for answers before moving to the next group:

   **Round 1 — Identity**
   - What's the name of your project?
   - Describe it in one sentence: what does it do and for whom?

   **Round 2 — Problem & users**
   - What problem does it solve, and what gap do existing tools miss?
   - Who is the primary target user?

   **Round 3 — Tech stack & roadmap**
   - Frontend framework (e.g. React/Next.js, Vue, SvelteKit, plain HTML)?
   - Backend (e.g. Firebase Functions, Supabase, Node/Express, none)?
   - Database (e.g. Firestore, PostgreSQL, SQLite, none)?
   - Auth (e.g. Firebase Auth, Supabase Auth, Auth.js, none)?
   - Hosting (e.g. Vercel, Firebase Hosting, Fly.io)?
   - AI layer (e.g. Claude API, OpenAI, none — and which model)?
   - What are the 2–4 core features to build first?

3. Once you have all the answers, fill in **every placeholder** across these files in a single commit:
   - **`CLAUDE.md`** — project name, 2–3 sentence description, tech stack table, repo structure, dev commands, env vars, key files sections
   - **`PRD.md`** — project name, overview paragraph, problem statement, core feature entries (one per initial feature), tech stack sections
   - **`README.md`** — project name, one-line description, tech stack table, run/deploy commands
   - **`TODO.md`** — project name, initial features listed in "Up Next"
   - **`FUNCTION_MAP.md`** — project name, update the architecture diagram to match the actual stack

4. After the commit, remove this `## Onboarding` section from CLAUDE.md and commit that cleanup too.

---

## Mandatory: pre-ship checklist + docs update on every feature

Before committing any feature that is ready to ship, run `/ship-checklist` to walk through the six-item launch-hygiene check (security/auth, backups, maintenance kill-switch, testing, SEO, code structure). The skill is bundled in `.claude/skills/` — no install needed.

After completing any feature, bug fix, or notable change, always update the following files **in the same commit** as the code:

- **`TODO.md`** — move completed items to the Done section with a one-line description of what was built
- **`PRD.md`** — update the relevant feature section to reflect actual behaviour; remove items from the Future Roadmap once shipped

Never commit code changes without also committing the corresponding doc updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | |
| Backend | |
| AI | |
| Database | |
| Auth | |
| Hosting | |

---

## Repository Structure

```
project-name/
├── src/
│   ├── pages/          # Route-level components
│   ├── components/     # Shared UI components
│   └── lib/            # Utilities and business logic
├── TODO.md
├── PRD.md
└── CLAUDE.md
```

---

## Development Commands

```bash
npm run dev       # Dev server → http://localhost:3000
npm run build     # Production build
npm run preview   # Serve build locally

# Deploy:

```

---

## Environment Variables

```
# .env.local — client config only
VITE_=

# Server-side secrets (never use VITE_ prefix for these):

```

---

## Key Files

| Path | Purpose |
|---|---|
| | |

---

## Naming Conventions

- **Pages:** PascalCase in `src/pages/`
- **Components:** PascalCase in `src/components/`
- **Lib utilities:** camelCase in `src/lib/`
- **Functions:** camelCase
- **Types/Interfaces:** PascalCase
- **Constants:** UPPER_SNAKE_CASE

---

## Design Conventions

- **Component library:**
- **Styling:**
- **Semantic colours:**
- **Forbidden patterns:**

---

## Common Pitfalls

1.
2.
3.
