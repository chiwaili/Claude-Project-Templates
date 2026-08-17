/**
 * GA4 analytics — framework-agnostic reference implementation.
 *
 * Pairs with the head snippet in `analytics.snippet.html` and the tagging plan
 * in `ANALYTICS.md`. Written as plain TypeScript with no framework imports; to
 * use it as JavaScript, strip the type annotations and rename to `analytics.js`.
 *
 * Design decisions, so you can disagree with them deliberately:
 *  - Consent defaults to denied for all four Consent Mode v2 signals. Grant is
 *    an explicit call from your consent UI. See ANALYTICS.md for the caveat
 *    about a June 2026 change to what `ad_storage` governs.
 *  - Disabled by default in development. Set VITE_ANALYTICS_DEBUG=true to send
 *    events to DebugView while working locally.
 *  - `send_page_view` is false; page views are sent manually. This suits SPA
 *    routing and keeps one code path. Do not also enable "Page changes based on
 *    browser history events" in the GA4 stream's enhanced measurement settings,
 *    or page views get counted twice.
 *  - Event names and parameters are validated against GA4's documented limits
 *    and logged loudly in dev rather than silently dropped by Google.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ConsentState = 'granted' | 'denied';

/** Consent Mode v2 signals. */
export interface ConsentSignals {
  ad_storage: ConsentState;
  ad_user_data: ConsentState;
  ad_personalization: ConsentState;
  analytics_storage: ConsentState;
}

export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }

  /**
   * Minimal declaration so this module type-checks in a browser-only project
   * with no `@types/node` installed. Delete it if your tsconfig already pulls in
   * Node types, otherwise TypeScript will report a duplicate.
   */
  // eslint-disable-next-line no-var, vars-on-top
  var process: { env?: Record<string, string | undefined> } | undefined;
}

// ---------------------------------------------------------------------------
// GA4 documented limits — verified against Google's docs, see ANALYTICS.md
// ---------------------------------------------------------------------------

const LIMITS = {
  EVENT_NAME_CHARS: 40,
  PARAMS_PER_EVENT: 25,
  PARAM_NAME_CHARS: 40,
  PARAM_VALUE_CHARS: 100,
} as const;

/**
 * Event names GA4 collects automatically or reserves. Reusing one of these for
 * your own event produces confusing reports rather than an error, so it is
 * worth catching in dev. Not exhaustive — check the GA4 automatically-collected
 * events reference when adding events.
 */
const RESERVED_EVENT_NAMES = new Set([
  'ad_activeview',
  'ad_click',
  'ad_exposure',
  'ad_impression',
  'ad_query',
  'app_clear_data',
  'app_exception',
  'app_remove',
  'app_store_refund',
  'app_store_subscription_cancel',
  'app_store_subscription_convert',
  'app_store_subscription_renew',
  'app_update',
  'app_upgrade',
  'dynamic_link_app_open',
  'dynamic_link_app_update',
  'dynamic_link_first_open',
  'error',
  'firebase_campaign',
  'first_open',
  'first_visit',
  'in_app_purchase',
  'notification_dismiss',
  'notification_foreground',
  'notification_open',
  'notification_receive',
  'os_update',
  'session_start',
  'user_engagement',
]);

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Read config from the environment. Adjust the accessor for your bundler:
 *  - Vite:            import.meta.env.VITE_GA_MEASUREMENT_ID
 *  - Next.js:         process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
 *  - Plain HTML:      hardcode, or inject at build time
 *
 * The measurement ID is not a secret — it ships to the browser either way. Keep
 * it in env config so staging and production report separately rather than
 * polluting one property with test traffic.
 */
function readEnv(key: string): string | undefined {
  // @ts-expect-error — import.meta.env is bundler-provided and absent in Node.
  const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
  if (viteEnv && viteEnv[`VITE_${key}`]) return String(viteEnv[`VITE_${key}`]);
  if (typeof process !== 'undefined' && process.env) {
    return process.env[`NEXT_PUBLIC_${key}`] ?? process.env[`VITE_${key}`];
  }
  return undefined;
}

const MEASUREMENT_ID = readEnv('GA_MEASUREMENT_ID');
const DEBUG = readEnv('ANALYTICS_DEBUG') === 'true';
const IS_PROD =
  readEnv('APP_ENV') === 'production' ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'production');

/** Analytics is live only when there is an ID and we are in prod, or debug is on. */
function isEnabled(): boolean {
  if (typeof window === 'undefined') return false; // SSR / build time
  if (!MEASUREMENT_ID) return false;
  return IS_PROD || DEBUG;
}

