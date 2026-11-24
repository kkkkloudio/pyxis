// Pyxis offline fallback v4 — il vento prima, la memoria poi.
// V8.26: NETWORK-FIRST. Prima si chiede al server (così ogni aggiornamento
// arriva davvero), e solo se la rete manca si pesca dalla memoria. Così il
// telefono smette di vivere di ricordi vecchi mentre il mondo è già andato avanti.
const CACHE = 'pyxis-offline-v6';
const OFFLINE_PAGE = '/offline.html';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add(OFFLINE_PAGE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isApi = url.pathname.startsWith('/xrpc/') || url.pathname.startsWith('/api/');

  if (e.request.mode === 'navigate' && !isApi) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }
  if (e.request.method === 'GET' && !isApi) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.ok && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then((hit) => hit || caches.match(OFFLINE_PAGE)))
    );
    return;
  }
  e.respondWith(fetch(e.request));
});
