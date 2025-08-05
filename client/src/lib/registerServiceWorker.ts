// lib/registerServiceWorker.ts
export default function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  // Only register in production or when explicitly enabled
  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment && window.location.hostname === 'localhost') {
    console.log("🔧 Service Worker registration skipped in development");
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("✅ Service Worker registered:", reg.scope))
      .catch((err) => {
        if (isProduction) {
          console.error("❌ SW registration failed:", err);
        }
      });
  });
}