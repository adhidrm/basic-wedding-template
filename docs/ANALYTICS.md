Analytics Implementation Guide

Scope and assumptions
- Stack implemented in this repo: Create React App (CRA) SPA.
- Provider: Google Analytics 4 via gtag.js.
- Requirements satisfied:
  - Basic consent gate (opt-in), stored in localStorage, with ability to reset.
  - Respect Do Not Track (DNT): if enabled, analytics is suppressed and consent is auto-denied.
  - Environment-based IDs (dev/stage/prod) via environment variables.
  - Kill switch feature flag via env.
  - Idempotent loader, no duplicate initialization, send_page_view disabled and page_view sent manually for initial and route changes.
  - SPA route tracking tied to react-router.
  - Fallback custom POST endpoint when analytics are blocked (ad blockers) or disabled.
  - Performance hints (preconnect/dns-prefetch) and CSP guidance with nonces.
  - Testing and rollback guidance.

Files added/modified in this repo
- Frontend runtime:
  - src/analytics/index.js — GA4 loader + consent, DNT, queue, route listener component, optional banner UI
  - src/analytics/events.js — DOM helpers for outbound links, button clicks, forms
  - src/App.js — wires AnalyticsRouterListener and ConsentBanner
  - src/index.js — enables global DOM tracking helpers
  - public/index.html — adds preconnect/dns-prefetch and CSP guidance comments
- Backend fallback ingestion:
  - backend/server.py — adds POST /api/analytics/events endpoint

Environment variables (CRA)
- REACT_APP_ANALYTICS_ENABLED=true|false
  - Kill switch. When false, analytics are fully disabled.
- REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
  - GA4 Measurement ID for the current environment.
- REACT_APP_ENVIRONMENT=development|staging|production
  - Logical environment label used in payloads and debug control.
- REACT_APP_ANALYTICS_FALLBACK_URL=http(s)://host:port/api/analytics/events
  - Optional. If provided, events are POSTed here when gtag is blocked.
- Optional: define a global CSP nonce when serving HTML:
  - window.__CSP_NONCE__ is read by the analytics loader for safe script injection.

Recommended .env files (create in frontend/)
- .env.development
  REACT_APP_ANALYTICS_ENABLED=true
  REACT_APP_GA4_MEASUREMENT_ID=G-XXXXDEV123
  REACT_APP_ENVIRONMENT=development
  REACT_APP_ANALYTICS_FALLBACK_URL=http://localhost:8001/api/analytics/events

- .env.staging
  REACT_APP_ANALYTICS_ENABLED=true
  REACT_APP_GA4_MEASUREMENT_ID=G-XXXXSTAGE123
  REACT_APP_ENVIRONMENT=staging
  REACT_APP_ANALYTICS_FALLBACK_URL=https://staging.yourdomain.com/api/analytics/events

- .env.production
  REACT_APP_ANALYTICS_ENABLED=true
  REACT_APP_GA4_MEASUREMENT_ID=G-XXXXPROD123
  REACT_APP_ENVIRONMENT=production
  REACT_APP_ANALYTICS_FALLBACK_URL=https://yourdomain.com/api/analytics/events

Initialization and placement in CRA
- Do not paste the GA snippet into index.html; we dynamically load it with nonce support and send_page_view: false.
- Head vs body:
  - We inject the GA script at runtime into document.head (async) after consent is granted and DNT check is OK.
- Initial page view:
  - Triggered manually by AnalyticsRouterListener on mount.
- SPA route changes:
  - Triggered by AnalyticsRouterListener on location change (react-router).
- Common events:
  - Global outbound link tracking (document-level listener).
  - Helpers for button clicks and form submissions.

Consent, DNT, gating, and duplicate protection
- Consent gate:
  - Stored in localStorage under analytics_consent_v1 with values granted or denied.
  - Before consent = denied-by-default mode; GA is not loaded; events are queued.
  - When consent becomes granted, GA script is loaded, GA consent updated, queued events flushed.
- DNT:
  - If Do Not Track is enabled, analytics is suppressed and consent is auto-denied at first render.
- Duplicate prevention:
  - Deduplicate identical events within a 2s TTL to mitigate React StrictMode double-invocation in dev.

