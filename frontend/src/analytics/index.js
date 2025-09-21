// Analytics module for CRA (GA4 via gtag.js) with:
// - Basic consent gate (localStorage) + Do Not Track respect
// - Env-based IDs + kill switch
// - Idempotent loader, queue, SPA route tracking helper
// - Fallback POST endpoint when gtag is blocked
/* eslint-disable no-underscore-dangle */

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Configuration (CRA env)
 */
const CFG = {
  enabled: (process.env.REACT_APP_ANALYTICS_ENABLED ?? "true").toLowerCase() === "true",
  ga4Id: process.env.REACT_APP_GA4_MEASUREMENT_ID || "",
  env: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development",
  fallbackUrl: process.env.REACT_APP_ANALYTICS_FALLBACK_URL || "",
  // Optional CSP nonce for script tags; if you use a server that injects nonces, thread it through here:
  nonce: window.__CSP_NONCE__ || undefined,
};

const isDev = CFG.env !== "production";

function debug(...args) {
  if (isDev) {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", ...args);
  }
}

/**
 * Do Not Track
 */
function isDNTEnabled() {
  try {
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return dnt === "1" || dnt === "yes";
  } catch {
    return false;
  }
}

/**
 * Consent manager (basic gate; upgrade to CMP/TCF by wiring grant/deny from CMP callbacks)
 */
const CONSENT_KEY = "analytics_consent_v1"; // 'granted' | 'denied' | null
const listeners = new Set();

