const CACHE="card-v1";

self.addEventListener("install",e=>{
 e.waitUntil(
  caches.open(CACHE).then(c=>{
   return c.addAll([
    "index.html",
    "card.html",
    "manifest.json"
   ]);
  })
 );
});

self.addEventListener("fetch",e=>{
 e.respondWith(
  caches.match(e.request).then(r=>{
   return r || fetch(e.request);
  })
 );
});
