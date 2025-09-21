// Analytics DOM helpers for common events (outbound links, button clicks, form submits)
import Analytics from "./index";

/**
 * Attach a document-level click listener to capture outbound link clicks.
 * - Tracks event: "outbound_click" with { url, text, rel, target }
 * - Returns a cleanup function to remove the listener.
 */
export function enableOutboundLinkTracking() {
  const handler = (e) => {
    try {
      // Find nearest anchor in composed path to handle nested elements
      const path = e.composedPath ? e.composedPath() : [];
      let anchor = null;

      if (path && path.length) {
        anchor = path.find((el) => el && el.tagName === "A");
      }
      if (!anchor) {
        // Fallback
        anchor = e.target && e.target.closest ? e.target.closest("a") : null;
      }
      if (!anchor || !anchor.href) return;

      const url = new URL(anchor.href, window.location.href);
      const isExternal = url.origin !== window.location.origin || anchor.rel?.includes("external");
      if (!isExternal) return;

      Analytics.track("outbound_click", {
        url: url.href,
        text: (anchor.textContent || "").trim().slice(0, 120),
        rel: anchor.rel || "",
        target: anchor.target || "",
      });
    } catch {
      // ignore
    }
  };

  document.addEventListener("click", handler, true);
  return () => {
    document.removeEventListener("click", handler, true);
  };
}

/**
 * Track clicks on elements matching a selector.
 * - eventName default: "button_click"
 * - params can be static object or a function (element) => object
 * - Returns cleanup to remove the listener
 */
export function trackClicks(selector, eventName = "button_click", params) {
  const handler = (e) => {
    const el = e.target?.closest?.(selector);
    if (!el) return;
    const dynamicParams = typeof params === "function" ? params(el) : params || {};
    const id = el.id || el.getAttribute("data-id") || undefined;
    const label = el.getAttribute("aria-label") || el.textContent?.trim()?.slice(0, 120) || undefined;
    Analytics.track(eventName, { element: selector, id, label, ...dynamicParams });
  };
  document.addEventListener("click", handler, true);
  return () => document.removeEventListener("click", handler, true);
}

/**
 * Track form submissions for forms matching selector.
 * - event: "form_submit" with { form: selector, id, name, action, method }
 * - mapFn optional to enrich payload: (formEl) => object
 * - Returns cleanup
 */
export function trackFormSubmits(selector, mapFn) {
  const handler = (e) => {
    const form = e.target?.closest?.(selector);
    if (!form || form.tagName !== "FORM") return;
    const base = {
      form: selector,
      id: form.id || undefined,
      name: form.getAttribute("name") || undefined,
      action: form.getAttribute("action") || window.location.pathname,
      method: (form.getAttribute("method") || "get").toLowerCase(),
    };
    const extra = typeof mapFn === "function" ? mapFn(form) : {};
    Analytics.track("form_submit", { ...base, ...extra });
  };
  document.addEventListener("submit", handler, true);
  return () => document.removeEventListener("submit", handler, true);
}

/**
 * Utility to wire all default DOM trackers at once.
 * - Outbound links
 * - Form submits
 * - Example button clicks: data-analytics="cta"
 */
export function initDOMTracking() {
  const cleanups = [];
  cleanups.push(enableOutboundLinkTracking());

  // Track all form submissions by default; customize selector as needed
  cleanups.push(trackFormSubmits("form"));

  // Example: track any element with data-analytics="cta"
  cleanups.push(
    trackClicks('[data-analytics="cta"]', "cta_click", (el) => ({
      section: el.getAttribute("data-section") || undefined,
      variant: el.getAttribute("data-variant") || undefined,
    })),
  );

  return () => cleanups.forEach((off) => off && off());
}