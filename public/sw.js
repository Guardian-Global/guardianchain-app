const CACHE_NAME = "guardianchain-v1.0.0";
const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Core CSS and JS will be added dynamically
];

const API_CACHE_PATTERNS = [
  "/api/auth/user",
  "/api/get-user-tier",
  "/api/smri/",
  "/api/guardian-map/metrics",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("📦 Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    }),
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("🗑️ Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/)) {
    event.respondWith(cacheFirstWithFallback(request));
    return;
  }

  // Handle navigation requests with network-first strategy
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Default: try network first, fallback to cache
  event.respondWith(networkFirstWithFallback(request));
});

// Network-first strategy with cache fallback
async function networkFirstWithFallback(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      // Only cache certain API endpoints to avoid storage bloat
      const url = new URL(request.url);
      const shouldCache =
        API_CACHE_PATTERNS.some((pattern) =>
          url.pathname.startsWith(pattern),
        ) ||
        request.mode === "navigate" ||
        request.destination === "document";

      if (shouldCache) {
        cache.put(request, networkResponse.clone());
      }
    }

    return networkResponse;
  } catch (error) {
    console.log("🔄 Network failed, trying cache for:", request.url);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === "navigate") {
      return (
        cache.match("/") ||
        new Response(createOfflinePage(), {
          headers: { "Content-Type": "text/html" },
          status: 200,
        })
      );
    }

    throw error;
  }
}

// Cache-first strategy with network fallback
async function cacheFirstWithFallback(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log("📦 Cache and network both failed for:", request.url);
    throw error;
  }
}

// Create offline page
function createOfflinePage() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GuardianChain - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%);
          color: white;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 400px;
          padding: 2rem;
        }
        .logo {
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }
        .message {
          font-size: 1.125rem;
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }
        .button {
          background: linear-gradient(135deg, #8b5cf6, #06b6d4);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .button:hover {
          transform: translateY(-2px);
        }
        .features {
          margin-top: 2rem;
          text-align: left;
          opacity: 0.8;
        }
        .feature {
          margin: 0.5rem 0;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">GuardianChain</div>
        <div class="message">
          You're currently offline, but some features are still available.
        </div>
        <button class="button" onclick="window.location.reload()">
          Try Again
        </button>
        <div class="features">
          <div class="feature">✓ View cached truth capsules</div>
          <div class="feature">✓ Browse your reputation data</div>
          <div class="feature">✓ Access guardian network map</div>
          <div class="feature">✓ Review eternal contracts</div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Handle background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Background sync triggered:", event.tag);

  if (event.tag === "capsule-upload") {
    event.waitUntil(syncPendingCapsules());
  }

  if (event.tag === "smri-update") {
    event.waitUntil(syncSMRIData());
  }
});

// Sync pending capsules when back online
async function syncPendingCapsules() {
  try {
    const db = await openDB();
    const pendingCapsules = await getAllPendingCapsules(db);

    for (const capsule of pendingCapsules) {
      try {
        await fetch("/api/capsules", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(capsule.data),
        });

        // Remove from pending after successful upload
        await deletePendingCapsule(db, capsule.id);
        console.log("✅ Synced pending capsule:", capsule.id);
      } catch (error) {
        console.log("❌ Failed to sync capsule:", capsule.id, error);
      }
    }
  } catch (error) {
    console.log("❌ Background sync failed:", error);
  }
}

// Sync SMRI data when back online
async function syncSMRIData() {
  try {
    console.log("🔄 Syncing SMRI data...");
    // This would sync any pending SMRI updates
  } catch (error) {
    console.log("❌ SMRI sync failed:", error);
  }
}

// Simple IndexedDB helpers for offline storage
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("GuardianChainDB", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("pendingCapsules")) {
        db.createObjectStore("pendingCapsules", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("cachedData")) {
        db.createObjectStore("cachedData", { keyPath: "key" });
      }
    };
  });
}

async function getAllPendingCapsules(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pendingCapsules"], "readonly");
    const store = transaction.objectStore("pendingCapsules");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function deletePendingCapsule(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pendingCapsules"], "readwrite");
    const store = transaction.objectStore("pendingCapsules");
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}
