---
name: ship-checklist
description: Walks through an eight-item launch-hygiene checklist for solo / small-project shipping — security and API access, database backup and recovery, remote-toggleable maintenance state, automated testing, SEO plus the public marketing surface and GA4 analytics/event tagging, error pages and crawler files (404/403/500, robots.txt, sitemap), legal and policy pages (privacy policy, terms, cookie consent, data deletion, AI disclosure), and code structure. Also covers HTTPS/canonical redirects, share previews, and support email. Use whenever the user is about to ship, deploy, launch, release, push to production, "go live", merge to main, cut a build, or take a feature out from behind a flag. Also trigger for "is this ready to ship?", "pre-deploy check", "launch readiness", "do I need a privacy policy", "GDPR", "cookie banner", "terms of service", or whenever a feature leaves the user's machine. Use proactively when a draft PRD is being finalised. Surfaces what is easy to forget when shipping alone.
---

# ship-checklist

An eight-item checklist for the moment a feature is about to leave your machine. Designed for solo / small-project shipping where you are the dev, the on-call, the PM, the marketer, and the person who'll be debugging at 11pm if something goes wrong.

## Audience: solo / small projects

This skill assumes a single-person operator. The "team" is one human; the audience for this checklist is mostly future-you at 11pm. That changes a few things:

- **You are the owner of every item.** Don't make the user assign owners.
- **Mechanisms can be reused.** A global maintenance flag covers most features. A nightly snapshot covers most tables. One privacy policy covers most features. The checklist is asking "is this feature inside that umbrella?", not "build a new umbrella for it".
- **N/A is honest, not lazy.** Some items genuinely don't apply (SEO for an internal CLI). Marking N/A with a one-line reason is the right answer; silently skipping is the failure mode.
- **The win condition is "I won't get blindsided"**, not "every box is full". A good checklist run might be six N/As and two real action items.

If the user later signals collaborators, scale formality up.

## When to run this

Run this skill when the user is in any of these moments:

- About to push a feature to production for the first time.
- About to flip a feature flag to 100%.
- Finalising a PRD (the `prd-writer` skill points here at draft completion).
- Reviewing a PR that's about to merge to main and ship.
- Doing a "pre-launch sanity pass" the morning of a release.
- Coming back to a feature after time away, before broadening rollout.

If the user is much earlier than that — still scoping, still building — say so and offer to run it later. A checklist run before there's anything to check is just paperwork.

## How to run it

Default to a **conversational walk-through**: take the items one or two at a time, ask the user the relevant question, capture their answer, and move on. Don't dump the whole checklist at once and ask them to fill in eight fields — that's how things get rubber-stamped.

If the user says they want it as a saved document (e.g. for a PRD appendix or a release runbook), produce a markdown block with each item as a heading and their answer underneath, plus a short summary of any open items.

For each item, the goal is one of:

- **Real content** — a concrete sentence or two with the actual answer.
- **`N/A — [reason]`** — explicit, with the reason. Not silent.
- **Open item** — the user hasn't decided yet; capture it as a TODO with a deadline.

The `N/A` option matters. You're not trying to pad the doc; you're trying to make sure nothing gets dropped silently.

## The eight items

### 1. Security, especially API access

What to surface:

- Who can call what. Auth model, scopes, roles, permissions.
- Rate limits and abuse protection on any new or changed endpoint.
- Secret handling: where keys live, rotation expectations, anything new being introduced.
- Threat-model notes for sensitive paths (auth, payments, PII, admin).

Push back if the user says "same as everything else" without naming the model. For features that expose new APIs, change auth surface, or touch user data, this is not optional. For pure internal-state UI changes with no new endpoints, `N/A — no new endpoints, no auth surface change` is acceptable.

> **Example real answer.** "New `/v2/messages` endpoint requires bearer token with `messages:write` scope; rate-limited 60 req/min/user. No new secrets. PII (message content) stays within existing data boundary; bodies aren't logged."

> **Example N/A.** "N/A — feature is a CSS-only UI tweak; no endpoints, auth, or data access changed."

### 2. Database backup and recovery

What to surface:

- Does this feature change schema, add tables, or touch critical tables?
- If yes: confirm backup coverage extends to the new surface (i.e. the new tables are in the snapshot, the new columns are in the dump).
- Target RPO (how much data could you afford to lose?) and RTO (how fast must you be back up?). For solo work, "24h RPO, 1h RTO from a fresh restore" is a reasonable default — but make the user say it.
- Link or note for the recovery runbook. If there isn't one, that's the first action item.

> **Example real answer.** "Adds `reply_suggestions` table. Covered by the existing nightly Postgres snapshot to S3. RPO 24h / RTO ~1h. Restore runbook: [link]."

