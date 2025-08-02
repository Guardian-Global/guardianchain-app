// GuardianChain Service Worker - Offline Support for Truth Capsules
const CACHE_NAME = 'guardianchain-v1';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Resources to cache for offline access
const STATIC_RESOURCES = [
  '/',
  '/offline.html',
  '/manifest.json'
];

// API endpoints to cache selectively
const CACHEABLE_APIS = [
  '/api/capsules',
  '/api/auth/user',
  '/api/metadata/',
  '/api/replay-capsule'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('🔧 GuardianChain Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching essential resources');
        return cache.addAll(STATIC_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 GuardianChain Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and chrome-extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(handleFetch(request, url));
});

async function handleFetch(request, url) {
  try {
    // Strategy 1: Cache-first for static resources and essential APIs
    if (shouldCacheFirst(url)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network-first for dynamic content
    if (shouldNetworkFirst(url)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Network-only for authentication and mutations
    if (shouldNetworkOnly(url)) {
      return await fetch(request);
    }
    
    // Default: Network-first with offline fallback
    return await networkFirstWithFallback(request);
    
  } catch (error) {
    console.error('🔄 Fetch error:', error);
    return await getOfflineFallback(request);
  }
}

function shouldCacheFirst(url) {
  return STATIC_RESOURCES.some(resource => url.pathname === resource) ||
         url.pathname.startsWith('/assets/') ||
         url.pathname.startsWith('/icons/') ||
         url.pathname.includes('.css') ||
         url.pathname.includes('.js');
}

function shouldNetworkFirst(url) {
  return CACHEABLE_APIS.some(api => url.pathname.startsWith(api));
}

function shouldNetworkOnly(url) {
  return url.pathname.startsWith('/api/auth/') ||
         url.pathname.startsWith('/api/mint') ||
         url.pathname.startsWith('/api/yield') ||
         url.pathname.includes('webhook') ||
         request.method !== 'GET';
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isCacheExpired(cachedResponse)) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || await getOfflineFallback(request);
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || await getOfflineFallback(request);
  }
}

async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || await getOfflineFallback(request);
  }
}

async function getOfflineFallback(request) {
  // Return appropriate offline fallback based on request type
  if (request.destination === 'document') {
    return await caches.match('/offline.html');
  }
  
  // For API requests, return a basic offline response
  if (request.url.includes('/api/')) {
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This feature requires an internet connection' 
      }), 
      { 
        status: 503, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
  
  // For other resources, return a generic offline response
  return new Response('Offline', { status: 503 });
}

function isCacheExpired(response) {
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const cacheDate = new Date(dateHeader);
  const now = new Date();
  return (now.getTime() - cacheDate.getTime()) > CACHE_DURATION;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'capsule-sync') {
    event.waitUntil(syncOfflineCapsules());
  }
});

async function syncOfflineCapsules() {
  try {
    // Retrieve offline capsule data from IndexedDB and sync with server
    console.log('📦 Syncing offline capsules...');
    // Implementation would depend on your offline storage strategy
  } catch (error) {
    console.error('❌ Failed to sync offline capsules:', error);
  }
}

// Push notifications for capsule updates
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New activity in your truth vault',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'guardianchain-notification',
    data: {
      url: data.url || '/',
      action: data.action
    },
    actions: [
      {
        action: 'view',
        title: 'View Capsule',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'GuardianChain', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'view') {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});