Using the consent API (basic)
- Read status: AnalyticsConsent.status // "granted" | "denied" | null
- Grant: AnalyticsConsent.grant()
- Deny: AnalyticsConsent.deny()
- Reset (show banner again): AnalyticsConsent.reset()
- Optional UI: ConsentBanner React component can be placed anywhere in the tree (we render it in App).

Data schema (provider-agnostic mapping)
- page_view:
  - page_location, page_path, page_title (mapped to GA4 parameters).
- event (custom):
  - event_name: string
  - params: flat object of properties (category, action, label, value, context, etc. as needed).
- user_properties:
  - set via Analytics.userProperties(props).
- Fallback payload includes:
  - cid, env, userAgent, ts (ms), and the raw event payload.

Backend fallback endpoint
- Route:
  - POST /api/analytics/events
- Purpose:
  - Store minimal event data when GA requests are blocked so you retain basic insight.
- Storage:
  - Writes to db.analytics_events in MongoDB (ensure indexes and retention policies as needed).
- CORS:
  - server.py uses permissive CORS by default; set CORS_ORIGINS env for stricter rules.

Security and performance
- CSP:
  - Prefer setting CSP headers at the reverse proxy or app server. Example:
    Content-Security-Policy:
      default-src 'self';
      script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com 'nonce-RANDOM';
      connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://www.googletagmanager.com/a https://yourdomain.com http://localhost:8001;
      img-src 'self' data: https://www.google-analytics.com;
      style-src 'self' 'unsafe-inline';
      frame-src https://www.googletagmanager.com;
  - Nonces:
    - Provide a per-response nonce and assign it to window.__CSP_NONCE__ before React boots so dynamic GA script loads under nonce.
  - SRI:
    - Not practical for GA CDN endpoints due to dynamic content and query params; rely on CSP + nonces instead.
- Performance:
  - Preconnect and dns-prefetch tags for GTM and GA domains added to public/index.html.
  - Script loaded async and only when consent is granted to avoid delaying main thread.
  - Avoid layout shift: ConsentBanner is styled minimally; adjust as needed.
- Ad blockers:
  - When GA is blocked, events queue and/or are POSTed to fallback endpoint (if configured). Handle retries server-side if needed.

Testing and verification
- In dev, open GA4 DebugView:
  - https://analytics.google.com/analytics/web/#/p/<PROPERTY_ID>/debugview
  - Use Tag Assistant (Chrome extension) to validate gtag events.
- Console/network:
  - Inspect Network tab for requests to googletagmanager.com/gtag/js and collect requests to region1-google-analytics.com/g/collect.
  - If blocked, verify POST requests to /api/analytics/events are succeeding (HTTP 200).
- Meta/Segment (templates below) have their own debuggers (Pixel Helper, Segment Debugger).
- Manual checks:
  - Toggle consent Accept/Decline and verify that when denied, no GA network traffic occurs.
  - Toggle DNT in browser and confirm auto-deny path.
  - Navigate between routes; confirm single page_view per route change.
- Feature flag/rollback:
  - Set REACT_APP_ANALYTICS_ENABLED=false and rebuild to fully disable analytics.
  - Remove ConsentBanner for hard disable (not recommended).

How to wire common events in UI
- Outbound links:
  - Global listener is enabled; any anchor to external origins will emit outbound_click.
- Button click:
  - Add data-analytics="cta" and optional data-section/variant attributes:
    <button data-analytics="cta" data-section="hero" data-variant="primary">RSVP Now</button>
- Form submit:
  - Use trackFormSubmits("form-selector", (form) => ({ custom: "value" })); if needed, or rely on built-in submit listener you attach in a layout.

Framework-specific templates

1) Plain HTML (no framework)
- Add a consent gate + DNT + GA4 loader (send_page_view: false) and basic SPA tracking for hash and history routes.
- index.html (head)
  <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://www.google-analytics.com" crossorigin>
  <link rel="dns-prefetch" href="https://www.google-analytics.com">

