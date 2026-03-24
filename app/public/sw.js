const CACHE_NAME = 'fularani-offline-v4';
const OFFLINE_URL = '/offline.html';
const ASSETS_TO_CACHE = [
  OFFLINE_URL,
  '/logo.png',
];

// Install event - cache the offline page and assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Tell the active service worker to take control of the page immediately
  self.clients.claim();
});

// Fetch event - serve offline page when network fails
self.addEventListener('fetch', (event) => {
  // 1. Bypass Service Worker for external scripts (Meta Pixel, Google, etc.)
  // These should ALWAYS come from the network, never the cache.
  if (
    event.request.url.includes('facebook') || 
    event.request.url.includes('google') || 
    !event.request.url.startsWith(self.location.origin)
  ) {
    return; // Let the browser handle standard network fetching
  }

  // Handle navigation requests (page loads) — show offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.open(CACHE_NAME).then((cache) => {
          return cache.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Handle cached assets (logo, etc.) — for internal assets only
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }).catch(() => {
      // Return nothing if fetch fails for non-cached assets
      return; 
    })
  );
});
