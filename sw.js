const CACHE = 'esptalk-v4';
const ASSETS = [
  './app.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap',
  './audio/a-la-derecha.m4a',
  './audio/a-la-izquierda.m4a',
  './audio/adios.m4a',
  './audio/agua-por-favor.m4a',
  './audio/aprender.m4a',
  './audio/azul.m4a',
  './audio/bien-gracias.m4a',
  './audio/buenas-noches.m4a',
  './audio/buenas-tardes.m4a',
  './audio/buenos-dias.m4a',
  './audio/cerca-lejos.m4a',
  './audio/como-estas.m4a',
  './audio/como-te-llamas.m4a',
  './audio/cuanto-cuesta.m4a',
  './audio/cuatro-cinco-seis.m4a',
  './audio/de-donde-eres.m4a',
  './audio/de-nada.m4a',
  './audio/dieciseis-veinte.m4a',
  './audio/diez-once-doce.m4a',
  './audio/donde-esta.m4a',
  './audio/dos.m4a',
  './audio/esta-delicioso.m4a',
  './audio/gracias.m4a',
  './audio/hasta-luego.m4a',
  './audio/hermano.m4a',
  './audio/hola.m4a',
  './audio/igualmente.m4a',
  './audio/la-cuenta-por-favor.m4a',
  './audio/la-madre-el-padre.m4a',
  './audio/lo-siento.m4a',
  './audio/lunes-martes-miercoles.m4a',
  './audio/lunes.m4a',
  './audio/madre.m4a',
  './audio/mas-despacio.m4a',
  './audio/me-llamo.m4a',
  './audio/mucho-gusto.m4a',
  './audio/necesito-ayuda.m4a',
  './audio/no-entiendo.m4a',
  './audio/padre.m4a',
  './audio/perdon.m4a',
  './audio/por-favor.m4a',
  './audio/puede-repetir.m4a',
  './audio/quisiera.m4a',
  './audio/rojo-azul-verde.m4a',
  './audio/rojo.m4a',
  './audio/siete-ocho-nueve.m4a',
  './audio/sin-por-favor.m4a',
  './audio/soy-de.m4a',
  './audio/todo-recto.m4a',
  './audio/trece-catorce-quince.m4a',
  './audio/uno-dos-tres.m4a',
  './audio/uno.m4a',
  './audio/verde.m4a'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase.co')) return;

  // Network-first for the app HTML so updates always show when online;
  // fall back to cache only when offline.
  const isHTML = e.request.mode === 'navigate'
    || e.request.destination === 'document'
    || e.request.url.includes('app.html');
  if (isHTML) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./app.html')))
    );
    return;
  }

  // Cache-first for static assets (audio, fonts, manifest).
  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