- index.html (before closing body):
  <script nonce="NONCE">
  (function () {
    var GA4_ID = "G-XXXXXXX";
    var ENABLED = true;
    var CONSENT_KEY = "analytics_consent_v1";

    function dntOn() {
      var d = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
      return d === "1" || d === "yes";
    }

    function getConsent() {
      try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
    }

    function setConsent(v) {
      try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {}
    }

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }

    function loadGtag() {
      if (!ENABLED || !GA4_ID || dntOn()) return;
      gtag("js", new Date());
      gtag("consent", "default", {
        ad_storage: "denied", analytics_storage: "denied", security_storage: "granted"
      });
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
      if (document.currentScript && document.currentScript.nonce) s.nonce = document.currentScript.nonce;
      s.onload = function () { gtag("config", GA4_ID, { send_page_view: false }); };
      document.head.appendChild(s);
    }

    function page() {
      if (!ENABLED || !GA4_ID || dntOn() || getConsent() !== "granted") return;
      gtag("event", "page_view", {
        page_location: location.href,
        page_path: location.pathname + location.search,
        page_title: document.title
      });
    }

    // consent UI (replace with your own)
    if (getConsent() == null) {
      if (dntOn()) setConsent("denied");
      else if (confirm("Allow analytics?")) setConsent("granted"); else setConsent("denied");
    }
    if (getConsent() === "granted") {
      loadGtag();
      page();
    }

    // SPA listeners
    addEventListener("hashchange", page);
    (function (history) {
      var pushState = history.pushState, replaceState = history.replaceState;
      history.pushState = function () { var r = pushState.apply(this, arguments); window.dispatchEvent(new Event("pushstate")); return r; };
      history.replaceState = function () { var r = replaceState.apply(this, arguments); window.dispatchEvent(new Event("replacestate")); return r; };
    })(window.history);
    addEventListener("popstate", page);
    addEventListener("pushstate", page);
    addEventListener("replacestate", page);
  })();
  </script>

2) React (Vite)
- env:
  - VITE_ANALYTICS_ENABLED=true
  - VITE_GA4_MEASUREMENT_ID=G-XXXX
- analytics.ts
  export const cfg = {
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === "true",
    ga4Id: import.meta.env.VITE_GA4_MEASUREMENT_ID
  };
  // Implement a similar module to CRA’s src/analytics/index.js; use dynamic script injection and router listener in useEffect.
- main.tsx
  - Initialize consent/banner and add a component to listen to Route changes with react-router v6’s useLocation.