function warn(message: string, ...rest: unknown[]): void {
  if (!IS_PROD || DEBUG) console.warn(`[analytics] ${message}`, ...rest);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

let initialised = false;

/**
 * Load gtag.js and set consent defaults. Call once, as early as possible —
 * before your consent banner renders, so Consent Mode is in place before any
 * tag could fire.
 *
 * If you use the head snippet in `analytics.snippet.html` instead, the script
 * tag and consent defaults are already handled; call `initAnalytics()` anyway
 * and it will detect the existing `window.gtag` and skip the injection.
 */
export function initAnalytics(): void {
  if (initialised) return;
  if (!isEnabled()) {
    warn(
      MEASUREMENT_ID
        ? 'disabled in this environment (set VITE_ANALYTICS_DEBUG=true to enable locally)'
        : 'no measurement ID configured — set VITE_GA_MEASUREMENT_ID',
    );
    initialised = true;
    return;
  }

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    // eslint-disable-next-line prefer-rest-params
    window.gtag = function gtag() {
      // Push `arguments` itself, not an array copy — gtag.js expects the
      // Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    } as (...args: unknown[]) => void;

    // Consent defaults must be set before the library loads.
    window.gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500,
    });

    window.gtag('js', new Date());

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  window.gtag!('config', MEASUREMENT_ID!, {
    // Page views are sent manually by trackPageView().
    send_page_view: false,
    ...(DEBUG ? { debug_mode: true } : {}),
  });

  initialised = true;
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

/**
 * Call from your consent UI when the user makes a choice, and again on
 * subsequent page loads with their stored choice.
 *
 * Pass only what the user actually agreed to. If the product has no ads
 * integration, granting analytics alone is the honest mapping:
 *
 *   grantConsent({ analytics_storage: 'granted' })
 */
export function grantConsent(signals: Partial<ConsentSignals>): void {
  if (!isEnabled()) return;
  initAnalytics();
  window.gtag?.('consent', 'update', signals);
}

/** Withdraw consent — for a "reject" click or a preferences change. */
export function revokeConsent(): void {
  if (!isEnabled()) return;
  window.gtag?.('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validate(name: string, params: EventParams): EventParams {
  if (name.length > LIMITS.EVENT_NAME_CHARS) {
    warn(`event name "${name}" exceeds ${LIMITS.EVENT_NAME_CHARS} chars — GA4 will reject it`);
  }
  if (!/^[a-z][a-z0-9_]*$/.test(name)) {
    warn(`event name "${name}" is not snake_case — see the naming rules in ANALYTICS.md`);
  }
  if (RESERVED_EVENT_NAMES.has(name)) {
    warn(`event name "${name}" is reserved or auto-collected by GA4 — pick another`);
  }

  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length > LIMITS.PARAMS_PER_EVENT) {
    warn(
      `event "${name}" has ${entries.length} params, over the limit of ${LIMITS.PARAMS_PER_EVENT} — extras are dropped by GA4`,
    );
  }

  const cleaned: EventParams = {};
  for (const [key, value] of entries.slice(0, LIMITS.PARAMS_PER_EVENT)) {
    if (key.length > LIMITS.PARAM_NAME_CHARS) {
      warn(`param name "${key}" on "${name}" exceeds ${LIMITS.PARAM_NAME_CHARS} chars`);
    }
    if (typeof value === 'string' && value.length > LIMITS.PARAM_VALUE_CHARS) {
      warn(
        `param "${key}" on "${name}" exceeds ${LIMITS.PARAM_VALUE_CHARS} chars — truncating`,
      );
      cleaned[key] = value.slice(0, LIMITS.PARAM_VALUE_CHARS);
      continue;
    }
    cleaned[key] = value;
  }
  return cleaned;
}

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

/**
 * Send a custom event. Every event the product sends should appear in the
 * tagging plan table in `PRD.md` — an event nobody wrote down is an event
 * nobody will interpret correctly in six months.
 *
 *   trackEvent('report_exported', { format: 'csv', row_count: 240 })
 */
export function trackEvent(name: string, params: EventParams = {}): void {
  // Validate first, and unconditionally. Analytics is normally disabled in
  // development, so validating only on the send path would mean the warnings
  // never appear anywhere: silent in dev because nothing is sent, silent in
  // production because warn() is quiet there.
  const cleaned = validate(name, params);
  if (!isEnabled()) {
    warn(`(not sent) ${name}`, cleaned);
    return;
  }
  initAnalytics();
  window.gtag?.('event', name, cleaned);
}

/**
 * Send a page view. Call on initial load and on every client-side route change.
 * `page_location`, `page_title` and `page_referrer` are exempt from the 100-char
 * parameter value limit.
 */
export function trackPageView(overrides: EventParams = {}): void {
  if (!isEnabled()) {
    warn('(not sent) page_view', overrides);
    return;
  }
  initAnalytics();
  window.gtag?.('event', 'page_view', {
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer || undefined,
    ...overrides,
  });
}

/**
 * Associate events with a stable, non-identifying user ID. Never pass an email
 * address, a name, or anything else that identifies a person directly — GA4's
 * terms disallow it and it turns your analytics property into a personal-data
 * store, which changes what your privacy policy has to say.
 */
export function setUserId(id: string | null): void {
  if (!isEnabled()) return;
  initAnalytics();
  window.gtag?.('config', MEASUREMENT_ID!, { user_id: id ?? undefined });
}

// ---------------------------------------------------------------------------
// Framework adapters — delete the ones you do not need
// ---------------------------------------------------------------------------

/**
 * React Router v6 example:
 *
 *   import { useLocation } from 'react-router-dom';
 *   import { trackPageView } from '@/lib/analytics';
 *
 *   export function useAnalyticsPageViews() {
 *     const location = useLocation();
 *     useEffect(() => { trackPageView(); }, [location.pathname, location.search]);
 *   }
 *
 * Next.js App Router example — a client component mounted in the root layout:
 *
 *   'use client';
 *   import { usePathname, useSearchParams } from 'next/navigation';
 *   import { trackPageView } from '@/lib/analytics';
 *
 *   export function AnalyticsPageViews() {
 *     const pathname = usePathname();
 *     const search = useSearchParams();
 *     useEffect(() => { trackPageView(); }, [pathname, search]);
 *     return null;
 *   }
 *
 * Plain HTML: call initAnalytics() and trackPageView() once at the end of body.
 */
