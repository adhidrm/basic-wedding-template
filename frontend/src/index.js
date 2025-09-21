import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { initDOMTracking } from "./analytics/events";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Initialize global DOM tracking once (guarded to avoid duplicates in StrictMode)
if (typeof window !== "undefined") {
  if (!window.__DOM_TRACKING_INIT__) {
    try {
      window.__DOM_TRACKING_INIT__ = initDOMTracking();
    } catch {
      // ignore
    }
  }
}
