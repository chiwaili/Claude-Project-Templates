![Claude Code](https://img.shields.io/badge/Claude_Code-compatible-5A67D8?style=flat-square&logo=anthropic&logoColor=white) ![Type](https://img.shields.io/badge/type-project_template-10B981?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-gray?style=flat-square)

# Claude Project Templates

A ready-to-go project scaffold for Claude Code. Clone it, open a session, and Claude walks you through setup automatically — asking about your stack, your users, and your first features, then populates every template file in one commit.

---

## How it works

```
┌─────────────────────────────────────────────────────┐
│  You clone the repo and open Claude Code            │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  SessionStart hook fires (.claude/check-setup.sh)   │
│  Detects [Project Name] placeholder in CLAUDE.md    │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Claude asks 4 rounds of questions                  │
│  1. Identity — name & one-line description          │
│  2. Problem & users                                 │
│  3. Tech stack & initial features                   │
│  4. Public surface, legal & marketing               │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Claude fills every placeholder across all files    │
│  in a single commit, then removes the onboarding   │
│  section — hook goes silent on all future sessions  │
└─────────────────────────────────────────────────────┘
```

---

## What's included

```
your-project/
├── .claude/
│   ├── settings.json          # SessionStart hook wiring
│   ├── check-setup.sh         # Detects unconfigured state
│   └── skills/
│       └── ship-checklist.skill  # /ship-checklist — bundled, no install needed
├── src/
│   └── lib/
│       ├── analytics.ts            # GA4: consent gating, page views, events
│       └── analytics.snippet.html  # Optional head snippet w/ consent defaults
├── ANALYTICS.md               # GA4 setup, event naming rules, tagging plan
├── CLAUDE.md                  # Claude's instructions (auto-filled on setup)
├── PRD.md                     # Product requirements template
├── TODO.md                    # Feature backlog
├── FUNCTION_MAP.md            # Architecture + function reference
└── README.md                  # This file
```

---

## What Claude fills in for you

| File | What gets populated |
|---|---|
| `CLAUDE.md` | Project name, description, tech stack, repo structure, dev commands, env vars |
| `PRD.md` | Overview, problem statement, core features, tech stack sections, jurisdiction & third-party processors |
| `README.md` | Project name, description, tech stack table, run/deploy commands |
| `TODO.md` | Project name, initial features in "Up Next" |
| `FUNCTION_MAP.md` | Project name, architecture diagram updated to match your stack |
| `ANALYTICS.md` | GA4 measurement IDs, env var names for your bundler, first tagging-plan rows |

---

## Bundled: GA4 analytics

`src/lib/analytics.ts` is a framework-agnostic GA4 module — no imports, no dependencies. Strip the types and rename to `.js` if you're not using TypeScript.

```ts
import { initAnalytics, grantConsent, trackPageView, trackEvent } from '@/lib/analytics';

initAnalytics();                                    // consent defaults to denied
grantConsent({ analytics_storage: 'granted' });     // from your consent UI
trackPageView();                                    // on every route change
trackEvent('report_exported', { format: 'csv' });   // custom events
```

What it handles: Consent Mode v2 defaults (all four signals denied before gtag.js loads), env-based measurement IDs so staging and production report separately, off in development unless `VITE_ANALYTICS_DEBUG=true`, manual page views so SPA routing counts once, and dev-time validation against GA4's documented limits (40-char event names, 25 params per event, 100-char param values) with warnings for reserved event names and non-snake_case.

`ANALYTICS.md` carries the tagging plan table, naming conventions, and a seven-step pre-ship verification list. Adapter snippets for React Router and the Next.js App Router are in comments at the bottom of the module.

---

## Bundled: `/ship-checklist`

Every project cloned from this template includes a pre-ship checklist skill. Before any feature goes to production, run `/ship-checklist` and Claude walks you through eight items conversationally:

1. Security & API access
2. Database backup & recovery
3. Maintenance kill-switch (remote-toggleable)
4. Automated testing
5. SEO & the public marketing surface (metadata, landing/pricing/changelog, share previews)
6. Error pages & crawler files (404, 403, 500, robots.txt, sitemap.xml)
7. Legal & policy pages (privacy policy, terms, cookie consent, contact, data deletion, AI disclosure)
8. Code structure

`N/A — [reason]` is a valid answer for any item, and the checklist asks for the reason rather than letting things drop silently.

No install needed — the skill is in `.claude/skills/` and works immediately.

> **On the legal item:** Claude can draft the scaffold and a plain-language first pass, and the template asks it to say so explicitly — a generated privacy policy is a starting point, not legal advice, and not evidence of compliance. Anything touching GDPR / UK GDPR, CCPA, payments, health data, or under-18 users wants a qualified human to read it before launch.

---

## Use this template

```bash
git clone https://github.com/chiwaili/Claude-Project-Templates my-project
cd my-project
# Open in Claude Code — onboarding starts automatically
```
