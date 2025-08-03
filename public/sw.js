// GuardianChain Service Worker
// Provides offline functionality and background sync

const CACHE_NAME = 'guardianchain-v1';
const STATIC_CACHE = 'guardianchain-static-v1';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip API requests - let them go to network
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Don't cache non-successful responses
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // Clone the response for caching
            const responseToCache = fetchResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for offline capsule creation
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'capsule-upload') {
    event.waitUntil(syncCapsules());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New truth verification available',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'guardianchain-notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('GuardianChain', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper function to sync offline capsules
async function syncCapsules() {
  try {
    // Get offline capsules from IndexedDB or localStorage
    const offlineCapsules = await getOfflineCapsules();
    
    for (const capsule of offlineCapsules) {
      try {
        const response = await fetch('/api/capsules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(capsule)
        });

        if (response.ok) {
          // Remove from offline storage
          await removeOfflineCapsule(capsule.id);
          console.log('✅ Capsule synced:', capsule.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync capsule:', capsule.id, error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Placeholder functions for offline storage
async function getOfflineCapsules() {
  // Implement IndexedDB or localStorage retrieval
  return [];
}

async function removeOfflineCapsule(id) {
  // Implement removal from offline storage
  console.log('Removing offline capsule:', id);
}