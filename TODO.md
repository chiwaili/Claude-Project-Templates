# [Project Name] — Feature Backlog

## Done

<!-- Completed items go here -->
<!-- - [x] **Feature name** — one-line description of what was built -->

## Bugs / Fixes

<!-- Known issues go here -->
<!-- - [ ] **Bug description** — what's broken and where to look -->

## Up Next

<!-- Next 1–3 items to build -->
<!-- - [ ] **Feature name** — description. Effort: low/medium/high. Touches: file1.ts, file2.tsx. -->

- [ ] **Web hygiene scaffold** — custom 404, 403/Forbidden, and 500 error pages; `robots.txt` (staging blocked, production indexable); auto-generated `sitemap.xml`. Build alongside the first feature. Effort: low. *(N/A for projects with no public web surface — move to Done with a note.)*
- [ ] **Legal & policy pages** — privacy policy, terms & conditions, cookie consent (if non-essential cookies/analytics), contact & legal identity, data deletion/export route, AI disclosure. Needed before the first real user, not before "proper launch". Effort: low to scaffold, plus one human review. *(N/A if no personal data and no payments — move to Done with a note.)*
- [ ] **Legal review** — get the drafted policy and terms read by someone qualified. Blocked by the item above. Owner: external. Deadline: ____ *(Lead time is longer than everything else on this list — book it early.)*
- [ ] **Analytics & tagging** — create the GA4 property (separate stream/property for staging), set `VITE_GA_MEASUREMENT_ID`, wire `initAnalytics()` + `trackPageView()` into the router, fill the first tagging-plan rows in `ANALYTICS.md`, and verify events in DebugView. Add your own IP as an internal traffic filter. Effort: low. *(N/A if the project uses no analytics — move to Done with a note.)*
- [ ] **Public marketing surface** — landing page, pricing (if charging), about/contact, changelog, and OG share-preview images verified in a preview debugger. Routes kept outside the app auth layout. Effort: medium. *(N/A for projects with no public web surface — move to Done with a note.)*

## Roadmap (longer-term)

<!-- Longer-horizon ideas — no implementation detail needed yet -->
<!-- - [ ] **Feature name** — description. -->
