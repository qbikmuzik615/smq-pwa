const V = 'smq-v3';
const ASSETS = ['/smq-pwa/', '/smq-pwa/index.html', '/smq-pwa/css/app.css', '/smq-pwa/js/app.js', '/smq-pwa/js/fluid-simulation.js', '/smq-pwa/manifest.webmanifest'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
