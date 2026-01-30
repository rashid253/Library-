self.addEventListener("install",e=>{
 e.waitUntil(
  caches.open("bazaar").then(c=>{
   return c.addAll([
    "index.html",
    "card.html",
    "shops.json",
    "manifest.json"
   ]);
  })
 );
});

self.addEventListener("fetch",e=>{
 e.respondWith(
  caches.match(e.request).then(r=>r||fetch(e.request))
 );
});
