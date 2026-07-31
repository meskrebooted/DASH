/* ===================== SERVICE WORKER ===================== */
const CACHE = 'dash-v1';
const STATIC = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Install: pre-cache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {})
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
// - Same-origin static assets (HTML/CSS/JS): cache-first, update in background
// - API calls (open-meteo, etc.): network-first, fallback to cache
// - External CDN: stale-while-revalidate
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAPI = url.hostname.includes('open-meteo.com')
    || url.hostname.includes('geocoding-api')
    || url.hostname.includes('hacker-news')
    || url.hostname.includes('coingecko.com')
    || url.hostname.includes('github.com')
    || url.hostname.includes('reddit.com')
    || url.hostname.includes('lobste.rs');
  const isCDN = url.hostname.includes('unpkg.com')
    || url.hostname.includes('cartocdn.com')
    || url.hostname.includes('openstreetmap.org')
    || url.hostname.includes('google.com');

  if(isAPI){
    // Network-first: try network, cache as fallback
    e.respondWith(
      fetch(e.request).then(res => {
        if(res.ok){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  if(isSameOrigin || isCDN){
    // Cache-first: serve from cache, update in background
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if(res.ok){
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Everything else: pass through
  e.respondWith(fetch(e.request).catch(() => new Response('', { status: 503 })));
});
