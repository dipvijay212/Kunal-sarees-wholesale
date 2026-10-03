// Kunal Sarees PWA Service Worker
const CACHE_NAME = 'kunal-sarees-pwa-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests with HTTP/HTTPS schemes
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  // Let browser network handle all normal traffic, with offline fallback if cached
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((res) => {
        if (res) return res;
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      });
    })
  );
});
