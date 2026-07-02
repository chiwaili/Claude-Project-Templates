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
