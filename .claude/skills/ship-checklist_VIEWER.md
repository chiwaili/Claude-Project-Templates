---
name: ship-checklist
description: Walks through a six-item launch-hygiene checklist for solo / small-project shipping — security and API access, database backup and recovery, remote-toggleable maintenance/holding state, automated testing, SEO, and code structure. Also covers immediate post-launch ops such as analytics setup, canonical domain/HTTPS redirects, and support email readiness. Use whenever the user is about to ship, deploy, launch, release, push to production, "go live", merge to main, cut a build, or take a feature out from behind a flag. Also trigger for "is this ready to ship?", "pre-deploy check", "launch readiness", "PR review for a feature about to launch", "I'm about to push this", or whenever a user describes a feature reaching the point where it leaves their machine. Use proactively when a draft PRD is being finalised or when a build looks like it's a step away from production. The skill's job is to surface things that are easy to forget when shipping alone, before they bite — not to produce a long document.
---

# ship-checklist

A six-item checklist for the moment a feature is about to leave your machine. Designed for solo / small-project shipping where you are the dev, the on-call, the PM, and the person who'll be debugging at 11pm if something goes wrong.

## Audience: solo / small projects

This skill assumes a single-person operator. The "team" is one human; the audience for this checklist is mostly future-you at 11pm. That changes a few things:

- **You are the owner of every item.** Don't make the user assign owners.
- **Mechanisms can be reused.** A global maintenance flag covers most features. A nightly snapshot covers most tables. The checklist is asking "is this feature inside that umbrella?", not "build a new umbrella for it".
- **N/A is honest, not lazy.** Some items genuinely don't apply (SEO for an internal CLI). Marking N/A with a one-line reason is the right answer; silently skipping is the failure mode.
- **The win condition is "I won't get blindsided"**, not "every box is full". A good checklist run might be five N/As and one real action item.

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

Default to a **conversational walk-through**: take the items one or two at a time, ask the user the relevant question, capture their answer, and move on. Don't dump the whole checklist at once and ask them to fill in six fields — that's how things get rubber-stamped.

If the user says they want it as a saved document (e.g. for a PRD appendix or a release runbook), produce a markdown block with each item as a heading and their answer underneath, plus a short summary of any open items.

For each item, the goal is one of:

- **Real content** — a concrete sentence or two with the actual answer.
- **`N/A — [reason]`** — explicit, with the reason. Not silent.
- **Open item** — the user hasn't decided yet; capture it as a TODO with a deadline.

The `N/A` option matters. You're not trying to pad the doc; you're trying to make sure nothing gets dropped silently.

## The six items

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

### 5. SEO

What to surface (only for user-facing public web surfaces):

- Metadata: page title, description, canonical URL, OG / Twitter cards.
- Structured data if applicable (FAQ, Article, Product, Breadcrumb).
- Robots / sitemap impact: is this page indexable, included in the sitemap?
- Performance budget: LCP, INP, CLS targets. For solo work, sane defaults are LCP <2.5s, INP <200ms, CLS <0.1.
- URL shape and any redirects from old URLs.
- Post-launch ops: analytics/tracking is installed and verified, the public domain is canonicalized to HTTPS, and www/non-www redirect rules are correct.

For internal tools, authenticated-only flows, mobile apps, API services, or anything not crawlable, mark N/A with a one-line reason.

> **Example real answer.** "New `/help/smart-reply` page. Title + description + canonical set. FAQ structured data. Included in sitemap. Performance budget: LCP <2.0s, INP <200ms, CLS <0.05."

> **Example N/A.** "N/A — feature lives behind login in the chat UI; not a crawlable URL."

### 6. Code structure

What to surface:

- Where new code lives (module / path).
- Architectural pattern it follows; flag any deviation from house norms with one-line reasoning.
- Naming and interface conventions for any new types or functions exposed to other modules.
- What existing code is replaced or deprecated, and when the dead code gets removed.

Keep it short — a paragraph plus a path is usually enough. The point is to make the layout decisions explicit before the PR review, not to write a treatise.

> **Example real answer.** "New code in `services/chat/smart-reply/`. Follows existing service pattern (handler → use-case → repo). New `SuggestionProvider` interface mirrors `ReactionProvider`. Deprecates `legacy_reply_helper.ts`; remove in Q4."

> **Example N/A.** "N/A — change is contained to one existing file; no new module, no interface change."

## Closing the run

After walking the six items, give the user a short summary:

- Which items came back as real content (good — they thought it through).
- Which came back as N/A (note them with reasons; they're not silent).
- Which came back as open items / TODOs (the actual list of things to do before shipping).

If there are no open items, say so plainly — "checklist clear, ship when you're ready". If there are, the deliverable is that list, not a long document.

Also confirm any immediate post-launch ops that belong in the same readiness pass: analytics is in place, the public domain and HTTPS redirect rules are correct, and support/contact email channels are configured.

## Anti-patterns

Watch for these and call them out:

- **Rubber-stamping.** All six items get a one-word answer. Push for specifics on at least the ones that aren't honestly N/A.
- **"It's covered" without naming what covers it.** "We have backups" is not an answer. "Nightly Postgres snapshot to S3 includes the new table" is.
- **Soft N/A.** Marking SEO as N/A "because we'll do it later" — that's an open item, not an N/A.
- **Listing the same flag for maintenance and as the kill switch without thinking through the difference.** Often fine, but ask the user to confirm rather than assume.
- **Skipping items because they "feel small".** Small features are exactly when these get dropped. The whole point of the checklist is the small features.

## Working style

- **Conversational by default.** Don't dump six headings and a fillable form. Ask, capture, move on.
- **One or two items at a time.** Don't overwhelm.
- **Don't fabricate answers.** If the user doesn't know, mark it open with a TODO. Don't fill it in plausibly.
- **Length matches the run.** Most checklist runs should produce a short summary, not a multi-page doc. Save long output for when the user asks for it.
- **Tone: collaborator, not auditor.** This is a friend reminding you of things you'd want to be reminded of before pushing the button — not a compliance review.

## Relationship to other skills

- `prd-writer` calls this out at the launch-readiness step. If a PRD is being drafted or reviewed, the checklist run is what lives in the "non-functional & launch hygiene" section. They're separate skills because most ship moments don't involve writing a PRD.
- For deeper SEO work, the user can chain into `marketing:seo-audit` after this. This skill's SEO item is a sanity check, not a full audit.
- For automated-testing strategy on a new product surface (not just one feature), this skill is too thin — that's a separate conversation.