> **Example N/A.** "N/A — feature is read-only UI over existing tables; no schema or data writes."

### 3. Maintenance / holding state (remote-toggleable)

What to surface:

- The mechanism that takes the feature (or the whole app) into a maintenance state without a redeploy: feature flag, env var, config flip, platform setting.
- How you'd actually flip it from a phone: dashboard URL, CLI, hosting provider console, mobile app.
- Any feature-specific copy override, if needed.

The point isn't a new mechanism per feature — it's that there's a way to stop the bleeding from your phone if something goes wrong while you're away from your laptop. If a global maintenance flag already exists, "covered by the existing flag" is fine.

> **Example (covered by global flag).** "Covered by `app.maintenance_mode` env var on Fly. Flipping it shows the global maintenance page. Toggle from Fly's mobile-friendly dashboard. No feature-specific copy needed."

> **Example (feature-specific flag).** "Feature flag `notes.ai_summary` in PostHog. Off → AI summary widget hides; replaced with copy 'Summary temporarily unavailable.' Toggle from PostHog mobile app."

If the user can't name a mechanism, this is the most important answer to fix before launch. Add it as a TODO and don't soft-pedal.

### 4. Automated testing

What to surface:

- Required test types for this feature (unit, integration, end-to-end).
- Rough coverage bar before launch — name a number even if it's loose.
- New fixtures, eval sets (for AI features), or load tests being added.
- For AI features: an eval set with a pass-rate threshold belongs here.

Don't accept "tests will be written". Either they exist, or there's a TODO with a deadline.

> **Example real answer.** "Unit coverage ≥80% on new code in `services/chat/smart-reply/`. Integration tests for the new endpoint covering auth scope enforcement. Eval set of 50 prompts (`evals/smart-reply.json`) with ≥80% pass rate before flag flip to 100%."

> **Example N/A.** "N/A — change is a config tweak; existing test suite covers the affected paths and was rerun."

### 5. SEO & the public marketing surface

What to surface (only for user-facing public web surfaces):

**Discoverability**

- Metadata: page title, description, canonical URL, OG / Twitter cards.
- Structured data if applicable (FAQ, Article, Product, Breadcrumb).
- Robots / sitemap impact: is this page indexable, included in the sitemap? (The files themselves — robots.txt, sitemap.xml — are item 6.)
- Performance budget: LCP, INP, CLS targets. For solo work, sane defaults are LCP <2.5s, INP <200ms, CLS <0.1.
- URL shape and any redirects from old URLs.

**Marketing surface**

- Does this feature need representing on the public pages — landing page, pricing, changelog, docs? A feature nobody outside the app can find out about is a feature you'll forget you shipped.
- Are marketing routes separated from app routes, so an auth or layout change inside the app doesn't take the landing page down with it?
- Does the in-app copy match the marketing copy? Same feature name, same promise, same pricing-tier language.
- **Share preview verified, not assumed.** Paste the real URL into a preview debugger (or send it to yourself) and look at it. An OG tag pointing at a 404 image is the most common launch-day cosmetic bug.

**Analytics & tagging**

- Is the feature *measured*? Name the specific events it sends, or say plainly that it sends none. "It's in analytics" is not an answer.
- Are those events written down in the tagging plan (`ANALYTICS.md` in projects scaffolded from this template) in the same commit as the code? An event nobody recorded is an event nobody will interpret correctly in six months.
- **Verified firing, not assumed.** Checked in GA4 DebugView or the Realtime report, with the expected parameters and no duplicates. The two defects to look for: page views counted twice (both automatic and manual page-view tracking active), and events that never arrive because the measurement ID is missing from the production build.
- Naming: snake_case, within GA4's limits — 40 chars for an event name, 25 parameters per event, 40 chars per parameter name, 100 chars per parameter value.
- **No personal data in parameters.** No email addresses, names, free-text input, or URLs carrying tokens. A user ID, if sent, is an opaque internal one.
- Consent: tracking is gated so nothing fires and no analytics cookies are written before the user chooses, where that applies. This is the seam with item 7 — if the feature adds an analytics tool, the privacy policy needs it named as a processor in the same ship.
- Staging traffic lands in a staging property, and your own IP is filtered from production.

> **Example real answer.** "Sends `report_exported` with `{ format, row_count }`; row added to the tagging plan in this PR. Verified in DebugView — fires once per export, params correct. No new analytics tool, so no policy edit. Existing consent gate covers it; confirmed no `_ga` cookie before accept."

> **Example N/A.** "N/A — internal refactor, no user-visible action worth measuring, no new events."

**Other post-launch ops**

- The public domain is canonicalized to HTTPS, and www/non-www redirect rules are correct.

For internal tools, authenticated-only flows, mobile apps, API services, or anything not crawlable, mark N/A with a one-line reason.

