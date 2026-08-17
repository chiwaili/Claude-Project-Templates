# [Project Name] — Analytics & Tagging

GA4 setup, event naming rules, and the tagging plan. Filled in during onboarding;
verified on every ship by `/ship-checklist` (item 5).

**Property:** [GA4 property name]
**Measurement ID (production):** [G-XXXXXXXXXX]
**Measurement ID (staging):** [G-XXXXXXXXXX — a separate property or stream, so test traffic stays out of real reports]
**Owner of the GA account:** [who can actually log in — write this down, it gets lost]

---

## 1. Files

| Path | Purpose |
|---|---|
| `src/lib/analytics.ts` | Init, consent gating, page views, custom events, limit validation |
| `src/lib/analytics.snippet.html` | Optional head snippet with Consent Mode v2 defaults, for plain-HTML pages |
| `ANALYTICS.md` | This file — tagging plan and conventions |

The module is framework-agnostic and has no imports. Strip the types and rename to
`.js` if the project is not TypeScript. Adapter examples for React Router and the
Next.js App Router are in comments at the bottom of `analytics.ts`.

---

## 2. Environment variables

```
# .env.local — the measurement ID is public by design; it ships to the browser
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Optional: send events to DebugView from a local dev server
VITE_ANALYTICS_DEBUG=false

# Optional: explicit environment flag, if NODE_ENV is not enough
VITE_APP_ENV=development
```

For Next.js, use the `NEXT_PUBLIC_` prefix instead — `analytics.ts` reads both.

Analytics stays off unless there is a measurement ID **and** the build is
production, or `VITE_ANALYTICS_DEBUG=true`. That keeps local page reloads out of
the production property without anyone having to remember to switch it off.

---

## 3. Consent

Consent Mode v2 defaults are set to `denied` for all four signals before gtag.js
loads. Your consent UI then calls:

```ts
import { grantConsent, revokeConsent } from '@/lib/analytics';

// User accepted analytics only (no ads integration in this product)
grantConsent({ analytics_storage: 'granted' });

// User rejected, or changed their mind later
revokeConsent();
```

Re-apply the stored choice on every page load — consent state does not persist
across page loads by itself.

The four signals are `ad_storage`, `ad_user_data`, `ad_personalization`, and
`analytics_storage`. Grant only what the user agreed to. A banner that grants
everything regardless of the click is worse than no banner, because it looks
deliberate rather than accidental.

> **Check this before you rely on it.** [Unverified] Third-party consent vendors
> report a change effective **15 June 2026**, under which `ad_storage` in Consent
> Mode became the sole control over whether GA4 data reaches linked Google Ads
> accounts, with Google Signals narrowed to Analytics-only reporting. Google's own
> consent-mode support page did not mention this change or an effective date when
> this file was written. If the project links GA4 to Google Ads, confirm the
> current behaviour against Google's primary documentation rather than trusting
> this paragraph — and note that behaviour here affects what your privacy policy
> has to say about ad data.

Cross-reference: `/ship-checklist` item 7 (legal & policy pages) covers whether
the policy actually names GA4 as a processor and describes this consent flow.

---

## 4. Event naming rules

Verified against Google's documented limits:

| Rule | Limit |
|---|---|
| Event name length | 40 characters |
| Parameters per event | 25 |
| Parameter name length | 40 characters |
| Parameter value length | 100 characters (`page_title`, `page_location`, `page_referrer` exempt) |

Conventions for this project:

- **snake_case**, lowercase, starting with a letter: `report_exported`, not `ReportExported`.
- **`object_verb_past_tense`** — the thing, then what happened to it. `invite_sent`, `subscription_cancelled`. This sorts usefully in the GA4 events list, because related events cluster.
- **No PII in parameters, ever.** No email addresses, names, free-text user input, or full URLs containing tokens. `setUserId()` takes an opaque internal ID only.
- **Do not reuse GA4's automatically-collected or reserved names** (`session_start`, `first_visit`, `page_view`, `user_engagement`, `error`, and others). `analytics.ts` warns in dev when you do; GA4 itself accepts them silently and produces confusing reports.
- **Prefer few events with parameters over many event names.** `report_exported` with `{ format: 'csv' }` beats `report_exported_csv` and `report_exported_pdf`, because GA4's per-property custom dimension allowance is finite and event names are harder to change later than parameters.

---

## 5. Tagging plan

Every event the product sends belongs in this table. An event nobody wrote down
is an event nobody will interpret correctly in six months.

| Event name | Fires when | Parameters | Question it answers |
|---|---|---|---|
| `page_view` | Initial load and every client-side route change | `page_location`, `page_title`, `page_referrer` | Which pages get traffic |
| | | | |
| | | | |

Add a row in the same commit as the code that sends the event.

**Conversions.** Mark the events that matter as key events in the GA4 UI
(Admin → Events). Note here which ones are marked, since that setting lives in
Google's console and not in this repo:

- [ ] [event name] — marked as key event on [date]

---

## 6. Verification before shipping

Do these in order. Steps 2 and 3 are the ones people skip and then wonder why the
reports are empty three weeks later.

1. **Build with the production measurement ID** and load the site.
2. **Realtime report** (GA4 → Reports → Realtime): confirm your own visit appears
   within a minute or so.
3. **DebugView** (GA4 → Admin → DebugView) with `VITE_ANALYTICS_DEBUG=true`, or
   the Google Analytics Debugger extension: confirm each event in the tagging
   plan fires once, with the parameters you expect and no extras.
4. **Double-count check:** page views arriving twice per navigation means both
   `send_page_view: true` (or GA4 enhanced measurement "page changes based on
   browser history events") and the manual `trackPageView()` call are active.
   Pick one.
5. **Consent check:** with consent denied, confirm no analytics cookies are
   written (`_ga`, `_ga_*` in devtools → Application → Cookies). Then accept, and
   confirm they appear. A banner that writes cookies before the click is the most
   common defect here.
6. **Staging isolation:** confirm staging traffic lands in the staging property,
   not production.
7. **Internal traffic filter:** add your own IP as an internal traffic filter in
   GA4 (Admin → Data streams → Configure tag settings → Define internal traffic)
   so your own browsing does not distort low-volume early data.

---

## 7. Things to decide once and record here

- **Data retention:** GA4 defaults to a short retention window for event-level
  data. Set it deliberately in Admin → Data settings → Data retention, and note
  the choice here, because your privacy policy should state a retention period
  that matches. Current setting: [____]
- **Google Signals:** on or off, and why. Current setting: [____]
- **Google Ads link:** linked or not. Current setting: [____]
- **IP anonymisation:** GA4 does not expose a toggle the way Universal Analytics
  did; note what you understand its behaviour to be, and cite where you read it.
- **Alternative considered:** if you would rather not send user data to Google at
  all, a self-hosted or EU-hosted analytics tool removes most of section 3 and a
  paragraph of the privacy policy along with it. Worth a moment's thought before
  wiring in GA4 by default.