3) Next.js (pages router)
- pages/_app.tsx
  import { useEffect } from "react";
  import Script from "next/script";
  import { useRouter } from "next/router";

  const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;

  function page(path) {
    window.gtag("event", "page_view", { page_location: location.origin + path, page_path: path, page_title: document.title });
  }

  export default function App({ Component, pageProps }) {
    const router = useRouter();
    useEffect(() => {
      const handler = (url) => page(url);
      router.events.on("routeChangeComplete", handler);
      // initial
      page(router.asPath);
      return () => router.events.off("routeChangeComplete", handler);
    }, [router.events, router.asPath]);

    return (
      <>
        <Script id="gtag-base" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date()); gtag('config', '${GA4_ID}', { send_page_view: false });`}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
        <Component {...pageProps} />
      </>
    );
  }

- Consent:
  - Gate rendering of the two Script tags until consent is granted.

4) Next.js (app router - Next 13+)
- app/layout.tsx
  - Render Script tags conditionally based on consent; set send_page_view: false.

- app/analytics-listener.tsx (client component)
  "use client";
  import { usePathname, useSearchParams } from "next/navigation";
  import { useEffect, useRef } from "react";

  export default function AnalyticsListener() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const lastRef = useRef("");
    useEffect(() => {
      const path = `${pathname}?${searchParams.toString()}`;
      if (lastRef.current !== path) {
        lastRef.current = path;
        window.gtag?.("event", "page_view", { page_location: location.origin + path, page_path: path, page_title: document.title });
      }
    }, [pathname, searchParams]);
    return null;
  }

- Include <AnalyticsListener /> inside a client layout that mounts once.

5) Vue 3 + Vue Router
- main.ts
  import { createApp } from "vue";
  import { createRouter, createWebHistory } from "vue-router";
  const GA4_ID = import.meta.env.VITE_GA4_ID;

  const router = createRouter({ history: createWebHistory(), routes: [...] });

  router.afterEach((to) => {
    window.gtag?.("event", "page_view", {
      page_location: location.origin + to.fullPath,
      page_path: to.fullPath,
      page_title: document.title
    });
  });

  const app = createApp(App);
  app.use(router);
  app.mount("#app");

- Load GA script on consent granted, with send_page_view: false.

6) Angular + Angular Router
- environment.ts
  export const environment = { production: false, ga4Id: "G-XXXX" };

- app.module.ts
  - No changes required.

- app.component.ts
  import { Router, NavigationEnd } from "@angular/router";
  import { filter } from "rxjs/operators";
  constructor(router: Router) {
    router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: NavigationEnd) => {
      (window as any).gtag?.("event", "page_view", {
        page_location: location.origin + e.urlAfterRedirects,
        page_path: e.urlAfterRedirects,
        page_title: document.title
      });
    });
  }

- index.html
  - Inject GA script after consent with send_page_view: false.

Provider templates (snippet-level)

A) Google Tag Manager (web container)
- Consent-aware loader (after user grants):
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXX');</script>

- Disable GTM until consent is granted. In GTM, use Consent Overview and built-in Consent types (ad_storage, analytics_storage).

B) Meta Pixel
- When consent is granted:
  <script>!function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js'); fbq('init', 'PIXEL_ID');
  fbq('consent', 'revoke'); // default
  fbq('consent', 'grant'); // on accept
  fbq('track', 'PageView');</script>

- Send standard events: fbq('track', 'Lead', {value: 10.0, currency: 'USD'});

C) Segment (analytics.js)
- Load only after consent:
  <script>!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)
  if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");
  else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview",
  "identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware",
  "addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];
  analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);
  analytics.push(e);return analytics}};
  for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}
  analytics.load=function(t){var e=document.createElement("script");
  e.type="text/javascript";e.async=!0;e.src="https://cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";
  var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};
  analytics._writeKey="SEGMENT_WRITE_KEY";} }(); window.analytics.load("SEGMENT_WRITE_KEY"); analytics.page();</script>

- Route tracking via router hooks: call analytics.page() on route changes.

Privacy and compliance
- Basic gate implemented; for GDPR/CCPA/IAB TCF:
  - Replace ConsentBanner with your CMP.
  - On consent changes, call:
    - GA4: gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' }) or set to 'denied'.
    - Meta: fbq('consent','grant' | 'revoke')
    - Segment: analytics.toggle(true|false) or block loading until granted.
  - If you use TCF, listen to __tcfapi('addEventListener', 2, callback) and translate purposes to provider-specific calls.

Caveats per framework
- React (CRA/Vite):
  - StrictMode double-invokes effects in development; duplicate prevention added.
  - Ensure only one router listener is mounted.
- Next.js:
  - app router hydration: only run page_view in client components.
  - pages router: disable auto page_view; send page view on routeChangeComplete.
- Vue 3:
  - Use router.afterEach; be mindful of initial navigation triggers.
- Angular:
  - Subscribe to Router events (NavigationEnd) once; avoid service re-instantiation.
- All:
  - Avoid duplicate page_view by always disabling send_page_view and sending manually.
  - Ensure consent state persists and is respected across navigations.

Step-by-step for this CRA repo
1) Configure env in frontend/.env.* (see templates above).
2) Ensure backend is running at http://localhost:8001 (or update REACT_APP_ANALYTICS_FALLBACK_URL).
3) Start dev:
   - cd frontend && yarn start
4) In browser:
   - Open DevTools Console and Network.
   - With consent denied: confirm no GA network calls are made.
   - Click Accept on the banner: watch gtag script load and initial page_view fire.
   - Navigate between routes: confirm 1 page_view per route change.
   - Click any button with data-analytics="cta": event cta_click appears in DebugView.
   - Click an external link: outbound_click event is sent.
5) Production:
   - Set production GA4 ID and REACT_APP_ENVIRONMENT=production.
   - yarn build and deploy.

Rollback / feature flag
- Set REACT_APP_ANALYTICS_ENABLED=false to disable analytics completely and rebuild.
- To quickly hide UI without changing behavior, remove ConsentBanner (not recommended; keep compliance).

Acceptance checklist
- Kill switch works (no GA requests when disabled).
- DNT respected (no GA or fallback when DNT is on and consent is auto-denied).
- Consent gate enforced (no GA load until granted; GA consent updated on grant).
- Initial page_view sent once on first render.
- SPA route changes send single page_view per change.
- Common events wired and visible in GA4 DebugView (cta_click, outbound_click, section_view, form_submit where used).
- Fallback endpoint receives events when GA blocked (200 responses and stored in DB).
- CSP with nonce compatible (dynamic script has nonce when provided).
- No console errors in typical flows; performance unaffected (script async, preconnects applied).
