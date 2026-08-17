# Product Requirements Document (PRD): [Project Name]

**Version:** 1.0
**Status:** Draft
**Last updated:** YYYY-MM-DD

---

## 1. Project Overview

[2–3 sentences describing what the product is, who it's for, and the core value proposition.]

---

## 2. Problem Statement

- **The problem:**
- **The gap:**
- **The solution:**

---

## 3. Success Metrics

| Metric | Target | Notes |
|---|---|---|
| | — | |
| | — | |
| | — | |

---

## 4. Core Features

### 4.1. [Feature Name]

- **What it does:**
- **Why it exists:**
- **Technical detail (if relevant):**

### 4.2. [Feature Name]

- **What it does:**
- **Why it exists:**

### 4.x. Web hygiene (pre-filled — applies to any public web surface)

- **What it does:** Custom 404, 403/Forbidden, and 500 error pages; `robots.txt` correct per environment; auto-generated `sitemap.xml` referenced from robots.txt.
- **Why it exists:** Launch hygiene — broken-link UX, no leaked internals on errors, and correct search-engine indexing from day one. Verified on every ship by `/ship-checklist` (item 6).
- **Technical detail (if relevant):** 404 must return a real HTTP 404 status, not a soft 200. Staging/preview environments must be blocked from indexing. *(Mark N/A here if the project has no public web surface.)*

### 4.y. Legal & policy pages (pre-filled — applies wherever personal data or money is involved)

- **What it does:** Privacy policy, terms & conditions, cookie/tracking consent (where applicable), contact & legal identity, and a data deletion/export route. AI disclosure where user input reaches a third-party model.
- **Why it exists:** These are the hardest items to retrofit once real users have already handed over data under no stated basis. Verified on every ship by `/ship-checklist` (item 7).
- **Technical detail (if relevant):**
  - Policy states data types collected, purpose, retention, third-party processors, and the deletion route.
  - Consent mechanism gates the tracking script rather than only displaying a banner.
  - Policy edits ship in the **same commit** as any feature that adds a data type, processor, payment flow, or jurisdiction.
  - Drafts produced by Claude are a starting point, not legal advice — record review by a qualified human as an open item with a date.
- **Jurisdiction & entity:** [legal entity name, jurisdiction, where users are located — or "not decided yet"]
- **Third-party processors:** [analytics / model provider / payments / email / error tracking]
- **Review status:** [ ] not reviewed  [ ] reviewed by ____ on ____

*(Mark N/A here if the project collects no personal data beyond the developer's own and takes no money.)*

### 4.z. Public marketing surface (pre-filled — applies to any public web surface)

- **What it does:** Landing page, pricing (where money is involved), about/contact, changelog, and per-page share previews (OG/Twitter metadata plus image).
- **Why it exists:** A shipped feature nobody outside the app can discover is invisible; a broken share preview is the most common launch-day cosmetic bug. Verified on every ship by `/ship-checklist` (item 5).
- **Technical detail (if relevant):** Marketing routes live outside the authenticated app layout so an auth change can't take them down. Feature names match across app, marketing copy, and pricing tiers. Share previews verified by pasting real URLs into a preview debugger.

*(Mark N/A here if the project has no public web surface.)*

### 4.aa. Analytics & event tagging (pre-filled)

- **What it does:** GA4 via `src/lib/analytics.ts` — Consent Mode v2 defaults denied, manual page views, custom events validated against GA4's limits. Tagging plan and setup notes live in `ANALYTICS.md`.
- **Why it exists:** Shipping without measurement means guessing at whether anything worked. Verified on every ship by `/ship-checklist` (item 5).
- **Technical detail (if relevant):** Events are snake_case `object_verb_past_tense`, no personal data in parameters, every event recorded in the tagging plan in the same commit as its code. Staging reports to a separate property. Adding GA4 also makes Google a processor — reflect that in the privacy policy (§4.y).
- **Measurement ID (prod / staging):** [G-XXXXXXXXXX / G-XXXXXXXXXX]
- **Top 2–3 things to measure:** [what you actually want to know]

*(Mark N/A here if the project uses no analytics.)*

---

## 5. User Flows

### Primary Flow

1.
2.
3.

### Secondary Flow

1.
2.

---

## 6. Technical Stack

### Frontend

-

### Backend

-

---

## 7. Data Schema

### 7.1. [Entity] (`collection/{id}`)

- `field`: description.

---

## 8. Future Roadmap

- **[Feature]** — description. Effort: [low/medium/high].
