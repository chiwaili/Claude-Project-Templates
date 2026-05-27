# [Project Name] — Claude Instructions

[2–3 sentences: what it is, who it's for, what makes it distinct.]

---

## Mandatory: docs update on every feature implementation

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
