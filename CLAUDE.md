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

   **Round 4 — Public surface, legal & marketing**
   - Is there a public web surface (marketing site, landing page, public app), or is this internal / CLI / API-only?
   - Will it collect personal data from anyone other than you? What kinds (email, name, uploads, payment details, location)?
   - Will it take money? If so, via what (Stripe, Paddle, app store)?
   - Which third parties will see user data (analytics, AI model provider, email sender, error tracker)?
   - What legal entity and jurisdiction is this shipping under, and where are the users? *(If it's "not decided yet", record that — don't invent one.)*
   - Which public marketing pages are planned first (landing, pricing, about, changelog, docs)?
   - Analytics: GA4, something else, or none? If GA4, do you have a measurement ID yet (`G-XXXXXXXXXX`) and a separate property or stream for staging?
   - What are the 2–3 things you most want to be able to measure? *(These become the first rows of the tagging plan in `ANALYTICS.md`.)*

   If Round 4 comes back as "internal tool, no public surface, no personal data", record that explicitly and mark the legal and marketing sections N/A rather than deleting them.

3. Once you have all the answers, fill in **every placeholder** across these files in a single commit:
   - **`CLAUDE.md`** — project name, 2–3 sentence description, tech stack table, repo structure, dev commands, env vars, key files sections
   - **`PRD.md`** — project name, overview paragraph, problem statement, core feature entries (one per initial feature), tech stack sections
   - **`README.md`** — project name, one-line description, tech stack table, run/deploy commands
   - **`TODO.md`** — project name, initial features listed in "Up Next"
   - **`FUNCTION_MAP.md`** — project name, update the architecture diagram to match the actual stack
   - **`ANALYTICS.md`** — project name, GA4 property and measurement IDs, env var names matching the chosen bundler, and the first rows of the tagging plan from the "what do you want to measure" answers. If analytics is "none", mark the file N/A rather than deleting it
   - **`src/lib/analytics.ts`** — adapt the env accessor to the chosen bundler (Vite `VITE_`, Next.js `NEXT_PUBLIC_`), delete the framework adapter comments that don't apply, and rename to `.js` if the project is not TypeScript. If analytics is "none", delete this file and `analytics.snippet.html`

4. After the commit, remove this `## Onboarding` section from CLAUDE.md and commit that cleanup too.

---

## Mandatory: pre-ship checklist + docs update on every feature

Before committing any feature that is ready to ship, run `/ship-checklist` to walk through the eight-item launch-hygiene check (security/auth, backups, maintenance kill-switch, testing, SEO & marketing surface, error pages & crawler files, legal & policy pages, code structure). The skill is bundled in `.claude/skills/` — no install needed.

After completing any feature, bug fix, or notable change, always update the following files **in the same commit** as the code:

- **`TODO.md`** — move completed items to the Done section with a one-line description of what was built
- **`PRD.md`** — update the relevant feature section to reflect actual behaviour; remove items from the Future Roadmap once shipped

Never commit code changes without also committing the corresponding doc updates.

---

## Mandatory: web hygiene scaffold (error pages, robots.txt, sitemap)

Every project with a public web surface must include these from the initial scaffold — build them alongside the first feature, not "later":

- **Custom 404 page** — branded, returns a real HTTP 404 status (not a soft 200), links back to a working page
- **403 / Forbidden state** — what logged-out or unauthorized users see; never leak stack traces or internal details
- **500 / generic error page** — friendly fallback that doesn't expose internals; distinct from the maintenance page
- **`robots.txt`** — correct per environment: staging/preview blocked from indexing, production never shipping `Disallow: /` by accident
- **`sitemap.xml`** — generated automatically at build or request time, referenced from robots.txt

For projects with no public web surface (CLI, API-only, internal tools), note the N/A in `PRD.md` and skip. `/ship-checklist` re-verifies these on every ship (item 6).

---

## Mandatory: legal & policy pages

Any project that collects personal data from anyone other than the developer, or that takes money, needs these before it accepts its first real user — not before "proper launch", which never arrives on schedule:

- **Privacy policy** — reachable from the footer and from the signup flow. States what's collected, why, retention period, which third parties receive it (analytics, AI model provider, payment processor, email sender, error tracker), and how someone requests deletion
- **Terms & conditions** — acceptable use, liability limits, termination, governing law. Required before taking money or hosting user-generated content
- **Cookie / tracking consent** — only if non-essential cookies or consent-requiring analytics are in play. The mechanism must actually gate the script; a banner that fires the tag regardless is worse than no banner
- **Contact & legal identity** — a monitored support address or form, plus an imprint (trading name, registered address, company number) where the jurisdiction expects one
- **Data deletion & export route** — self-serve if possible; a documented manual process is acceptable for solo projects, nothing at all is not
- **AI disclosure** — if user input is sent to a third-party model, say so in the policy and state whether it's used for training