> **Example real answer (discoverability + marketing).** "New `/help/smart-reply` page. Title + description + canonical set. FAQ structured data. Included in sitemap. Performance budget: LCP <2.0s, INP <200ms, CLS <0.05. Added a bullet to the landing page feature list and a changelog entry; feature name matches the in-app label ('Smart reply'). OG image checked in a preview debugger — renders."

> **Example N/A.** "N/A — feature lives behind login in the chat UI; not a crawlable URL, no marketing surface change. Analytics: one new event, see below."

Note that the analytics sub-item often has a real answer even when the SEO sub-item is honestly N/A — an authenticated feature is not crawlable but is still worth measuring. Don't let one N/A carry the whole item.

### 6. Error pages & crawler files

What to surface (for public web surfaces):

- **404 page**: a custom, branded not-found page that returns a real HTTP 404 status (not a soft 200), with a link back to somewhere useful. Does this feature add routes that could 404 (deleted content, bad slugs)?
- **403 / Forbidden and auth-failure states**: what a logged-out or unauthorized user sees when they hit this feature's URLs. No stack traces, no internal details, no confirmation that the resource exists if that itself is sensitive.
- **500 / generic error page**: a friendly fallback that doesn't leak internals. Check it doesn't conflict with the maintenance page from item 3 — they're different states (broken vs. intentionally paused).
- **robots.txt**: exists, correct for the environment — staging/preview environments blocked from indexing, and production not accidentally shipping `Disallow: /`.
- **sitemap.xml**: exists, generated automatically at build or request time (a hand-maintained sitemap is a stale sitemap), referenced from robots.txt, and includes/excludes this feature's URLs correctly.

The error pages are usually a one-time scaffold reused by every feature — like the maintenance flag, the question is "are this feature's failure modes covered by the existing pages?", not "build new ones each time".

> **Example real answer.** "Custom 404 and 500 pages already scaffolded (`src/pages/NotFound.tsx`, `src/pages/Error.tsx`); new `/reports/:id` route 404s correctly on bad ids and 403s (generic 'no access' page) for other users' reports. robots.txt unchanged; sitemap auto-generated at build, excludes `/reports/*` since they're private."

> **Example N/A.** "N/A — internal CLI tool; no web surface, no crawlers, no HTTP error pages."

### 7. Legal & policy pages

Like the error pages, this is mostly a scaffold-once item — but it **re-triggers** whenever a feature does any of the following, and those are the cases to probe for:

- Collects a new *kind* of personal data (location, contacts, health, biometrics, payment details, uploaded files).
- Introduces a new third-party processor — an analytics tool, an AI model provider, a payment processor, an email sender, an error tracker.
- Starts taking money, or changes what a paid tier includes.
- Sends user content to a model provider, or starts retaining it for longer.
- Opens the product to a new jurisdiction or to under-18 users.

What to surface:

- **Privacy policy** — exists, reachable from the footer and from the signup flow. Names what's collected, why, how long it's kept, which third parties receive it, and how someone requests deletion. If this feature adds a data type or a processor, the policy needs an edit *in the same ship*, not later.
- **Terms & conditions / terms of service** — exists and reachable. Matters most before you take money, host user-generated content, or make availability promises.
- **Cookie / tracking consent** — if the product sets non-essential cookies or runs analytics that needs consent where its users are, there's a mechanism that actually gates the script. A banner that fires the tag regardless of the choice is worse than no banner, because it looks deliberate.
- **Contact & legal identity** — a monitored support address or form. Some jurisdictions also expect an imprint / legal-entity disclosure: trading name, registered address, company number.
- **Data deletion & export** — a route for someone to delete their account and data, and to get a copy of it. "Email me and I'll do it by hand within 30 days, documented in the runbook" is a legitimate solo answer. Nothing at all is not.
- **AI disclosure** — if user input goes to a third-party model, say so plainly, and say whether it's used for training. If output is shown as advice (legal, medical, financial), note what disclaimer sits next to it.

**On drafting these pages.** Claude can draft the scaffold — page routes, footer links, section headings, and a first pass at plain-language content based on what the project actually does. Be explicit with the user that a draft is a starting point and not legal advice, and that anything touching GDPR / UK GDPR, CCPA, payments, health data, or under-18 users warrants review by someone qualified before launch. Do not let generated boilerplate stand in as verified compliance, and do not tell the user they are covered. Record review as an open item with a date.

Also flag the common mismatch: a policy describing a product the code no longer resembles. If the privacy policy says "we don't use third-party analytics" and this feature adds PostHog, that's an open item, not a detail.

