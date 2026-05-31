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
│  Claude asks 3 rounds of questions                  │
│  1. Identity — name & one-line description          │
│  2. Problem & users                                 │
│  3. Tech stack & initial features                   │
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
| `PRD.md` | Overview, problem statement, core features, tech stack sections |
| `README.md` | Project name, description, tech stack table, run/deploy commands |
| `TODO.md` | Project name, initial features in "Up Next" |
| `FUNCTION_MAP.md` | Project name, architecture diagram updated to match your stack |

---

## Bundled: `/ship-checklist`

Every project cloned from this template includes a pre-ship checklist skill. Before any feature goes to production, run `/ship-checklist` and Claude walks you through six items conversationally:

1. Security & API access
2. Database backup & recovery
3. Maintenance kill-switch (remote-toggleable)
4. Automated testing
5. SEO
6. Code structure

No install needed — the skill is in `.claude/skills/` and works immediately.

---

## Use this template

```bash
git clone https://github.com/chiwaili/Claude-Project-Templates my-project
cd my-project
# Open in Claude Code — onboarding starts automatically
```
