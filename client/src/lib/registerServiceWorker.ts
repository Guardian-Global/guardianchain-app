// lib/registerServiceWorker.ts
export default function registerServiceWorker() {
  // Only register in production mode with HTTPS
  if (
    typeof window === "undefined" || 
    !("serviceWorker" in navigator) ||
    !import.meta.env.PROD ||
    window.location.protocol !== 'https:' ||
    window.location.hostname === 'localhost'
  ) {
    console.log("🔧 Service Worker registration skipped - not in production HTTPS environment");
    return;
  }

  // Check if we're in a valid scope (not an iframe or restricted context)
  try {
    if (window.parent !== window) {
      console.log("🔧 Service Worker registration skipped - running in iframe");
      return;
    }
  } catch (e) {
    // Cross-origin iframe, skip registration
    console.log("🔧 Service Worker registration skipped - cross-origin context");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("✅ Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        // Only log in production, silently fail in development
        if (import.meta.env.PROD) {
          console.warn("Service Worker registration failed:", err.message);
        }
      });
  });
}