> **Example real answer.** "Feature sends message text to a third-party model API — new processor. Privacy policy §4 (Third parties) updated in this PR to name the provider, note 30-day retention, and state input isn't used for training. Terms unchanged. Consent: analytics already gated by the existing consent tool; the model call is essential to the feature, so it sits under contract rather than consent. Deletion: existing account-delete flow removes message rows, verified manually. Solicitor review of the updated §4 booked for 3 Sep — open item."

> **Example N/A.** "N/A — internal admin tool, single user (me), no personal data beyond my own login, no public surface."

### 8. Code structure

What to surface:

- Where new code lives (module / path).
- Architectural pattern it follows; flag any deviation from house norms with one-line reasoning.
- Naming and interface conventions for any new types or functions exposed to other modules.
- What existing code is replaced or deprecated, and when the dead code gets removed.

Keep it short — a paragraph plus a path is usually enough. The point is to make the layout decisions explicit before the PR review, not to write a treatise.

> **Example real answer.** "New code in `services/chat/smart-reply/`. Follows existing service pattern (handler → use-case → repo). New `SuggestionProvider` interface mirrors `ReactionProvider`. Deprecates `legacy_reply_helper.ts`; remove in Q4."

> **Example N/A.** "N/A — change is contained to one existing file; no new module, no interface change."

## Closing the run

After walking the eight items, give the user a short summary:

- Which items came back as real content (good — they thought it through).
- Which came back as N/A (note them with reasons; they're not silent).
- Which came back as open items / TODOs (the actual list of things to do before shipping).

If there are no open items, say so plainly — "checklist clear, ship when you're ready". If there are, the deliverable is that list, not a long document.

Call out separately any item that needs a *human other than the user* — legal review, an accountant, a platform approval. Those have lead times the other items don't, so they need flagging early even when everything else looks clear.

Also confirm the immediate post-launch ops that belong in the same readiness pass: analytics is in place and consent-gated where that applies, the public domain and HTTPS redirect rules are correct, share previews render, and support/contact channels are configured and monitored.

## Anti-patterns

Watch for these and call them out:

- **Rubber-stamping.** All eight items get a one-word answer. Push for specifics on at least the ones that aren't honestly N/A.
- **"It's covered" without naming what covers it.** "We have backups" is not an answer. "Nightly Postgres snapshot to S3 includes the new table" is.
- **Soft N/A.** Marking SEO as N/A "because we'll do it later" — that's an open item, not an N/A.
- **Treating a generated policy as sign-off.** A drafted privacy policy is a draft. Saying or implying the user is now compliant is the failure mode here.
- **"We'll add the privacy policy before launch."** The most-deferred item on this list, and the hardest to retrofit once data is already being collected under no stated basis. Make it an open item with a date.
- **Stale policy.** The policy hasn't been read since the third feature and the product is on its twelfth. Ask when it was last opened.
- **Marketing surface as an afterthought.** The feature ships, the landing page never mentions it, and three months later the user can't remember whether it launched. One changelog line at ship time is the cheap fix.
- **"Analytics is set up" as a one-time claim.** Installed once in month one, never checked since, measurement ID missing from the staging build, half the events renamed. Ask when the reports were last opened and whether the numbers looked plausible.
- **Tagging plan drift.** Events in the code that aren't in the plan, or plan rows for events that were deleted. Both make the reports untrustworthy in the same way.
- **Listing the same flag for maintenance and as the kill switch without thinking through the difference.** Often fine, but ask the user to confirm rather than assume.
- **Skipping items because they "feel small".** Small features are exactly when these get dropped. The whole point of the checklist is the small features.

## Working style

- **Conversational by default.** Don't dump eight headings and a fillable form. Ask, capture, move on.
- **One or two items at a time.** Don't overwhelm.
- **Don't fabricate answers.** If the user doesn't know, mark it open with a TODO. Don't fill it in plausibly. This applies with extra force to item 7 — an invented jurisdiction or legal basis is worse than a blank.
- **Length matches the run.** Most checklist runs should produce a short summary, not a multi-page doc. Save long output for when the user asks for it.
- **Tone: collaborator, not auditor.** This is a friend reminding you of things you'd want to be reminded of before pushing the button — not a compliance review.

## Relationship to other skills

- `prd-writer` calls this out at the launch-readiness step. If a PRD is being drafted or reviewed, the checklist run is what lives in the "non-functional & launch hygiene" section. They're separate skills because most ship moments don't involve writing a PRD.
- For deeper SEO work, chain into a dedicated SEO-audit skill if one is installed. This skill's SEO item is a sanity check, not a full audit.
- For wording the marketing and policy pages themselves, a UX-copy skill (if installed) is the better tool. This skill's job is noticing the page is missing.
- For automated-testing strategy on a new product surface (not just one feature), this skill is too thin — that's a separate conversation.