function getStoredConsent() {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

function setStoredConsent(value) {
  try {
    if (value === null) {
      localStorage.removeItem(CONSENT_KEY);
    } else {
      localStorage.setItem(CONSENT_KEY, value);
    }
  } catch {
    // ignore
  }
}

function notifyConsentChange() {
  const status = getStoredConsent();
  listeners.forEach((cb) => {
    try {
      cb(status);
    } catch {
      // ignore
    }
  });
}

export const AnalyticsConsent = {
  get status() {
    return getStoredConsent();
  },
  grant() {
    setStoredConsent("granted");
    notifyConsentChange();
  },
  deny() {
    setStoredConsent("denied");
    notifyConsentChange();
  },
  reset() {
    setStoredConsent(null);
    notifyConsentChange();
  },
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};

/**
 * Client identifier (for fallback endpoint)
 */
const CID_KEY = "analytics_cid";
function getCid() {
  try {
    let cid = localStorage.getItem(CID_KEY);
    if (!cid) {
      cid = self.crypto?.randomUUID ? self.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(CID_KEY, cid);
    }
    return cid;
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

/**
 * Loader/idempotent guards
 */
function ensureGtagStub() {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }
  if (!window.gtag) {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
}

function injectScript(src, { async = true, defer = false, nonce } = {}) {
  return new Promise((resolve, reject) => {
    // If already present
    const existing = Array.from(document.getElementsByTagName("script")).find((s) => s.src === src);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        return resolve();
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", (e) => reject(e));
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = async;
    s.defer = defer;
    if (nonce) s.nonce = nonce;
    s.referrerPolicy = "origin";
    s.onload = () => {
      s.dataset.loaded = "true";
      resolve();
    };
    s.onerror = (e) => reject(e);
    document.head.appendChild(s);
  });
}

let gtagLoading = null;
let gtagReady = false;

async function loadGtagOnce() {
  if (gtagReady) return;
  if (gtagLoading) {
    await gtagLoading;
    return;
  }
  ensureGtagStub();

  // Configure to avoid automatic page_view
  window.gtag("js", new Date());

  // Consent defaults (strict: deny until granted)
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    functionality_storage: "denied",
    personalization_storage: "denied",
    security_storage: "granted",
  });

  // Inject gtag.js
  const src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CFG.ga4Id)}`;
  gtagLoading = injectScript(src, { async: true, nonce: CFG.nonce })
    .then(() => {
      // Initialize GA4 config but still no auto page view
      window.gtag("config", CFG.ga4Id, {
        send_page_view: false,
      });
      gtagReady = true;
      debug("gtag loaded");
    })
    .catch((err) => {
      gtagLoading = null;
      debug("gtag load failed", err);
      throw err;
    });

  await gtagLoading;
}

/**
 * Allowance gate
 */
function isAllowedNow() {
  return CFG.enabled && !!CFG.ga4Id && !isDNTEnabled() && AnalyticsConsent.status === "granted";
}

/**
 * Event queue (flush after gtag ready)
 */
const queue = [];
function enqueue(fn) {
  queue.push(fn);
}
function flushQueue() {
  while (queue.length) {
    const fn = queue.shift();
    try {
      fn();
    } catch {
      // ignore
    }
  }
}

/**
 * Fallback POST sender
 */
async function sendFallback(payload) {
  if (!CFG.fallbackUrl) return;
  try {
    await fetch(CFG.fallbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        ...payload,
        cid: getCid(),
        env: CFG.env,
        userAgent: navigator.userAgent,
        ts: Date.now(),
      }),
    });
  } catch (e) {
    debug("fallback send failed", e);
  }
}

/**
 * De-duplication to mitigate StrictMode double-invoke in dev
 */
const dedupe = new Map(); // key -> timestamp
const DEDUPE_TTL_MS = 2000;
function shouldSkipDuplicate(key) {
  const now = Date.now();
  const last = dedupe.get(key) || 0;
  if (now - last < DEDUPE_TTL_MS) return true;
  dedupe.set(key, now);
  // cleanup occasionally
  if (dedupe.size > 1000) {
    const cutoff = now - DEDUPE_TTL_MS;
    for (const [k, v] of dedupe.entries()) {
      if (v < cutoff) dedupe.delete(k);
    }
  }
  return false;
}

/**
 * Public API
 */
export const Analytics = {
  initialized: false,

  async init() {
    if (this.initialized) return;
    this.initialized = true;

    // React to consent changes
    AnalyticsConsent.subscribe(async (status) => {
      if (status === "granted" && isAllowedNow()) {
        try {
          await loadGtagOnce();
          // Update consent to granted on GA side
          window.gtag("consent", "update", {
            ad_storage: "granted",
            analytics_storage: "granted",
          });
          flushQueue();
        } catch (e) {
          // If blocked, we will rely on fallback sends
          debug("gtag failed post-consent", e);
        }
      }
    });

    // If already allowed, load immediately
    if (isAllowedNow()) {
      try {
        await loadGtagOnce();
        window.gtag("consent", "update", {
          ad_storage: "granted",
          analytics_storage: "granted",
        });
        flushQueue();
      } catch (e) {
        debug("gtag failed initial load", e);
      }
    } else {
      if (!CFG.enabled) debug("analytics disabled via flag");
      if (!CFG.ga4Id) debug("missing REACT_APP_GA4_MEASUREMENT_ID");
      if (isDNTEnabled()) debug("DNT enabled; analytics suppressed");
      if (AnalyticsConsent.status !== "granted") debug("consent not granted; gating analytics");
    }
  },

  // page view
  page({ path, title } = {}) {
    const p = path ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
    const t = title ?? (typeof document !== "undefined" ? document.title : undefined);

    const key = `page:${p}:${t ?? ""}`;
    if (shouldSkipDuplicate(key)) return;

    const send = () => {
      try {
        if (gtagReady && window.gtag) {
          window.gtag("event", "page_view", {
            page_location: window.location.origin + p,
            page_path: p,
            page_title: t,
          });
        } else {
          // Fallback
          sendFallback({ type: "page_view", path: p, title: t });
        }
      } catch (e) {
        debug("page send error", e);
      }
    };

    if (isAllowedNow() && gtagReady) {
      send();
    } else {
      enqueue(send);
    }
  },

  // custom event
  track(eventName, params = {}) {
    const name = String(eventName || "").trim();
    if (!name) return;

    // Minimal standardized schema mapping
    // Common keys: category, action, label, value, context
    const payload = {
      ...params,
    };

    const key = `event:${name}:${JSON.stringify(payload)}`;
    if (shouldSkipDuplicate(key)) return;

    const send = () => {
      try {
        if (gtagReady && window.gtag) {
          window.gtag("event", name, payload);
        } else {
          sendFallback({ type: "event", event_name: name, params: payload });
        }
      } catch (e) {
        debug("event send error", e);
      }
    };

    if (isAllowedNow() && gtagReady) {
      send();
    } else {
      enqueue(send);
    }
  },

  // Optional: set user properties
  userProperties(props = {}) {
    const send = () => {
      try {
        if (gtagReady && window.gtag) {
          window.gtag("set", "user_properties", props);
        } else {
          sendFallback({ type: "user_properties", props });
        }
      } catch (e) {
        debug("user_properties send error", e);
      }
    };
    if (isAllowedNow() && gtagReady) {
      send();
    } else {
      enqueue(send);
    }
  },
};

/**
 * React Router listener for SPA page views
 * Place inside <BrowserRouter> to track initial view and subsequent route changes.
 */
export function AnalyticsRouterListener() {
  const location = useLocation();
  const lastPathRef = useRef("");

  useEffect(() => {
    // initial page view
    const path = window.location.pathname + window.location.search;
    lastPathRef.current = path;
    Analytics.page({ path, title: document.title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (path !== lastPathRef.current) {
      lastPathRef.current = path;
      Analytics.page({ path, title: document.title });
    }
  }, [location]);

  return null;
}

/**
 * Simple consent banner (optional UI). Shows until user accepts or declines.
 * You can style or replace with a CMP. This respects DNT: if DNT is on, it will auto-decline.
 */
export function ConsentBanner() {
  const [status, setStatus] = useState(AnalyticsConsent.status);
  const [visible, setVisible] = useState(() => (AnalyticsConsent.status ? false : true));

  useEffect(() => {
    const unsub = AnalyticsConsent.subscribe((s) => {
      setStatus(s);
      setVisible(!s);
    });
    // Auto-decline if DNT is enabled
    if (isDNTEnabled() && !AnalyticsConsent.status) {
      AnalyticsConsent.deny();
    }
    return () => unsub();
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        padding: "12px",
        background: "rgba(0,0,0,0.85)",
        color: "white",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <span style={{ maxWidth: 720, lineHeight: 1.4 }}>
        We use cookies and similar technologies to analyze traffic. You can accept or decline analytics. You can change
        your choice anytime.
      </span>
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          type="button"
          onClick={() => AnalyticsConsent.deny()}
          style={{
            padding: "8px 12px",
            background: "#444",
            color: "white",
            borderRadius: 6,
            border: "1px solid #666",
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => AnalyticsConsent.grant()}
          style={{
            padding: "8px 12px",
            background: "#22c55e",
            color: "black",
            borderRadius: 6,
            border: "1px solid #16a34a",
            fontWeight: 600,
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}

// Initialize on module import to start listening for consent and prepare queue.
// Do not load remote script yet; will wait until consent + allowed.
Analytics.init();

export default Analytics;