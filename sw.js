// No modifica localStorage ni identificadores de dispositivo; no guarda datos operativos en caché.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('cmms-lubricacion-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(new URL(event.request.url).origin===self.location.origin)event.respondWith(fetch(event.request,{cache:'no-store'}));});