**Drafting rule.** Claude may draft these pages from what the project actually does, and should keep the language plain. Claude must also say plainly that a draft is not legal advice, and flag review by a qualified human as an open item with a date — especially where GDPR / UK GDPR, CCPA, payments, health data, or under-18 users are involved. A generated policy is a starting point, never evidence of compliance.

**Keep them in sync.** Whenever a feature adds a new data type, a new third-party processor, a payment flow, or a new jurisdiction, the policy edit ships **in the same commit** as the feature. A policy describing a product the code no longer resembles is a liability, not a formality.

For projects with no personal data and no public surface (personal CLI, single-user internal tool), note the N/A in `PRD.md` with a one-line reason. `/ship-checklist` re-verifies this on every ship (item 7).

---

## Mandatory: public marketing surface

For any project with a public web surface, the marketing pages are part of the product, not a later phase:

- **Landing page** — what it does, who it's for, one clear call to action. Ships with the first feature
- **Pricing page** — required as soon as money is involved; tier names must match what the app and the terms say
- **About / contact** — who's behind it and how to reach them; overlaps with the legal identity requirement above
- **Changelog** — one line per shipped feature. Cheap at ship time, impossible to reconstruct later
- **Route separation** — marketing routes must not depend on app auth or app layout, so an auth change can't take the landing page down
- **Share previews** — OG / Twitter card image and metadata per public page, verified by pasting the real URL into a preview debugger rather than assumed from the meta tag

Copy consistency matters: a feature called "Smart reply" in the app is "Smart reply" on the landing page and in the pricing tier, not "AI Assist". `/ship-checklist` re-verifies this on every ship (item 5).

---

## Mandatory: analytics & event tagging

GA4 is scaffolded in `src/lib/analytics.ts` with the tagging plan and setup notes in **`ANALYTICS.md`**. Read that file before touching analytics code.

Rules that apply to every feature:

- **Every event goes in the tagging plan.** Add the row to the table in `ANALYTICS.md` in the **same commit** as the code that sends the event. Events in the code but not in the plan make the reports untrustworthy
- **snake_case, `object_verb_past_tense`** — `report_exported`, `invite_sent`. Within GA4's documented limits: 40 chars for an event name, 25 parameters per event, 40 chars per parameter name, 100 chars per parameter value
- **Never put personal data in event parameters** — no email addresses, names, free-text user input, or URLs carrying tokens. `setUserId()` takes an opaque internal ID only
- **Prefer parameters over event names.** `report_exported` with `{ format: 'csv' }` beats separate `report_exported_csv` and `report_exported_pdf` events
- **Consent gates tracking.** Consent Mode v2 defaults to denied for all four signals; the consent UI calls `grantConsent()` with only what the user agreed to. Nothing fires and no `_ga` cookie is written before that choice, where consent applies
- **Analytics off in development** unless `VITE_ANALYTICS_DEBUG=true`, and staging reports to a separate property so test traffic stays out of real data
- **Verify, don't assume.** Before shipping an event, watch it arrive in GA4 DebugView or the Realtime report with the parameters you expect. The section 6 verification list in `ANALYTICS.md` covers the two recurring defects: page views counted twice, and a missing measurement ID in the production build
- **Adding an analytics tool is a policy change.** Naming GA4 (or any tracker) as a processor in the privacy policy ships in the same commit — see the legal section above

`/ship-checklist` re-verifies analytics on every ship (item 5).

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
├── public/
│   ├── robots.txt      # Per-environment; staging blocked from indexing
│   └── og/             # Share-preview images
├── src/
│   ├── pages/
│   │   ├── marketing/  # Landing, pricing, about, changelog — no app-auth dependency
│   │   ├── legal/      # Privacy policy, terms, cookie policy
│   │   ├── errors/     # 404, 403, 500, maintenance
│   │   └── app/        # Authenticated app routes
│   ├── components/     # Shared UI components
│   └── lib/
│       ├── analytics.ts           # GA4: init, consent, page views, events
│       ├── analytics.snippet.html  # Optional head snippet w/ consent defaults
│       └── ...                    # Other utilities and business logic
├── ANALYTICS.md        # GA4 setup + tagging plan
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

# Analytics (the measurement ID is public by design — it ships to the browser)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_ANALYTICS_DEBUG=false        # true → send to GA4 DebugView from local dev
VITE_APP_ENV=development

# Server-side secrets (never use VITE_ prefix for these):

```

For Next.js, use `NEXT_PUBLIC_` in place of `VITE_` — `analytics.ts` reads both prefixes.

---

## Key Files

| Path | Purpose |
|---|---|
| `src/lib/analytics.ts` | GA4 init, Consent Mode v2 gating, page views, custom events, limit validation |
| `ANALYTICS.md` | GA4 property IDs, event naming rules, tagging plan, pre-ship verification steps |
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
